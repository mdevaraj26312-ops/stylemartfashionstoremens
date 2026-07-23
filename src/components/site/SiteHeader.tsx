import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Menu, Heart, X, Shield } from "lucide-react";
import { CATEGORIES } from "@/lib/catalog";
import { useWishlist } from "@/lib/user-store";
import { supabase } from "@/integrations/supabase/client";
import { getMyAdminStatus } from "@/lib/products.functions";



const EXTRA_NAV = [
  { label: "About", to: "/about" as const },
  { label: "Contact", to: "/contact" as const },
];

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 group">
      <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground font-display text-lg">
        S
      </span>
      <span className="font-display text-2xl leading-none tracking-tight">
        Style<span className="text-accent">Mart</span>
      </span>
    </Link>
  );
}

function AnnouncementBar() {
  return (
    <div className="bg-primary text-primary-foreground text-[11px] sm:text-xs">
      <div className="mx-auto max-w-7xl px-4 py-2 flex items-center justify-center gap-6 overflow-hidden">
        <span className="tracking-[0.2em] uppercase whitespace-nowrap">
          Free shipping via partner stores
        </span>
        <span className="hidden sm:inline opacity-60">·</span>
        <span className="hidden sm:inline tracking-[0.2em] uppercase whitespace-nowrap">
          New arrivals daily
        </span>
        <span className="hidden md:inline opacity-60">·</span>
        <span className="hidden md:inline tracking-[0.2em] uppercase whitespace-nowrap">
          Curated across Amazon · Flipkart · Myntra · Meesho
        </span>
      </div>
    </div>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    navigate({ to: "/search", search: { q } });
  };

  return (
    <header className="sticky top-0 z-40 bg-background/85 backdrop-blur border-b border-border">
      <AnnouncementBar />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 h-16">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setOpen((o) => !o)}
              className="md:hidden -ml-2 p-2 rounded-md hover:bg-muted"
              aria-label="Menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <Logo />
          </div>

          <nav className="hidden md:flex items-center justify-center gap-6 text-sm">
            {CATEGORIES.slice(0, 6).map((c) => (
              <Link
                key={c.slug}
                to="/category/$slug"
                params={{ slug: c.slug }}
                className="relative py-1 text-foreground/80 hover:text-foreground transition-colors after:absolute after:left-0 after:right-0 after:-bottom-0.5 after:h-px after:bg-accent after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
                activeProps={{ className: "text-foreground" }}
              >
                {c.short}
              </Link>
            ))}
            {EXTRA_NAV.map((n) => (
              <Link
                key={n.label}
                to={n.to}
                className="relative py-1 text-foreground/80 hover:text-foreground transition-colors"
                activeProps={{ className: "text-foreground" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <AdminLink />
            <WishlistLink />
          </div>


        </div>

        <form onSubmit={submit} className="pb-4">
          <label className="flex items-center gap-3 h-11 rounded-full border border-border bg-card px-4 focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20 transition">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
              placeholder="Search dresses, sneakers, watches, brands…"
            />
            <button
              type="submit"
              className="hidden sm:inline text-[11px] tracking-[0.18em] uppercase text-muted-foreground hover:text-foreground"
            >
              Search
            </button>
          </label>
        </form>

        {open && (
          <div className="md:hidden pb-4 grid gap-1">
            {CATEGORIES.map((c) => (
              <Link
                key={c.slug}
                to="/category/$slug"
                params={{ slug: c.slug }}
                onClick={() => setOpen(false)}
                className="py-2 text-sm border-b border-border/60"
              >
                {c.name}
              </Link>
            ))}
            {EXTRA_NAV.map((n) => (
              <Link
                key={n.label}
                to={n.to}
                onClick={() => setOpen(false)}
                className="py-2 text-sm border-b border-border/60"
              >
                {n.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}

function WishlistLink() {
  const { slugs } = useWishlist();
  return (
    <Link
      to="/wishlist"
      className="relative grid place-items-center h-9 w-9 rounded-full hover:bg-muted"
      aria-label="Wishlist"
    >
      <Heart className="h-4 w-4" />
      {slugs.length > 0 && (
        <span className="absolute -top-0.5 -right-0.5 grid place-items-center h-4 min-w-4 px-1 rounded-full bg-accent text-accent-foreground text-[10px] font-medium">
          {slugs.length}
        </span>
      )}
    </Link>
  );

}
