import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2, Plus, Upload, ExternalLink, LogOut, Download } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { CATEGORIES, STORES, inr } from "@/lib/catalog";
import { supabase } from "@/integrations/supabase/client";
import {
  adminBulkImport,
  adminDeleteProduct,
  adminListProducts,
  adminUpsertProduct,
  claimFirstAdmin,
  getMyAdminStatus,
} from "@/lib/products.functions";

export const Route = createFileRoute("/admin/products")({
  head: () => ({
    meta: [
      { title: "Product Manager — Style Mart" },
      { name: "description", content: "Manage the Style Mart product database." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminProductsPage,
});

type DraftProduct = {
  slug: string;
  title: string;
  brand: string;
  category: string;
  source: string;
  price: number;
  original_price: number;
  image_url: string;
  affiliate_url: string;
  description: string;
  rating: number;
  reviews_count: number;
  is_trending: boolean;
  is_new_arrival: boolean;
  is_deal: boolean;
};

const EMPTY: DraftProduct = {
  slug: "",
  title: "",
  brand: "",
  category: "women",
  source: "Amazon",
  price: 0,
  original_price: 0,
  image_url: "",
  affiliate_url: "",
  description: "",
  rating: 4.5,
  reviews_count: 0,
  is_trending: false,
  is_new_arrival: true,
  is_deal: false,
};

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);

function AdminProductsPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [session, setSession] = useState<"loading" | "signed-out" | "signed-in">("loading");

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s ? "signed-in" : "signed-out");
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ? "signed-in" : "signed-out");
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session === "signed-out") navigate({ to: "/auth", replace: true });
  }, [session, navigate]);

  const statusQ = useQuery({
    queryKey: ["admin-status"],
    queryFn: () => getMyAdminStatus(),
    enabled: session === "signed-in",
  });

  const claim = useMutation({
    mutationFn: () => claimFirstAdmin(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-status"] }),
  });

  if (session === "loading" || (session === "signed-in" && statusQ.isLoading)) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-3xl px-6 py-24 text-center text-sm text-muted-foreground">
          Loading…
        </div>
      </SiteLayout>
    );
  }

  if (session === "signed-in" && statusQ.data && !statusQ.data.isAdmin) {
    return (
      <SiteLayout>
        <section className="mx-auto max-w-md px-6 py-16 text-center">
          <p className="eyebrow">Almost there</p>
          <h1 className="mt-2 font-display text-3xl">Claim admin access</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            You're signed in. If no admin exists yet, you can claim it now.
          </p>
          {claim.error && (
            <p className="mt-4 text-sm text-destructive">
              {(claim.error as Error).message}
            </p>
          )}
          <button
            onClick={() => claim.mutate()}
            disabled={claim.isPending}
            className="mt-6 h-11 px-6 rounded-full bg-primary text-primary-foreground text-xs tracking-[0.18em] uppercase hover:bg-accent transition disabled:opacity-50"
          >
            {claim.isPending ? "Claiming…" : "Claim admin"}
          </button>
          <button
            onClick={() => supabase.auth.signOut()}
            className="mt-4 block mx-auto text-xs text-muted-foreground hover:text-foreground"
          >
            Sign out
          </button>
        </section>
      </SiteLayout>
    );
  }

  return <AdminDashboard />;
}

