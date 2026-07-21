import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ProductGrid } from "@/components/site/ProductCard";
import { listProducts } from "@/lib/products.functions";

export const Route = createFileRoute("/new-arrivals")({
  loader: () => listProducts({ data: { flag: "new", sort: "newest", page: 1, pageSize: 60 } }),
  head: () => ({
    meta: [
      { title: "New Arrivals — Style Mart" },
      { name: "description", content: "Freshly added fashion pieces on Style Mart." },
      { property: "og:title", content: "New Arrivals — Style Mart" },
    ],
    links: [{ rel: "canonical", href: "/new-arrivals" }],
  }),
  component: NewArrivalsPage,
});

function NewArrivalsPage() {
  const { items } = Route.useLoaderData();
  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16">
        <p className="eyebrow">Just in</p>
        <h1 className="mt-2 font-display text-4xl sm:text-6xl">New arrivals, freshly picked.</h1>
        <p className="mt-3 text-sm text-muted-foreground max-w-xl">
          The newest additions across every category, updated as our editors find them.
        </p>
        <div className="mt-10">
          <ProductGrid products={items} />
        </div>
      </section>
    </SiteLayout>
  );
}
