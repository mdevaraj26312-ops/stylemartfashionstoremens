import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ProductGrid } from "@/components/site/ProductCard";
import { listProducts } from "@/lib/products.functions";

export const Route = createFileRoute("/trending")({
  loader: () => listProducts({ data: { flag: "trending", page: 1, pageSize: 60 } }),
  head: () => ({
    meta: [
      { title: "Trending Fashion — Style Mart" },
      { name: "description", content: "The most-loved fashion pieces on Style Mart right now." },
      { property: "og:title", content: "Trending Fashion — Style Mart" },
    ],
    links: [{ rel: "canonical", href: "/trending" }],
  }),
  component: TrendingPage,
});

function TrendingPage() {
  const { items } = Route.useLoaderData();
  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16">
        <p className="eyebrow">Trending now</p>
        <h1 className="mt-2 font-display text-4xl sm:text-6xl">What everyone's wearing.</h1>
        <p className="mt-3 text-sm text-muted-foreground max-w-xl">
          The pieces our readers are viewing, saving and buying the most this week.
        </p>
        <div className="mt-10">
          <ProductGrid products={items} />
        </div>
      </section>
    </SiteLayout>
  );
}
