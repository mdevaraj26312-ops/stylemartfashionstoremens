import { createFileRoute } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ProductGrid } from "@/components/site/ProductCard";
import { searchProducts } from "@/lib/catalog";

const schema = z.object({
  q: fallback(z.string(), "").default(""),
});

export const Route = createFileRoute("/search")({
  validateSearch: zodValidator(schema),
  head: ({ match }) => {
    const q = (match.search as { q?: string })?.q ?? "";
    return {
      meta: [
        { title: q ? `“${q}” — Search on Style Mart` : "Search — Style Mart" },
        { name: "description", content: "Search fashion products across Amazon, Flipkart, Myntra, Meesho and Ajio." },
        { name: "robots", content: "noindex" },
      ],
    };
  },
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const results = searchProducts(q);
  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16">
        <p className="eyebrow">Search results</p>
        <h1 className="mt-2 font-display text-3xl sm:text-5xl">
          {q ? <>Results for <em className="italic text-accent">“{q}”</em></> : "Start searching"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {q ? `${results.length} ${results.length === 1 ? "product" : "products"} found` : "Type a product, brand, or category in the search bar above."}
        </p>

        <div className="mt-10">
          <ProductGrid products={results} />
        </div>
      </section>
    </SiteLayout>
  );
}
