import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Heart, Star } from "lucide-react";
import { type Product, inr, discountPct } from "@/lib/catalog";
import { trackAffiliateClick, useWishlist } from "@/lib/user-store";

export function ProductCard({ p, deal = false }: { p: Product; deal?: boolean }) {
  const pct = discountPct(p.price, p.original);
  const isDeal = deal || p.deal;
  const { has, toggle } = useWishlist();
  const saved = has(p.slug);

  return (
    <article className="group flex flex-col">
      <Link
        to="/product/$slug"
        params={{ slug: p.slug }}
        className="relative aspect-[3/4] overflow-hidden rounded-md bg-muted block"
      >
        <img
          src={p.img}
          alt={p.name}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {pct > 0 && (
          <span
            className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wider ${
              isDeal
                ? "bg-destructive text-destructive-foreground"
                : "bg-background text-foreground"
            }`}
          >
            {pct}% OFF
          </span>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggle(p.slug);
          }}
          aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
          aria-pressed={saved}
          className={`absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-background/90 transition ${
            saved
              ? "text-destructive opacity-100 translate-y-0"
              : "text-foreground opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0"
          }`}
        >
          <Heart className={`h-4 w-4 ${saved ? "fill-destructive" : ""}`} />
        </button>
        <span className="absolute left-3 bottom-3 rounded-sm bg-background/90 backdrop-blur px-2 py-0.5 text-[10px] tracking-[0.16em] uppercase">
          {p.source}
        </span>
      </Link>

      <div className="mt-3 flex-1 flex flex-col">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] tracking-[0.18em] uppercase text-muted-foreground truncate">
            {p.brand}
          </p>
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground shrink-0">
            <Star className="h-3 w-3 fill-gold text-gold" />
            {p.rating.toFixed(1)}
          </span>
        </div>
        <Link
          to="/product/$slug"
          params={{ slug: p.slug }}
          className="mt-1 text-sm font-medium leading-snug line-clamp-2 min-h-[2.5rem] hover:text-accent"
        >
          {p.name}
        </Link>
        <p className="mt-1 text-xs text-muted-foreground line-clamp-2 min-h-[2rem]">
          {p.description}
        </p>
        <div className="mt-1.5 flex items-baseline gap-2">
          <span className="font-display text-lg">{inr(p.price)}</span>
          {p.original > p.price && (
            <span className="text-xs text-muted-foreground line-through">
              {inr(p.original)}
            </span>
          )}
        </div>
        <a
          href={p.affiliateUrl}
          target="_blank"
          rel="sponsored noopener noreferrer"
          onClick={() => trackAffiliateClick(p)}
          className="mt-3 inline-flex items-center justify-center gap-1.5 h-10 rounded-full bg-primary text-primary-foreground text-xs tracking-[0.15em] uppercase hover:bg-accent transition-colors"
        >
          Buy Now <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </article>
  );
}

export function ProductGrid({
  products,
  deal = false,
}: {
  products: Product[];
  deal?: boolean;
}) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground text-sm">
        No products found.
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {products.map((p) => (
        <ProductCard key={p.slug} p={p} deal={deal} />
      ))}
    </div>
  );
}
