import type { Product } from "@/lib/catalog";

export type SortKey = "featured" | "price-asc" | "price-desc" | "discount" | "rating";

export type FilterState = {
  sort: SortKey;
  maxPrice: number;
  stores: string[];
};

export function applyFilters(products: Product[], f: FilterState): Product[] {
  let out = products.filter((p) => p.price <= f.maxPrice);
  if (f.stores.length > 0) out = out.filter((p) => f.stores.includes(p.source));
  switch (f.sort) {
    case "price-asc":
      out = [...out].sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      out = [...out].sort((a, b) => b.price - a.price);
      break;
    case "discount":
      out = [...out].sort(
        (a, b) => (b.original - b.price) / b.original - (a.original - a.price) / a.original,
      );
      break;
    case "rating":
      out = [...out].sort((a, b) => b.rating - a.rating);
      break;
  }
  return out;
}

export function CatalogFilters({
  value,
  onChange,
  priceCap,
}: {
  value: FilterState;
  onChange: (v: FilterState) => void;
  priceCap: number;
}) {
  return (
    <div className="grid gap-4 rounded-2xl border border-border bg-card p-4 sm:p-5">
      <div className="grid gap-3 sm:grid-cols-[1fr_1fr] sm:gap-6">
        <label className="text-sm">
          <span className="eyebrow">Sort by</span>
          <select
            value={value.sort}
            onChange={(e) => onChange({ ...value, sort: e.target.value as SortKey })}
            className="mt-2 w-full h-10 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:border-accent"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="discount">Biggest discount</option>
            <option value="rating">Top rated</option>
          </select>
        </label>
        <label className="text-sm">
          <span className="eyebrow">Max price</span>
          <div className="mt-2 flex items-center gap-3">
            <input
              type="range"
              min={500}
              max={priceCap}
              step={500}
              value={value.maxPrice}
              onChange={(e) => onChange({ ...value, maxPrice: Number(e.target.value) })}
              className="flex-1 accent-[color:var(--accent)]"
            />
            <span className="w-20 text-right font-display text-lg">
              ₹{value.maxPrice.toLocaleString("en-IN")}
            </span>
          </div>
        </label>
      </div>
    </div>
  );
}

}
