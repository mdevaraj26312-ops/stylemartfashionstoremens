import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ProductGrid } from "@/components/site/ProductCard";
import { listProducts } from "@/lib/products.functions";

export const Route = createFileRoute("/deals")({
  loader: () => listProducts({ data: { flag: "deal", page: 1, pageSize: 60 } }),
  head: () => ({
    meta: [
      { title: "Best Men's Fashion Deals — Style Mart" },
      { name: "description", content: "Biggest discounts on men's fashion, hand-picked across the market." },
      { property: "og:title", content: "Best Men's Fashion Deals — Style Mart" },
    ],
    links: [{ rel: "canonical", href: "/deals" }],
  }),
  component: DealsPage,
});

function DealsPage() {
  const { items } = Route.useLoaderData();
  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16">
        <p className="eyebrow">Best deals</p>
        <h1 className="mt-2 font-display text-4xl sm:text-6xl">Prices we couldn't ignore.</h1>
        <p className="mt-3 text-sm text-muted-foreground max-w-xl">
          The biggest verified discounts of the week — while stocks last.
        </p>
        <div className="mt-10">
          <ProductGrid products={items} deal />
        </div>
      </section>
    </SiteLayout>
  );
}
