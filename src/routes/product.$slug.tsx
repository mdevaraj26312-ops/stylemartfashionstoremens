import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect } from "react";
import { ChevronRight, Star, ArrowUpRight, Heart, Truck, ShieldCheck, RotateCcw } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ProductCard } from "@/components/site/ProductCard";
import { ShareButtons } from "@/components/site/ShareButtons";
import { RecentlyViewed } from "@/components/site/RecentlyViewed";
import { pushRecentView, trackAffiliateClick, useWishlist } from "@/lib/user-store";
import { getCategory, inr, discountPct, type Product } from "@/lib/catalog";
import { getProduct, getRelated } from "@/lib/products.functions";

export const Route = createFileRoute("/product/$slug")({
  loader: async ({ params }) => {
    const product = await getProduct({ data: { slug: params.slug } });
    if (!product) throw notFound();
    const related = await getRelated({
      data: { category: product.category, excludeSlug: product.slug, limit: 4 },
    });
    return { product, category: getCategory(product.category)!, related };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Product not found — Style Mart" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const p = loaderData.product;
    const title = `${p.name} by ${p.brand} — Style Mart`;
    const desc = p.description.slice(0, 155);
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:image", content: p.img },
        { property: "og:type", content: "product" },
      ],
    };
  },
  component: ProductPage,
  notFoundComponent: () => (
    <SiteLayout>
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <p className="eyebrow">404</p>
        <h1 className="mt-3 font-display text-4xl">Product not found.</h1>
        <Link to="/" className="mt-6 inline-block text-sm underline">
          Back to home
        </Link>
      </div>
    </SiteLayout>
  ),
});

function ProductPage() {
  const { product: p, category, related } = Route.useLoaderData();
  const pct = discountPct(p.price, p.original);

  useEffect(() => {
    pushRecentView(p.slug);
  }, [p.slug]);

  return (
    <SiteLayout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-6">
        <nav className="flex items-center gap-1 text-[11px] tracking-[0.2em] uppercase text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/category/$slug" params={{ slug: category.slug }} className="hover:text-foreground">
            {category.short}
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground truncate">{p.name}</span>
        </nav>
      </div>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-muted">
              <img src={p.img} alt={p.name} className="absolute inset-0 h-full w-full object-cover" />
              {pct > 0 && (
                <span className="absolute left-4 top-4 rounded-full bg-destructive text-destructive-foreground px-3 py-1 text-xs font-semibold tracking-wider">
                  {pct}% OFF
                </span>
              )}
              <span className="absolute right-4 top-4 rounded-sm bg-background/90 backdrop-blur px-2.5 py-1 text-[10px] tracking-[0.18em] uppercase">
                {p.brand}
              </span>
            </div>
          </div>

          <div className="lg:col-span-5">
            <p className="eyebrow">{p.brand}</p>
            <h1 className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl leading-tight">
              {p.name}
            </h1>

            <div className="mt-3 flex items-center gap-3 text-sm">
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-gold text-gold" />
                <span className="font-medium">{p.rating.toFixed(1)}</span>
              </span>
              <span className="text-muted-foreground">({p.reviews.toLocaleString("en-IN")} reviews)</span>
            </div>

            <div className="mt-6 flex items-baseline gap-3">
              {p.price > 0 ? (
                <span className="font-display text-4xl">{inr(p.price)}</span>
              ) : (
                <span className="text-lg text-muted-foreground">
                  See the live price at the partner store
                </span>
              )}
              {p.price > 0 && p.original > p.price && (
                <span className="text-sm text-muted-foreground line-through">{inr(p.original)}</span>
              )}
              {p.price > 0 && pct > 0 && (
                <span className="text-sm font-medium text-destructive">Save {pct}%</span>
              )}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {p.price > 0
                ? "Inclusive of all taxes · Price checked today"
                : "Live price, offers and availability are shown at the partner store"}
            </p>

            {p.description && (
              <p className="mt-6 text-sm text-foreground/85 leading-relaxed">{p.description}</p>
            )}

            <div className="mt-8 grid gap-3">
              <a
                href={`/go/${p.slug}`}
                target="_blank"
                rel="sponsored noopener noreferrer"
                onClick={() => trackAffiliateClick(p)}
                className="group inline-flex items-center justify-center gap-2 h-14 rounded-full bg-primary text-primary-foreground text-sm tracking-[0.16em] uppercase hover:bg-accent transition-colors"
              >
                Buy Now
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <SaveButton slug={p.slug} />
            </div>

            <div className="mt-6">
              <ShareButtons title={`${p.name} by ${p.brand} — Style Mart`} />
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3 text-xs">
              <Trust icon={Truck} label="Ships from partner store" />
              <Trust icon={ShieldCheck} label="Trusted marketplace" />
              <Trust icon={RotateCcw} label="Store return policy" />
            </div>

          </div>
        </div>
      </section>

      <RecentlyViewed excludeSlug={p.slug} />

      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-16">
          <h2 className="font-display text-2xl sm:text-3xl mb-6">You may also like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {related.map((r: Product) => (
              <ProductCard key={r.slug} p={r} />
            ))}
          </div>
        </section>
      )}
    </SiteLayout>
  );
}

function Trust({ icon: Icon, label }: { icon: typeof Truck; label: string }) {
  return (
    <div className="flex flex-col items-start gap-1.5 p-3 rounded-md border border-border">
      <Icon className="h-4 w-4 text-accent" />
      <span className="text-[11px] leading-tight text-muted-foreground">{label}</span>
    </div>
  );
}

function SaveButton({ slug }: { slug: string }) {
  const { has, toggle } = useWishlist();
  const saved = has(slug);
  return (
    <button
      onClick={() => toggle(slug)}
      className={`inline-flex items-center justify-center gap-2 h-11 rounded-full border text-xs tracking-wide transition ${
        saved ? "border-destructive text-destructive" : "border-border hover:border-foreground"
      }`}
    >
      <Heart className={`h-4 w-4 ${saved ? "fill-destructive" : ""}`} />
      {saved ? "Saved to wishlist" : "Save to wishlist"}
    </button>
  );
}
