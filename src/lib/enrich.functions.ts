import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  isJunkBrand,
  isJunkDescription,
  isJunkImage,
  isJunkTitle,
  isPlaceholderImage,
} from "./enrich-validate";

const GATEWAY = "https://connector-gateway.lovable.dev/firecrawl/v2";

type Scraped = {
  title?: string | null;
  brand?: string | null;
  price?: number | string | null;
  original_price?: number | string | null;
  image_url?: string | null;
  description?: string | null;
};

const EXTRACT_SCHEMA = {
  type: "object",
  properties: {
    title: { type: "string", description: "The exact product name shown on the page" },
    brand: { type: "string", description: "The brand or manufacturer name" },
    price: { type: "number", description: "Current selling price as a plain number, no currency symbol" },
    original_price: {
      type: "number",
      description: "Original / MRP / struck-through price as a plain number. Use the current price if none shown.",
    },
    image_url: { type: "string", description: "Absolute URL of the main product image" },
    description: { type: "string", description: "Short product description, 1-3 sentences, plain text" },
  },
} as const;

function toNumber(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const n = Number(v.replace(/[^\d.]/g, ""));
    return Number.isFinite(n) && n > 0 ? n : null;
  }
  return null;
}

function clean(v: unknown, max: number): string | null {
  if (typeof v !== "string") return null;
  const s = v.replace(/\s+/g, " ").trim();
  return s ? s.slice(0, max) : null;
}

async function scrapeProduct(url: string): Promise<Scraped> {
  const lovableKey = process.env.LOVABLE_API_KEY;
  const firecrawlKey = process.env.FIRECRAWL_API_KEY;
  if (!lovableKey || !firecrawlKey) {
    throw new Error("Scraping is not configured (missing Firecrawl connection).");
  }

  const res = await fetch(`${GATEWAY}/scrape`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": firecrawlKey,
    },
    body: JSON.stringify({
      url,
      onlyMainContent: true,
      formats: [{ type: "json", schema: EXTRACT_SCHEMA }],
    }),
  });

  const body = await res.text();
  if (!res.ok) {
    if (res.status === 402) throw new Error("Firecrawl credits exhausted.");
    throw new Error(`Scrape failed [${res.status}]: ${body.slice(0, 200)}`);
  }

  type Meta = { url?: string; sourceURL?: string };
  let parsed: { json?: Scraped; metadata?: Meta; data?: { json?: Scraped; metadata?: Meta } };

  try {
    parsed = JSON.parse(body);
  } catch {
    throw new Error("Scrape returned an unreadable response.");
  }
  const json = parsed.json ?? parsed.data?.json;
  const landedOn = parsed.data?.metadata?.url ?? parsed.data?.metadata?.sourceURL ?? "";
  if (!json) throw new Error("No product data found on that page.");

  // Guard against category / search / 404 pages, which would otherwise write
  // junk like "Search Results" over the product record.
  const title = clean(json.title, 200) ?? "";
  const looksLikeListing =
    /search results|no matches|page not found|404|not available/i.test(title) ||
    /\/search|search\?|\?rf=|category|\/shop\//i.test(landedOn);
  if (!toNumber(json.price) || looksLikeListing) {
    throw new Error(
      "This link is not a single product page (no price found) — it resolves to a category, search or expired page. Replace it with a direct product link.",
    );
  }
  return json;
}


async function assertAdmin(supabase: { from: (t: string) => any }, userId: string) {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error || !data) throw new Error("Forbidden");
}

export const adminEnrichStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase as never, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const counts: Record<string, number> = { pending: 0, done: 0, failed: 0 };
    for (const status of ["pending", "done", "failed"]) {
      const { count } = await supabaseAdmin
        .from("products")
        .select("id", { count: "exact", head: true })
        .eq("enrich_status", status);
      counts[status] = count ?? 0;
    }
    return counts as { pending: number; done: number; failed: number };
  });

/**
 * Visits each product's affiliate URL and fills in any MISSING real title /
 * brand / price / image / description. Data that is already correct — in
 * particular everything imported from a CSV — is never overwritten, and any
 * scraped value that looks like a promotional banner is rejected. The
 * affiliate URL itself is never modified.
 */
