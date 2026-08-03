import { Link } from "@tanstack/react-router";
import { Instagram, Twitter, Facebook, Youtube } from "lucide-react";
import { CATEGORIES } from "@/lib/catalog";

export function SiteFooter() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-16 pb-10">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-primary-foreground text-primary font-display text-xl">
                S
              </span>
              <span className="font-display text-3xl">
                Style<span className="text-gold">Mart</span>
              </span>
            </div>
            <p className="mt-5 text-sm text-primary-foreground/70 max-w-sm leading-relaxed">
              A curated fashion discovery platform. We handpick pieces from India's favourite
              stores so you spend less time scrolling — and more time wearing what you love.
            </p>
            <div className="mt-6 flex items-center gap-2">
              {[Instagram, Twitter, Facebook, Youtube].map((I, i) => (
                <a
                  key={i}
                  href="#"
                  className="grid h-9 w-9 place-items-center rounded-full border border-primary-foreground/20 hover:bg-primary-foreground hover:text-primary transition"
                  aria-label="Social"
                >
                  <I className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <p className="text-[11px] tracking-[0.22em] uppercase text-primary-foreground/60">
                Shop
              </p>
              <ul className="mt-4 space-y-2.5">
                {CATEGORIES.map((c) => (
                  <li key={c.slug}>
                    <Link
                      to="/category/$slug"
                      params={{ slug: c.slug }}
                      className="text-sm text-primary-foreground/85 hover:text-accent transition"
                    >
                      {c.short}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[11px] tracking-[0.22em] uppercase text-primary-foreground/60">
                Discover
              </p>
              <ul className="mt-4 space-y-2.5">
                <li><Link to="/trending" className="text-sm text-primary-foreground/85 hover:text-accent">Trending</Link></li>
                <li><Link to="/new-arrivals" className="text-sm text-primary-foreground/85 hover:text-accent">New Arrivals</Link></li>
                <li><Link to="/deals" className="text-sm text-primary-foreground/85 hover:text-accent">Best Deals</Link></li>
                <li><Link to="/wishlist" className="text-sm text-primary-foreground/85 hover:text-accent">Wishlist</Link></li>
                <li><Link to="/search" search={{ q: "trending" }} className="text-sm text-primary-foreground/85 hover:text-accent">Search</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-[11px] tracking-[0.22em] uppercase text-primary-foreground/60">
                Company
              </p>
              <ul className="mt-4 space-y-2.5">
                <li><Link to="/about" className="text-sm text-primary-foreground/85 hover:text-accent">About</Link></li>
                <li><Link to="/contact" className="text-sm text-primary-foreground/85 hover:text-accent">Contact</Link></li>
                <li><Link to="/affiliate-disclosure" className="text-sm text-primary-foreground/85 hover:text-accent">Affiliate disclosure</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-primary-foreground/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs text-primary-foreground/60">
            © {new Date().getFullYear()} Style Mart. Prices and availability provided by our retail
            partners.
          </p>
          <div className="flex items-center gap-3 text-[10px] tracking-[0.22em] uppercase text-primary-foreground/60">
            <span>Classic</span><span className="opacity-40">·</span>
            <span>Vintage</span><span className="opacity-40">·</span>
            <span>Premium</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
