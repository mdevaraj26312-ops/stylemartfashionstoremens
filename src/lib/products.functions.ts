import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Product, CategorySlug, Store } from "./catalog";

type ProductRow = Database["public"]["Tables"]["products"]["Row"];

function publicClient() {
  const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
  const url = process.env.SUPABASE_URL!;
  return createClient<Database>(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

function mapRow(r: ProductRow): Product {
  return {
    slug: r.slug,
    name: r.title,
    brand: r.brand,
    category: r.category as CategorySlug,
    source: r.source as Store,
    price: Number(r.price),
    original: Number(r.original_price),
    img: r.image_url,
    affiliateUrl: r.affiliate_url,
    description: r.description,
    rating: Number(r.rating),
    reviews: r.reviews_count,
    trending: r.is_trending,
    newArrival: r.is_new_arrival,
    deal: r.is_deal,
  };
}

const listSchema = z.object({
  category: z.string().optional(),
  source: z.string().optional(),
  q: z.string().optional(),
  maxPrice: z.number().optional(),
  sort: z.enum(["featured", "price-asc", "price-desc", "discount", "rating", "newest"]).optional(),
  flag: z.enum(["trending", "new", "deal"]).optional(),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(24),
});

export const listProducts = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => listSchema.parse(input))
  .handler(async ({ data }) => {
    const supabase = publicClient();
    const sel = (s: string): string => s;
    const from = (data.page - 1) * data.pageSize;
    const to = from + data.pageSize - 1;

    let q = supabase.from("products").select(sel("*"), { count: "exact" });
    if (data.category) q = q.eq("category", data.category as never);
    if (data.source) q = q.eq("source", data.source as never);
    if (data.maxPrice) q = q.lte("price", data.maxPrice);
    if (data.flag === "trending") q = q.eq("is_trending", true);
    if (data.flag === "new") q = q.eq("is_new_arrival", true);
    if (data.flag === "deal") q = q.eq("is_deal", true);
    if (data.q && data.q.trim()) {
      const term = data.q.trim().split(/\s+/).map((t) => `${t}:*`).join(" & ");
      q = q.textSearch("search_tsv", term, { config: "simple" });
    }

    switch (data.sort) {
      case "price-asc":
        q = q.order("price", { ascending: true });
        break;
      case "price-desc":
        q = q.order("price", { ascending: false });
        break;
      case "rating":
        q = q.order("rating", { ascending: false });
        break;
      case "newest":
        q = q.order("created_at", { ascending: false });
        break;
      default:
        q = q.order("is_trending", { ascending: false }).order("created_at", { ascending: false });
    }

    const { data: rows, count, error } = await q.range(from, to).returns<ProductRow[]>();
    if (error) throw new Error(error.message);
    return { items: (rows ?? []).map(mapRow), total: count ?? 0 };
  });

export const getProduct = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => z.object({ slug: z.string() }).parse(input))
  .handler(async ({ data }) => {
    const supabase = publicClient();
    const sel = (s: string): string => s;
    const { data: row, error } = await supabase
      .from("products")
      .select(sel("*"))
      .eq("slug", data.slug)
      .maybeSingle()
      .returns<ProductRow | null>();
    if (error) throw new Error(error.message);
    return row ? mapRow(row) : null;
  });

export const getRelated = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) =>
    z.object({ category: z.string(), excludeSlug: z.string(), limit: z.number().default(4) }).parse(input),
  )
  .handler(async ({ data }) => {
    const supabase = publicClient();
    const sel = (s: string): string => s;
    const { data: rows, error } = await supabase
      .from("products")
      .select(sel("*"))
      .eq("category", data.category as never)
      .neq("slug", data.excludeSlug)
      .limit(data.limit)
      .returns<ProductRow[]>();
    if (error) throw new Error(error.message);
    return (rows ?? []).map(mapRow);
  });

