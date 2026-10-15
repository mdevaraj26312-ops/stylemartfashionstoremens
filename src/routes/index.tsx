import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, ArrowRight, Mail, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ProductCard } from "@/components/site/ProductCard";
import { RecentlyViewed } from "@/components/site/RecentlyViewed";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/catalog";
import { listProducts } from "@/lib/products.functions";
import heroImg from "@/assets/modern-mens-campaign.jpg";

export const Route = createFileRoute("/")({
  loader: async () => {
    const PAGE = 100;
    const first = await listProducts({ data: { sort: "newest", page: 1, pageSize: PAGE } });
    const pageCount = Math.ceil(first.total / PAGE);
    const rest = await Promise.all(
      Array.from({ length: Math.max(0, pageCount - 1) }, (_, i) =>
        listProducts({ data: { sort: "newest", page: i + 2, pageSize: PAGE } }),
      ),
    );
    const all = [first, ...rest].flatMap((r) => r.items);
    const [trending, fresh, sale, best] = await Promise.all([
      listProducts({ data: { flag: "trending", page: 1, pageSize: 10 } }),
      listProducts({ data: { flag: "new", sort: "newest", page: 1, pageSize: 10 } }),
      listProducts({ data: { flag: "deal", page: 1, pageSize: 10 } }),
      listProducts({ data: { sort: "rating", page: 1, pageSize: 10 } }),
    ]);
    return {
      trending: trending.items,
      fresh: fresh.items,
      sale: sale.items,
      best: best.items,
      all,
    };
  },
  head: () => ({
    meta: [
      { title: "Style Mart — Modern Men's Fashion & Everyday Essentials" },
      { name: "description", content: "Discover modern men's fashion at Style Mart. Shop streetwear, premium everyday essentials, footwear and accessories from your favourite brands." },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Style Mart — Modern Men's Fashion & Everyday Essentials" },
      { property: "og:description", content: "A fresh perspective on menswear. Discover contemporary clothing, streetwear, footwear and accessories." },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const MEN_CATEGORIES = [
  "T-Shirts", "Shirts", "Polos", "Jeans", "Trousers", "Cargo", "Hoodies", "Jackets",
  "Blazers", "Suits", "Ethnic Wear", "Footwear", "Watches", "Bags", "Wallets", "Sunglasses",
  "Belts", "Grooming", "Accessories", "Luxury",
] as const;

function Hero() {
  return (
    <section id="top" className="modern-hero relative overflow-hidden bg-secondary">
      <img src={heroImg} alt="Contemporary men's black and grey casualwear campaign" width={1920} height={1024} loading="eager" fetchPriority="high" className="absolute inset-0 h-full w-full object-cover modern-hero-image" />
      <div className="modern-hero-wash absolute inset-0" />
      <div className="relative mx-auto flex h-full max-w-7xl items-center px-5 sm:px-8">
        <div className="modern-hero-copy max-w-lg">
          <p className="text-xs font-semibold uppercase">The new menswear perspective</p>
          <h1 className="mt-5 text-5xl font-extrabold leading-[1.05] sm:text-6xl lg:text-7xl">Style Mart<span className="text-muted-foreground">.</span></h1>
          <p className="mt-4 text-2xl font-semibold sm:text-3xl">Your style. Your everyday.</p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground sm:text-base">Fresh silhouettes. Better essentials. Discover a wardrobe that moves with you.</p>
          <Button asChild size="lg" className="mt-7 h-12 rounded-sm px-6 shadow-none">
            <Link to="/new-arrivals">Shop new arrivals <ArrowUpRight /></Link>
          </Button>
          <Link to="/trending" className="mt-5 flex w-fit items-center gap-2 text-xs font-semibold sm:mt-6">Explore the men's edit <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </div>
      <span className="absolute bottom-6 right-8 hidden text-[10px] font-semibold uppercase sm:block">Style Mart / The everyday collection</span>
    </section>
  );
}

function SectionTitle({ kicker, title, to }: { kicker: string; title: string; to?: "/trending" | "/new-arrivals" | "/deals" }) {
  return <div className="mb-7 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
    <div className="min-w-0"><p className="text-[11px] font-semibold uppercase text-muted-foreground">{kicker}</p><h2 className="mt-2 text-2xl font-bold leading-tight sm:text-3xl">{title}</h2></div>
    {to && <Link to={to} className="flex shrink-0 items-center gap-2 border-b border-foreground pb-1 text-xs font-semibold">View all <ArrowUpRight className="h-4 w-4" /></Link>}
  </div>;
}

function ProductRail({ id, kicker, title, to, products, deal = false }: { id: string; kicker: string; title: string; to: "/trending" | "/new-arrivals" | "/deals"; products: Product[]; deal?: boolean }) {
  if (!products.length) return null;
  return <section id={id} className="modern-section scroll-mt-48 mx-auto max-w-7xl px-5 sm:px-8">
    <SectionTitle kicker={kicker} title={title} to={to} />
    <div className="modern-product-grid grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
      {products.slice(0, 8).map(p => <ProductCard key={p.slug} p={p} deal={deal} />)}
    </div>
  </section>;
}

function AllProducts({ products }: { products: Product[] }) {
  if (!products.length) return null;
  return <section id="all-products" className="modern-section scroll-mt-48 mx-auto max-w-7xl px-5 sm:px-8">
    <SectionTitle kicker="The complete catalogue" title="All products" />
    <div className="modern-product-grid grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
      {products.map(p => <ProductCard key={p.slug} p={p} />)}
    </div>
  </section>;
}

function Categories() {
  return <section id="classic" className="scroll-mt-48 border-b border-border">
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
      <div className="mb-5 flex items-center justify-between"><h2 className="text-lg font-bold">Find your next essential</h2><span className="hidden text-xs text-muted-foreground sm:block">The men's wardrobe</span></div>
      <div className="no-scrollbar flex gap-2 overflow-x-auto pb-2">
        {MEN_CATEGORIES.map(name => <Button key={name} asChild variant="outline" className="h-10 shrink-0 rounded-sm shadow-none"><Link to="/search" search={{ q: name }}>{name}</Link></Button>)}
      </div>
    </div>
  </section>;
}


function Brands({ products }: { products: Product[] }) {
  const brands = useMemo(() => Array.from(new Set(products.map(p => p.brand).filter(Boolean))).slice(0, 8), [products]);
  if (!brands.length) return null;
  return <section id="brands" className="border-y border-border bg-secondary">
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8"><p className="text-center text-[11px] font-semibold uppercase text-muted-foreground">Your favourites. All in one place.</p>
      <div className="mt-7 flex flex-wrap items-center justify-center gap-x-10 gap-y-5 sm:gap-x-16">{brands.map(b => <Link key={b} to="/search" search={{ q: b }} className="max-w-full truncate text-xl font-extrabold transition-opacity hover:opacity-60 sm:text-2xl">{b}</Link>)}</div>
    </div>
  </section>;
}


function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  return <section className="border-t border-border bg-secondary">
    <div className="mx-auto grid max-w-7xl gap-7 px-5 py-12 sm:px-8 lg:grid-cols-2 lg:items-center">
      <div><p className="text-[11px] font-semibold uppercase text-muted-foreground">Stay in the loop</p><h2 className="mt-2 text-2xl font-bold sm:text-3xl">Good style starts here.</h2><p className="mt-3 text-sm text-muted-foreground">New drops, fresh inspiration and standout finds.</p></div>
      {done ? <p className="text-sm">Thank you — you're on the list.</p> : <form onSubmit={e => { e.preventDefault(); if (email.trim()) setDone(true); }} className="grid grid-cols-[minmax(0,1fr)_auto] gap-2">
        <label className="flex h-12 min-w-0 items-center gap-3 rounded-sm border border-border bg-background px-4"><Mail className="h-4 w-4 shrink-0 text-muted-foreground" /><input aria-label="Email address" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="Your email address" className="w-full min-w-0 bg-transparent text-sm outline-none" /></label>
        <Button type="submit" aria-label="Subscribe" className="h-12 rounded-sm px-4 shadow-none"><Plus className="sm:hidden" /><span className="hidden sm:inline">Sign me up</span><ArrowRight className="hidden sm:block" /></Button>
      </form>}
    </div>
  </section>;
}

function Home() {
  const { trending, fresh, sale, best, all } = Route.useLoaderData();
  const hasAny = trending.length + fresh.length + sale.length + best.length > 0;
  return <SiteLayout modern>
    <Hero />
    <Categories />
    <ProductRail id="gen-z" kicker="On everyone's radar" title="Trending now" to="/trending" products={trending} />
    <ProductRail id="vintage" kicker="Just landed" title="New in. Next up." to="/new-arrivals" products={fresh} />
    {!fresh.length && <div id="vintage" />}
    {!hasAny && <div className="px-5 py-12 text-center"><h2 className="text-2xl font-bold">A fresh edit is on its way.</h2><p className="mt-3 text-sm text-muted-foreground">Discover the men's wardrobe by category.</p></div>}
    <Brands products={[...best, ...trending, ...fresh, ...sale]} />
    <ProductRail id="premium" kicker="The curated selection" title="Editor's picks" to="/trending" products={best.length ? best : trending} />
    <ProductRail id="sale" kicker="Great finds. Better prices." title="Worth a closer look" to="/deals" products={sale} deal />
    <AllProducts products={all} />
    <RecentlyViewed />
    <Newsletter />
  </SiteLayout>;
}