function AdminDashboard() {
  const qc = useQueryClient();
  const [draft, setDraft] = useState<DraftProduct>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [importMsg, setImportMsg] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const listQ = useQuery({
    queryKey: ["admin-products", page, search],
    queryFn: () => adminListProducts({ data: { page, pageSize: 50, q: search || undefined } }),
  });

  const upsert = useMutation({
    mutationFn: (d: DraftProduct) => adminUpsertProduct({ data: d }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      setDraft(EMPTY);
      setEditing(null);
    },
  });

  const del = useMutation({
    mutationFn: (slug: string) => adminDeleteProduct({ data: { slug } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-products"] }),
  });

  const bulk = useMutation({
    mutationFn: (rows: DraftProduct[]) => adminBulkImport({ data: { rows } }),
    onSuccess: (r) => {
      setImportMsg(`Imported ${r.inserted} products.`);
      qc.invalidateQueries({ queryKey: ["admin-products"] });
    },
    onError: (e) => setImportMsg(`Import failed: ${(e as Error).message}`),
  });

  const save = () => {
    if (!draft.title || !draft.brand || !draft.image_url || !draft.affiliate_url) {
      alert("Title, brand, image URL and affiliate URL are required.");
      return;
    }
    const slug = draft.slug || slugify(`${draft.brand}-${draft.title}`);
    upsert.mutate({ ...draft, slug });
  };

  const set = <K extends keyof DraftProduct>(k: K, v: DraftProduct[K]) =>
    setDraft((d) => ({ ...d, [k]: v }));

  const onCsv = async (file: File) => {
    setImportMsg("Parsing CSV…");
    const text = await file.text();
    try {
      const rows = parseCsv(text);
      if (rows.length === 0) throw new Error("No rows found");
      setImportMsg(`Uploading ${rows.length} rows…`);
      bulk.mutate(rows);
    } catch (err) {
      setImportMsg(`Parse failed: ${(err as Error).message}`);
    }
  };

  const downloadTemplate = () => {
    const header = [
      "slug", "title", "brand", "category", "source", "price", "original_price",
      "image_url", "affiliate_url", "description", "rating", "reviews_count",
      "is_trending", "is_new_arrival", "is_deal",
    ].join(",");
    const example = [
      "ribbed-midi-dress", "Ribbed Knit Midi Dress", "Zara", "women", "Myntra",
      "1999", "2999", "https://example.com/img.jpg", "https://myntra.com/xyz",
      "\"Soft ribbed midi, ivory.\"", "4.6", "128", "true", "true", "false",
    ].join(",");
    const blob = new Blob([`${header}\n${example}\n`], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "style-mart-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const items = listQ.data?.items ?? [];
  const total = listQ.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / 50));

  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Admin</p>
            <h1 className="mt-2 font-display text-4xl sm:text-5xl">Product manager</h1>
            <p className="mt-2 text-sm text-muted-foreground max-w-xl">
              Add products manually or bulk-import from CSV. Products are stored in the Style Mart database.
            </p>
          </div>
          <button
            onClick={() => supabase.auth.signOut()}
            className="inline-flex items-center gap-2 h-10 px-4 rounded-full border border-border text-xs tracking-[0.16em] uppercase hover:border-foreground"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </button>
        </div>

        {/* Bulk CSV */}
        <div className="mt-8 rounded-lg border border-border bg-card p-5 sm:p-7">
          <h2 className="font-display text-2xl">Bulk import (CSV)</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Columns: slug, title, brand, category, source, price, original_price, image_url, affiliate_url, description, rating, reviews_count, is_trending, is_new_arrival, is_deal.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <input
              ref={fileRef}
              type="file"
              accept=".csv,text/csv"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onCsv(f);
                e.target.value = "";
              }}
              className="hidden"
            />
            <button
              onClick={() => fileRef.current?.click()}
              disabled={bulk.isPending}
              className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-primary text-primary-foreground text-xs tracking-[0.16em] uppercase hover:bg-accent transition disabled:opacity-50"
            >
              <Upload className="h-4 w-4" /> {bulk.isPending ? "Importing…" : "Upload CSV"}
            </button>
            <button
              onClick={downloadTemplate}
              className="inline-flex items-center gap-2 h-11 px-5 rounded-full border border-border text-xs tracking-[0.16em] uppercase hover:border-foreground"
            >
              <Download className="h-4 w-4" /> Download template
            </button>
          </div>
          {importMsg && <p className="mt-3 text-sm text-muted-foreground">{importMsg}</p>}
        </div>

        {/* Manual form */}
        <div className="mt-10 rounded-lg border border-border bg-card p-5 sm:p-7">
          <h2 className="font-display text-2xl">
            {editing ? "Edit product" : "Add new product"}
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Field label="Product name">
              <input value={draft.title} onChange={(e) => set("title", e.target.value)} className="input" />
            </Field>
            <Field label="Brand">
              <input value={draft.brand} onChange={(e) => set("brand", e.target.value)} className="input" />
            </Field>
            <Field label="Category">
              <select value={draft.category} onChange={(e) => set("category", e.target.value)} className="input">
                {CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
              </select>
            </Field>
            <Field label="Store / Source">
              <select value={draft.source} onChange={(e) => set("source", e.target.value)} className="input">
                {STORES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Price (₹)">
              <input type="number" min={0} value={draft.price || ""} onChange={(e) => set("price", Number(e.target.value))} className="input" />
            </Field>
            <Field label="Original price (₹)">
              <input type="number" min={0} value={draft.original_price || ""} onChange={(e) => set("original_price", Number(e.target.value))} className="input" />
            </Field>
            <Field label="Rating (0–5)">
              <input type="number" step="0.1" min={0} max={5} value={draft.rating} onChange={(e) => set("rating", Number(e.target.value))} className="input" />
            </Field>
            <Field label="Reviews">
              <input type="number" min={0} value={draft.reviews_count} onChange={(e) => set("reviews_count", Number(e.target.value))} className="input" />
            </Field>
            <Field label="Image URL" full>
              <input value={draft.image_url} onChange={(e) => set("image_url", e.target.value)} className="input" placeholder="https://…" />
            </Field>
            <Field label="Affiliate URL" full>
              <input value={draft.affiliate_url} onChange={(e) => set("affiliate_url", e.target.value)} className="input" placeholder="https://www.amazon.in/..." />
            </Field>
            <Field label="Description" full>
              <textarea rows={3} value={draft.description} onChange={(e) => set("description", e.target.value)} className="input" />
            </Field>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-5">
            <Toggle label="Trending" checked={draft.is_trending} onChange={(v) => set("is_trending", v)} />
            <Toggle label="New arrival" checked={draft.is_new_arrival} onChange={(v) => set("is_new_arrival", v)} />
            <Toggle label="Best deal" checked={draft.is_deal} onChange={(v) => set("is_deal", v)} />
          </div>

          {upsert.error && <p className="mt-3 text-sm text-destructive">{(upsert.error as Error).message}</p>}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={save}
              disabled={upsert.isPending}
              className="inline-flex items-center gap-2 h-11 px-6 rounded-full bg-primary text-primary-foreground text-xs tracking-[0.16em] uppercase hover:bg-accent transition disabled:opacity-50"
            >
              <Plus className="h-4 w-4" /> {editing ? "Save changes" : "Add product"}
            </button>
            {editing && (
              <button
                onClick={() => { setDraft(EMPTY); setEditing(null); }}
                className="h-11 px-5 rounded-full border border-border text-xs tracking-[0.16em] uppercase hover:border-foreground"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* List */}
        <div className="mt-10">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h2 className="font-display text-2xl">Products ({total})</h2>
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search…"
              className="h-10 rounded-md border border-border bg-background px-3 text-sm w-64"
            />
          </div>

          {listQ.isLoading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : items.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
              No products yet. Add one above or import a CSV.
            </div>
          ) : (
            <div className="grid gap-3">
              {items.map((p) => (
                <div key={p.slug} className="grid grid-cols-[64px_1fr_auto] items-center gap-4 rounded-md border border-border bg-card p-3">
                  <div className="h-16 w-16 overflow-hidden rounded bg-muted">
                    <img src={p.img} alt={p.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] tracking-[0.18em] uppercase text-muted-foreground truncate">
                      {p.brand} · {p.source} · {p.category}
                    </p>
                    <p className="font-medium truncate">{p.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {inr(p.price)}
                      {p.original > p.price && <span className="line-through ml-2 text-xs">{inr(p.original)}</span>}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <a href={p.affiliateUrl} target="_blank" rel="noopener noreferrer" className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Open link">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                    <button
                      onClick={() => {
                        setDraft({
                          slug: p.slug, title: p.name, brand: p.brand, category: p.category,
                          source: p.source, price: p.price, original_price: p.original,
                          image_url: p.img, affiliate_url: p.affiliateUrl, description: p.description,
                          rating: p.rating, reviews_count: p.reviews,
                          is_trending: !!p.trending, is_new_arrival: !!p.newArrival, is_deal: !!p.deal,
                        });
                        setEditing(p.slug);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="h-9 px-3 rounded-full text-xs hover:bg-muted"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => { if (confirm("Delete this product?")) del.mutate(p.slug); }}
                      className="grid h-9 w-9 place-items-center rounded-full hover:bg-destructive/10 hover:text-destructive"
                      aria-label="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2 text-sm">
              <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="h-9 px-4 rounded-full border border-border disabled:opacity-40">
                Prev
              </button>
              <span className="text-muted-foreground">Page {page} of {totalPages}</span>
              <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="h-9 px-4 rounded-full border border-border disabled:opacity-40">
                Next
              </button>
            </div>
          )}
        </div>

        <p className="mt-8 text-xs text-muted-foreground">
          <Link to="/" className="underline">← Back to store</Link>
        </p>
      </section>

      <style>{`
        .input {
          width: 100%; height: 2.5rem; padding: 0 0.75rem;
          border: 1px solid var(--border); background: var(--background);
          border-radius: 0.375rem; font-size: 0.875rem; outline: none;
        }
        textarea.input { height: auto; padding: 0.6rem 0.75rem; }
        .input:focus { border-color: var(--accent); }
      `}</style>
    </SiteLayout>
  );
}

function Field({ label, full, children }: { label: string; full?: boolean; children: React.ReactNode }) {
  return (
    <label className={`block ${full ? "sm:col-span-2" : ""}`}>
      <span className="text-[11px] tracking-[0.18em] uppercase text-muted-foreground">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 accent-[color:var(--accent)]" />
      {label}
    </label>
  );
}

/* --------- CSV parser (RFC 4180 subset, handles quoted fields) --------- */
function parseCsv(text: string): DraftProduct[] {
  const rows: string[][] = [];
  let cur: string[] = [];
  let field = "";
  let inQuotes = false;
  const src = text.replace(/\r\n?/g, "\n");

  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (inQuotes) {
      if (c === '"') {
        if (src[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ",") { cur.push(field); field = ""; }
      else if (c === "\n") { cur.push(field); rows.push(cur); cur = []; field = ""; }
      else field += c;
    }
  }
  if (field.length || cur.length) { cur.push(field); rows.push(cur); }

  const header = rows.shift();
  if (!header) throw new Error("Empty CSV");
  const idx = (name: string) => header.findIndex((h) => h.trim().toLowerCase() === name);

  const required = ["title", "brand", "category", "source", "price", "original_price", "image_url", "affiliate_url"];
  for (const r of required) if (idx(r) < 0) throw new Error(`Missing column: ${r}`);

  const bool = (v: string) => /^(1|true|yes|y)$/i.test(v.trim());
  const num = (v: string) => Number((v || "0").trim());

  return rows
    .filter((r) => r.some((c) => c.trim().length))
    .map((r): DraftProduct => {
      const get = (n: string) => (idx(n) >= 0 ? (r[idx(n)] ?? "").trim() : "");
      const title = get("title");
      const brand = get("brand");
      return {
        slug: get("slug") || slugify(`${brand}-${title}`),
        title, brand,
        category: get("category") || "women",
        source: get("source") || "Amazon",
        price: num(get("price")),
        original_price: num(get("original_price")) || num(get("price")),
        image_url: get("image_url"),
        affiliate_url: get("affiliate_url"),
        description: get("description"),
        rating: idx("rating") >= 0 ? num(get("rating")) : 4.5,
        reviews_count: idx("reviews_count") >= 0 ? num(get("reviews_count")) : 0,
        is_trending: bool(get("is_trending")),
        is_new_arrival: idx("is_new_arrival") >= 0 ? bool(get("is_new_arrival")) : true,
        is_deal: bool(get("is_deal")),
      };
    });
}
