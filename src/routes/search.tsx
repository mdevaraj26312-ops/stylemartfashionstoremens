import { createFileRoute } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ProductGrid } from "@/components/site/ProductCard";
import { listProducts } from "@/lib/products.functions";

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
        { name: "description", content: "Search men's fashion, tailoring, footwear, watches and accessories." },
        { name: "robots", content: "noindex" },
      ],
    };
  },
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const trimmed = q.trim();
  const { data, isLoading } = useQuery({
    queryKey: ["search", trimmed],
    queryFn: () => listProducts({ data: { q: trimmed, page: 1, pageSize: 60 } }),
    enabled: trimmed.length > 0,
  });

  const results = data?.items ?? [];
  const total = data?.total ?? 0;

  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16">
        <p className="eyebrow">Search results</p>
        <h1 className="mt-2 font-display text-3xl sm:text-5xl">
          {trimmed ? <>Results for <em className="italic text-accent">“{trimmed}”</em></> : "Start searching"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {!trimmed
            ? "Type a product, brand, or category in the search bar above."
            : isLoading
              ? "Searching…"
              : `${total} ${total === 1 ? "product" : "products"} found`}
        </p>

        <div className="mt-10">
          <ProductGrid products={results} />
        </div>
      </section>
    </SiteLayout>
  );
}