export const adminEnrichBatch = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        slugs: z.array(z.string()).max(50).optional(),
        limit: z.number().int().min(1).max(10).default(5),
        retryFailed: z.boolean().default(false),
      })
      .parse(input ?? {}),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase as never, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    let query = supabaseAdmin
      .from("products")
      .select(
        "id, slug, affiliate_url, title, brand, price, original_price, image_url, description",
      )
      .not("affiliate_url", "is", null);

    if (data.slugs?.length) {
      query = query.in("slug", data.slugs);
    } else {
      query = query.in("enrich_status", data.retryFailed ? ["pending", "failed"] : ["pending"]);
    }

    const { data: rows, error } = await query.limit(data.limit);
    if (error) throw new Error(error.message);

    const targets = rows ?? [];
    let updated = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const row of targets) {
      try {
        const s = await scrapeProduct(row.affiliate_url as string);

        // A scrape whose title is a promo banner (deal copy, nav content)
        // means nothing on that page is trustworthy — fail without touching
        // the stored product data.
        const scrapedTitle = clean(s.title, 200) ?? "";
        if (!scrapedTitle || isJunkTitle(scrapedTitle)) {
          throw new Error(
            "Could not read real product details from this link — the page showed a promotional banner or category page instead of a single product. Stored data was left unchanged.",
          );
        }

        // Fill-only-missing: never overwrite data that is already correct
        // (e.g. imported from a CSV). A field is filled only when its current
        // value is empty, a known-junk scrape, or the neutral placeholder.
        const price = toNumber(s.price);
        const original = toNumber(s.original_price);
        const curTitle = clean(row.title, 200) ?? "";
        const curBrand = clean(row.brand, 100) ?? "";
        const curDescription = clean(row.description, 2000) ?? "";
        const curImage = clean(row.image_url, 1000) ?? "";
        const curPrice = Number(row.price) || 0;
        const curOriginal = Number(row.original_price) || 0;

        const patch: Record<string, unknown> = {
          enriched_at: new Date().toISOString(),
          enrich_status: "done",
          enrich_error: null,
        };
        let changed = false;

        if (isJunkTitle(curTitle)) {
          patch.title = scrapedTitle;
          changed = true;
        }

        const scrapedBrand = clean(s.brand, 100);
        if (
          scrapedBrand &&
          !isJunkBrand(scrapedBrand) &&
          (!curBrand || isJunkBrand(curBrand) || curBrand.toLowerCase() === "generic")
        ) {
          patch.brand = scrapedBrand;
          changed = true;
        }

        const scrapedDescription = clean(s.description, 2000);
        if (
          scrapedDescription &&
          !isJunkDescription(scrapedDescription) &&
          (!curDescription || isJunkDescription(curDescription))
        ) {
          patch.description = scrapedDescription;
          changed = true;
        }

        const scrapedImage = clean(s.image_url, 1000);
        if (
          scrapedImage &&
          /^https?:\/\//i.test(scrapedImage) &&
          !isJunkImage(scrapedImage) &&
          (!curImage || isJunkImage(curImage) || isPlaceholderImage(curImage))
        ) {
          patch.image_url = scrapedImage;
          changed = true;
        }

        if (curPrice <= 0 && price) {
          patch.price = price;
          patch.original_price = original && original > price ? original : price;
          const op = patch.original_price as number;
          patch.discount_pct = op > price ? Math.round(((op - price) / op) * 100) : 0;
          changed = true;
        }

        if (!changed) {
          // Nothing needed filling — mark done so it is not reprocessed.
          await supabaseAdmin
            .from("products")
            .update(patch as never)
            .eq("id", row.id);
          updated += 1;
          continue;
        }

        const { error: upErr } = await supabaseAdmin.from("products").update(patch as never).eq("id", row.id);
        if (upErr) throw new Error(upErr.message);
        updated += 1;
      } catch (e) {
        failed += 1;
        const msg = (e as Error).message.slice(0, 300);
        errors.push(`${row.slug}: ${msg}`);
        await supabaseAdmin
          .from("products")
          .update({ enrich_status: "failed", enrich_error: msg, enriched_at: new Date().toISOString() })
          .eq("id", row.id);
      }
    }

    return { processed: targets.length, updated, failed, errors, remaining: targets.length === data.limit };
  });
