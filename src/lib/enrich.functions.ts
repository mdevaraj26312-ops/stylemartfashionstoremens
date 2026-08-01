import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

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

  let parsed: { json?: Scraped; data?: { json?: Scraped } };
  try {
    parsed = JSON.parse(body);
  } catch {
    throw new Error("Scrape returned an unreadable response.");
  }
  const json = parsed.json ?? parsed.data?.json;
  if (!json) throw new Error("No product data found on that page.");
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
 * Scrapes a batch of products from their affiliate URLs and writes the real
 * title / brand / price / image / description back to the database.
 * The affiliate URL itself is never modified.
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
      .select("id, slug, affiliate_url")
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

        const price = toNumber(s.price);
        const original = toNumber(s.original_price);
        const patch: Record<string, unknown> = {
          enriched_at: new Date().toISOString(),
          enrich_status: "done",
          enrich_error: null,
        };

        const title = clean(s.title, 200);
        if (title) patch.title = title;
        const brand = clean(s.brand, 100);
        if (brand) patch.brand = brand;
        const description = clean(s.description, 2000);
        if (description) patch.description = description;
        const image = clean(s.image_url, 1000);
        if (image && /^https?:\/\//i.test(image)) patch.image_url = image;
        if (price) patch.price = price;
        if (original && price) patch.original_price = Math.max(original, price);
        else if (price) patch.original_price = price;
        if (price && patch.original_price) {
          const op = patch.original_price as number;
          patch.discount_pct = op > price ? Math.round(((op - price) / op) * 100) : 0;
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
