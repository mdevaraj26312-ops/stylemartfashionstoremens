import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ChevronRight } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ProductGrid } from "@/components/site/ProductCard";
import {
  CatalogFilters,
  applyFilters,
  type FilterState,
} from "@/components/site/CatalogFilters";
import { CATEGORIES, getCategory, productsByCategory } from "@/lib/catalog";

export const Route = createFileRoute("/category/$slug")({
  loader: ({ params }) => {
    const category = getCategory(params.slug);
    if (!category) throw notFound();
    return { category, products: productsByCategory(category.slug) };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Category not found — Style Mart" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const c = loaderData.category;
    return {
      meta: [
        { title: `${c.name} — Style Mart` },
        { name: "description", content: c.tagline },
        { property: "og:title", content: `${c.name} — Style Mart` },
        { property: "og:description", content: c.tagline },
        { property: "og:image", content: c.hero },
      ],
      links: [{ rel: "canonical", href: `/category/${c.slug}` }],
    };
  },
  component: CategoryPage,
  notFoundComponent: () => (
    <SiteLayout>
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <p className="eyebrow">404</p>
        <h1 className="mt-3 font-display text-4xl">Category not found.</h1>
        <Link to="/" className="mt-6 inline-block text-sm underline">
          Back to home
        </Link>
      </div>
    </SiteLayout>
  ),
});

function CategoryPage() {
  const { category, products } = Route.useLoaderData();

  const priceCap = useMemo(
    () => Math.max(2000, ...products.map((p: (typeof products)[number]) => p.price)),
    [products],
  );

  const [filters, setFilters] = useState<FilterState>({
    sort: "featured",
    maxPrice: priceCap,
    stores: [],
  });

  const filtered = useMemo(() => applyFilters(products, filters), [products, filters]);

  return (
    <SiteLayout>
      <section className="relative">
        <div className="relative h-[38vh] min-h-[280px] overflow-hidden bg-muted">
          <img
            src={category.hero}
            alt={category.name}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-background" />
          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 h-full flex flex-col justify-end pb-8">
            <nav className="flex items-center gap-1 text-[11px] tracking-[0.2em] uppercase text-primary-foreground/90">
              <Link to="/" className="hover:text-accent">Home</Link>
              <ChevronRight className="h-3 w-3" />
              <span>{category.name}</span>
            </nav>
            <h1 className="mt-3 font-display text-4xl sm:text-6xl text-primary-foreground">
              {category.name}
            </h1>
            <p className="mt-2 text-sm sm:text-base text-primary-foreground/90 max-w-lg">
              {category.tagline}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-14">
        <div className="mb-6 flex flex-wrap items-center gap-2">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              to="/category/$slug"
              params={{ slug: c.slug }}
              className="text-xs px-3.5 py-1.5 rounded-full border border-border hover:border-foreground transition"
              activeProps={{ className: "bg-primary text-primary-foreground border-primary" }}
            >
              {c.short}
            </Link>
          ))}
        </div>

        <CatalogFilters value={filters} onChange={setFilters} priceCap={priceCap} />

        <div className="mt-8 flex items-baseline justify-between pb-6">
          <p className="text-sm text-muted-foreground">
            Showing {filtered.length} of {products.length}{" "}
            {products.length === 1 ? "product" : "products"}
          </p>
          <p className="eyebrow">Curated · Updated daily</p>
        </div>

        <ProductGrid products={filtered} />
      </section>
    </SiteLayout>
  );
}
