// Orchestration for the scheduled affiliate sync. Server-side only — loaded
// dynamically inside server functions / server route handlers.
import type { SupabaseClient } from "@supabase/supabase-js";
import { SEARCH_PLAN, bucketById, isLikelyNotMens, type BucketId } from "./category-map";
import type { PaapiItem } from "./paapi.server";

export type SyncSourceResult = {
  slug: string;
  status: "ok" | "error" | "needs_setup" | "skipped";
  imported: number;
  updated: number;
  hidden: number;
  /** Items the source API actually returned, before filtering. */
  fetched: number;
  errors: string[];
};

export type SyncSummary = {
  fetched: number;
  saved: number;
  skipped: number;
  failed: number;
};

/** Actual counts across sources — never report success when saved is 0. */
export function summarizeSync(results: SyncSourceResult[]): SyncSummary {
  const summary: SyncSummary = { fetched: 0, saved: 0, skipped: 0, failed: 0 };
  for (const r of results) {
    if (r.status === "skipped") summary.skipped += 1;
    else if (r.status === "error" || r.status === "needs_setup") summary.failed += 1;
    else {
      summary.fetched += r.fetched;
      summary.saved += r.imported + r.updated;
    }
  }
  return summary;
}

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=900&q=70";

type AdminDb = SupabaseClient;

export async function runSync(
  sourceSlug?: string,
): Promise<{ ran: string[]; results: SyncSourceResult[] }> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const db = supabaseAdmin as AdminDb;
  const { data: sources, error } = await db
    .from("affiliate_sources")
    .select("*")
    .eq("is_active", true);
  if (error) throw new Error(error.message);
  const results: SyncSourceResult[] = [];
  const ran: string[] = [];
  for (const source of sources ?? []) {
    if (sourceSlug && source.slug !== sourceSlug) continue;
    ran.push(source.slug);
    results.push(
      source.kind === "paapi"
        ? await runPaapiSource(db, source.slug)
        : {
            slug: source.slug,
            status: "skipped",
            imported: 0,
            updated: 0,
            hidden: 0,
            fetched: 0,
            errors: ["No authorized automatic feed is connected for this partner yet."],
          },
    );
  }
  return { ran, results, summary: summarizeSync(results) };
}

async function recordRun(
  db: AdminDb,
  slug: string,
  status: string,
  startedAt: string,
  counts: { imported: number; updated: number; hidden: number },
  error: string | null,
  detail: Record<string, unknown>,
) {
  const { error: insertError } = await db.from("sync_runs").insert({
    source_slug: slug,
    status,
    started_at: startedAt,
    finished_at: new Date().toISOString(),
    imported: counts.imported,
    updated: counts.updated,
    hidden: counts.hidden,
    error: error ?? null,
    detail: detail ?? {},
  });
  if (insertError) console.error("sync_runs insert failed:", insertError.message);
}

