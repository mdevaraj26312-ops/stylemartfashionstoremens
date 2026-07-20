import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Trash2, Plus, Download, ExternalLink } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { CATEGORIES, inr } from "@/lib/catalog";
import { useAdminProducts, type AdminProduct } from "@/lib/user-store";

export const Route = createFileRoute("/admin/products")({
  head: () => ({
    meta: [
      { title: "Product Manager — Style Mart" },
      {
        name: "description",
        content: "Add, edit and manage fashion affiliate products on Style Mart.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminProductsPage,
});

const EMPTY: AdminProduct = {
  slug: "",
  name: "",
  brand: "",
  category: "women",
  price: 0,
  original: 0,
  img: "",
  source: "Amazon",
  rating: 4.5,
  reviews: 0,
  description: "",
  affiliateUrl: "",
  trending: false,
  newArrival: true,
  deal: false,
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

function AdminProductsPage() {
  const [items, setItems] = useAdminProducts();
  const [draft, setDraft] = useState<AdminProduct>(EMPTY);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);

  const isEditing = editingSlug !== null;

  const upsert = () => {
    if (!draft.name || !draft.brand || !draft.img || !draft.affiliateUrl) {
      alert("Name, brand, image and affiliate URL are required.");
      return;
    }
    const slug = draft.slug || slugify(`${draft.brand}-${draft.name}`);
    const entry: AdminProduct = { ...draft, slug };
    setItems((prev) => {
      const without = prev.filter((p) => p.slug !== (editingSlug ?? slug));
      return [entry, ...without];
    });
    setDraft(EMPTY);
    setEditingSlug(null);
  };

  const startEdit = (p: AdminProduct) => {
    setDraft(p);
    setEditingSlug(p.slug);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = (slug: string) => {
    if (!confirm("Delete this product?")) return;
    setItems((prev) => prev.filter((p) => p.slug !== slug));
    if (editingSlug === slug) {
      setDraft(EMPTY);
      setEditingSlug(null);
    }
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(items, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "style-mart-products.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const set = <K extends keyof AdminProduct>(k: K, v: AdminProduct[K]) =>
    setDraft((d) => ({ ...d, [k]: v }));

  const stats = useMemo(
    () => ({
      total: items.length,
      trending: items.filter((i) => i.trending).length,
      deals: items.filter((i) => i.deal).length,
    }),
    [items],
  );

  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Admin</p>
            <h1 className="mt-2 font-display text-4xl sm:text-5xl">Product manager</h1>
            <p className="mt-2 text-sm text-muted-foreground max-w-xl">
              Add, edit and organise affiliate products. Saved locally in your browser — export
              anytime as JSON to sync with the main catalog.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">
              {stats.total} total · {stats.trending} trending · {stats.deals} deals
            </span>
            <button
              onClick={exportJson}
              disabled={items.length === 0}
              className="inline-flex items-center gap-2 h-10 px-4 rounded-full border border-border text-xs tracking-[0.16em] uppercase hover:border-foreground disabled:opacity-40"
            >
              <Download className="h-3.5 w-3.5" /> Export JSON
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="mt-10 rounded-lg border border-border bg-card p-5 sm:p-7">
          <h2 className="font-display text-2xl">
            {isEditing ? "Edit product" : "Add new product"}
          </h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Field label="Product name">
              <input
                value={draft.name}
                onChange={(e) => set("name", e.target.value)}
                className="input"
                placeholder="Ribbed Knit Midi Dress"
              />
            </Field>
            <Field label="Brand">
              <input
                value={draft.brand}
                onChange={(e) => set("brand", e.target.value)}
                className="input"
                placeholder="Zara"
              />
            </Field>
            <Field label="Category">
              <select
                value={draft.category}
                onChange={(e) => set("category", e.target.value as AdminProduct["category"])}
                className="input"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Store / Source">
              <select
                value={draft.source as string}
                onChange={(e) => set("source", e.target.value)}
                className="input"
              >
                {["Amazon", "Flipkart", "Myntra", "Meesho", "Ajio"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </Field>
            <Field label="Price (₹)">
              <input
                type="number"
                min={0}
                value={draft.price || ""}
                onChange={(e) => set("price", Number(e.target.value))}
                className="input"
              />
            </Field>
            <Field label="Original price (₹)">
              <input
                type="number"
                min={0}
                value={draft.original || ""}
                onChange={(e) => set("original", Number(e.target.value))}
                className="input"
              />
            </Field>
            <Field label="Rating (0–5)">
              <input
                type="number"
                step="0.1"
                min={0}
                max={5}
                value={draft.rating}
                onChange={(e) => set("rating", Number(e.target.value))}
                className="input"
              />
            </Field>
            <Field label="Reviews">
              <input
                type="number"
                min={0}
                value={draft.reviews}
                onChange={(e) => set("reviews", Number(e.target.value))}
                className="input"
              />
            </Field>
            <Field label="Image URL" full>
              <input
                value={draft.img}
                onChange={(e) => set("img", e.target.value)}
                className="input"
                placeholder="https://…"
              />
            </Field>
            <Field label="Affiliate URL" full>
              <input
                value={draft.affiliateUrl}
                onChange={(e) => set("affiliateUrl", e.target.value)}
                className="input"
                placeholder="https://www.amazon.in/..."
              />
            </Field>
            <Field label="Description" full>
              <textarea
                value={draft.description}
                onChange={(e) => set("description", e.target.value)}
                rows={3}
                className="input"
                placeholder="Short editorial description of the piece."
              />
            </Field>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-5">
            <Toggle label="Trending" checked={!!draft.trending} onChange={(v) => set("trending", v)} />
            <Toggle label="New arrival" checked={!!draft.newArrival} onChange={(v) => set("newArrival", v)} />
            <Toggle label="Best deal" checked={!!draft.deal} onChange={(v) => set("deal", v)} />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={upsert}
              className="inline-flex items-center gap-2 h-11 px-6 rounded-full bg-primary text-primary-foreground text-xs tracking-[0.16em] uppercase hover:bg-accent transition"
            >
              <Plus className="h-4 w-4" /> {isEditing ? "Save changes" : "Add product"}
            </button>
            {isEditing && (
              <button
                onClick={() => {
                  setDraft(EMPTY);
                  setEditingSlug(null);
                }}
                className="h-11 px-5 rounded-full border border-border text-xs tracking-[0.16em] uppercase hover:border-foreground"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="mt-10">
          <h2 className="font-display text-2xl mb-4">Your products ({items.length})</h2>
          {items.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
              No custom products yet. Add your first above.
            </div>
          ) : (
            <div className="grid gap-3">
              {items.map((p) => (
                <div
                  key={p.slug}
                  className="grid grid-cols-[64px_1fr_auto] items-center gap-4 rounded-md border border-border bg-card p-3"
                >
                  <div className="h-16 w-16 overflow-hidden rounded bg-muted">
                    {p.img && (
                      <img src={p.img} alt={p.name} className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] tracking-[0.18em] uppercase text-muted-foreground truncate">
                      {p.brand} · {p.source} · {p.category}
                    </p>
                    <p className="font-medium truncate">{p.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {inr(p.price)}
                      {p.original > p.price && (
                        <span className="line-through ml-2 text-xs">{inr(p.original)}</span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <a
                      href={p.affiliateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted"
                      aria-label="Open affiliate link"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                    <button
                      onClick={() => startEdit(p)}
                      className="h-9 px-3 rounded-full text-xs hover:bg-muted"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => remove(p.slug)}
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
        </div>
      </section>

      <style>{`
        .input {
          width: 100%;
          height: 2.5rem;
          padding: 0 0.75rem;
          border: 1px solid var(--border);
          background: var(--background);
          border-radius: 0.375rem;
          font-size: 0.875rem;
          outline: none;
        }
        textarea.input { height: auto; padding: 0.6rem 0.75rem; }
        .input:focus { border-color: var(--accent); }
      `}</style>
    </SiteLayout>
  );
}

function Field({
  label,
  full,
  children,
}: {
  label: string;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className={`block ${full ? "sm:col-span-2" : ""}`}>
      <span className="text-[11px] tracking-[0.18em] uppercase text-muted-foreground">
        {label}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-[color:var(--accent)]"
      />
      {label}
    </label>
  );
}
