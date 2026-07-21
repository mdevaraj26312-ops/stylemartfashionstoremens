import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ProductGrid } from "@/components/site/ProductCard";
import { useWishlist } from "@/lib/user-store";
import { getProductsBySlugs } from "@/lib/products.functions";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Your Wishlist — Style Mart" },
      { name: "description", content: "Your saved fashion products on Style Mart." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: WishlistPage,
});

function WishlistPage() {
  const { slugs, clear } = useWishlist();
  const { data } = useQuery({
    queryKey: ["wishlist-products", slugs.join(",")],
    queryFn: () => getProductsBySlugs({ data: { slugs } }),
    enabled: slugs.length > 0,
  });
  const bySlug = new Map((data ?? []).map((p) => [p.slug, p]));
  const items = slugs.map((s) => bySlug.get(s)).filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Saved for later</p>
            <h1 className="mt-2 font-display text-4xl sm:text-5xl">Your wishlist</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {items.length} {items.length === 1 ? "piece" : "pieces"} saved.
            </p>
          </div>
          {items.length > 0 && (
            <button
              onClick={clear}
              className="text-xs tracking-[0.18em] uppercase text-muted-foreground hover:text-destructive"
            >
              Clear all
            </button>
          )}
        </div>

        <div className="mt-10">
          {items.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-14 text-center">
              <Heart className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-4 font-display text-2xl">Nothing saved yet.</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Tap the heart on any product to save it here for later.
              </p>
              <Link
                to="/"
                className="mt-6 inline-flex items-center h-11 px-6 rounded-full bg-primary text-primary-foreground text-xs tracking-[0.18em] uppercase hover:bg-accent transition"
              >
                Start browsing
              </Link>
            </div>
          ) : (
            <ProductGrid products={items} />
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