export const getProductsBySlugs = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => z.object({ slugs: z.array(z.string()) }).parse(input))
  .handler(async ({ data }) => {
    if (data.slugs.length === 0) return [] as Product[];
    const supabase = publicClient();
    const sel = (s: string): string => s;
    const { data: rows, error } = await supabase
      .from("products")
      .select(sel("*"))
      .in("slug", data.slugs)
      .returns<ProductRow[]>();
    if (error) throw new Error(error.message);
    return (rows ?? []).map(mapRow);
  });

/* ---------- Admin ---------- */

async function assertAdmin(ctx: { supabase: Awaited<ReturnType<typeof publicClient>>; userId: string }) {
  const { data, error } = await ctx.supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", ctx.userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error || !data) throw new Error("Forbidden");
}

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=900&q=70";

const productInput = z.object({
  slug: z.string().min(1).max(120),
  title: z.string().min(1).max(200),
  brand: z
    .string()
    .max(100)
    .optional()
    .transform((v) => (v && v.trim() ? v.trim() : "Generic")),
  category: z.enum(["women", "men", "kids", "footwear", "bags", "watches", "jewellery", "accessories"]),
  source: z.enum(["Amazon", "Flipkart", "Meesho", "Myntra", "Ajio", "Other"]).default("Other"),
  price: z.number().min(0),
  original_price: z.number().min(0),
  image_url: z
    .string()
    .optional()
    .transform((v) => (v && v.trim() ? v.trim() : PLACEHOLDER_IMAGE))
    .pipe(z.string().url()),
  affiliate_url: z.string().url(),
  description: z.string().max(2000).default(""),
  rating: z.number().min(0).max(5).default(4.5),
  reviews_count: z.number().int().min(0).default(0),
  is_trending: z.boolean().default(false),
  is_new_arrival: z.boolean().default(false),
  is_deal: z.boolean().default(false),
});

export const adminUpsertProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => productInput.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin({ supabase: context.supabase as never, userId: context.userId });
    const { error } = await context.supabase.from("products").upsert(data, { onConflict: "slug" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminDeleteProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ slug: z.string() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin({ supabase: context.supabase as never, userId: context.userId });
    const { error } = await context.supabase.from("products").delete().eq("slug", data.slug);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminBulkImport = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ rows: z.array(productInput).max(5000) }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin({ supabase: context.supabase as never, userId: context.userId });
    const chunkSize = 500;
    let inserted = 0;
    for (let i = 0; i < data.rows.length; i += chunkSize) {
      // Freshly imported rows are queued for automatic enrichment from their affiliate URL.
      const chunk = data.rows.slice(i, i + chunkSize).map((r) => ({ ...r, enrich_status: "pending" }));
      const { error } = await context.supabase.from("products").upsert(chunk as never, { onConflict: "slug" });

      if (error) throw new Error(`Row ${i}: ${error.message}`);
      inserted += chunk.length;
    }
    return { ok: true, inserted };
  });

export const adminListProducts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ page: z.number().int().min(1).default(1), pageSize: z.number().int().min(1).max(200).default(50), q: z.string().optional() }).parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin({ supabase: context.supabase as never, userId: context.userId });
    const sel = (s: string): string => s;
    const from = (data.page - 1) * data.pageSize;
    const to = from + data.pageSize - 1;
    let q = context.supabase.from("products").select(sel("*"), { count: "exact" });
    if (data.q) {
      const term = data.q.trim().split(/\s+/).map((t) => `${t}:*`).join(" & ");
      q = q.textSearch("search_tsv", term, { config: "simple" });
    }
    const { data: rows, count, error } = await q.order("created_at", { ascending: false }).range(from, to).returns<ProductRow[]>();
    if (error) throw new Error(error.message);
    return { items: (rows ?? []).map(mapRow), total: count ?? 0 };
  });

export const getMyAdminStatus = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    if (error) throw new Error(error.message);
    return { isAdmin: Boolean(data), userId: context.userId };
  });

// Admin claim is permanently disabled — the sole admin is provisioned already.
export const claimFirstAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async () => {
    throw new Error("Admin registration is closed.");
  });