async function runPaapiSource(db: AdminDb, slug: string): Promise<SyncSourceResult> {
  const startedAt = new Date().toISOString();
  const base = { slug, imported: 0, updated: 0, hidden: 0 };
  const { paapiConfigured, paapiSetupHint, searchAll } = await import("./paapi.server");

  if (!paapiConfigured()) {
    const msg = paapiSetupHint();
    await recordRun(db, slug, "error", startedAt, base, msg, { reason: "not_configured" });
    await db
      .from("affiliate_sources")
      .update({ last_sync_at: startedAt, last_sync_status: "needs_setup", last_sync_error: msg })
      .eq("slug", slug);
    return { ...base, status: "needs_setup", fetched: 0, errors: [msg] };
  }

  try {
    // Every returned item inherits its search's style bucket.
    const bucketByKeywords = new Map(SEARCH_PLAN.map((s) => [s.keywords, s.bucket]));
    const plan = SEARCH_PLAN.map((s) => ({
      keywords: s.keywords,
      searchIndex: bucketById(s.bucket).searchIndex,
    }));

    const picked: { item: PaapiItem; bucket: BucketId }[] = [];
    const seen = new Set<string>();
    let fetched = 0;
    const searchErrors = await searchAll(plan, (items, keywords) => {
      fetched += items.length;
      const bucket = bucketByKeywords.get(keywords);
      if (!bucket) return;
      for (const item of items) {
        if (!item.price || !item.title || !item.url) continue;
        if (isLikelyNotMens(item.title)) continue;
        if (seen.has(item.asin)) continue;
        seen.add(item.asin);
        picked.push({ item, bucket });
      }
    });

    const slugs = picked.map((p) => `amz-${p.item.asin}`);
    const existing = new Set<string>();
    for (let i = 0; i < slugs.length; i += 500) {
      const { data, error } = await db
        .from("products")
        .select("slug")
        .in("slug", slugs.slice(i, i + 500));
      if (error) throw new Error(error.message);
      for (const row of data ?? []) existing.add(row.slug);
    }

    const rows = picked.map(({ item, bucket }) => {
      const b = bucketById(bucket);
      const isNew = !existing.has(`amz-${item.asin}`);
      const price = item.price ?? 0;
      const original = item.originalPrice && item.originalPrice > price ? item.originalPrice : price;
      return {
        slug: `amz-${item.asin}`,
        title: item.title.slice(0, 200),
        brand: (item.brand ?? "").trim().slice(0, 100) || "Generic",
        category: b.category,
        subcategory: b.label,
        source: "Amazon",
        price,
        original_price: original,
        image_url: item.image ?? PLACEHOLDER_IMAGE,
        affiliate_url: item.url,
        description: item.features.slice(0, 5).join(" · ").slice(0, 2000),
        gender: "men",
        sizes: [] as string[],
        colors: [] as string[],
        tags: [b.label],
        availability: item.inStock === false ? "out_of_stock" : "in_stock",
        enrich_status: "done",
        enriched_at: new Date().toISOString(),
        // Newly discovered products surface as new arrivals; updates never
        // touch an existing product's flags.
        ...(isNew ? { is_new_arrival: true } : {}),
      };
    });

    let imported = 0;
    let hidden = 0;
    for (const row of rows) {
      if (!existing.has(row.slug)) imported += 1;
      if (row.availability === "out_of_stock") hidden += 1;
    }
    for (let i = 0; i < rows.length; i += 500) {
      const { error } = await db
        .from("products")
        .upsert(rows.slice(i, i + 500) as never, { onConflict: "slug" });
      if (error) throw new Error(error.message);
    }

    const totalFailure = rows.length === 0 && searchErrors.length > 0;
    const status: "ok" | "error" = totalFailure ? "error" : "ok";
    const finishedAt = new Date().toISOString();
    await recordRun(
      db,
      slug,
      status,
      startedAt,
      { imported, updated: rows.length - imported, hidden },
      totalFailure ? searchErrors[0] : null,
      { searches: plan.length, search_errors: searchErrors.length, errors: searchErrors.slice(0, 10) },
    );
    const { error: srcErr } = await db
      .from("affiliate_sources")
      .update({
        last_sync_at: finishedAt,
        last_sync_status: status,
        last_sync_error: status === "error" ? searchErrors.slice(0, 3).join(" | ").slice(0, 2000) : null,
      })
      .eq("slug", slug);
    if (srcErr) throw new Error(srcErr.message);

    return {
      slug,
      status,
      imported,
      updated: rows.length - imported,
      hidden,
      fetched,
      errors: searchErrors,
    };
  } catch (e) {
    const msg = (e as Error).message.slice(0, 2000);
    await recordRun(db, slug, "error", startedAt, { imported: 0, updated: 0, hidden: 0 }, msg, {});
    await db
      .from("affiliate_sources")
      .update({ last_sync_at: new Date().toISOString(), last_sync_status: "error", last_sync_error: msg })
      .eq("slug", slug);
    return { slug, status: "error", imported: 0, updated: 0, hidden: 0, fetched: 0, errors: [msg] };
  }
}
