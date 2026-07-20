import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ProductCard } from "@/components/site/ProductCard";
import { RecentlyViewed } from "@/components/site/RecentlyViewed";
import { InstagramSection } from "@/components/site/InstagramSection";
import {
  CATEGORIES,
  trendingProducts,
  newArrivals,
  deals,
} from "@/lib/catalog";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Style Mart — Curated Fashion from Every Store" },
      {
        name: "description",
        content:
          "Trending fashion, new arrivals and the best deals — curated from Amazon, Flipkart, Meesho, Myntra and more.",
      },
    ],
  }),
  component: Home,
});

function Hero() {
  return (
    <section className="relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-6 sm:pt-10 pb-14 sm:pb-20">
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-10 items-end">
          <div className="lg:col-span-5 lg:pb-8 order-2 lg:order-1">
            <p className="eyebrow">Autumn — Winter · Edit 07</p>
            <h1 className="mt-4 font-display text-[13vw] leading-[0.95] sm:text-6xl lg:text-[5.5rem]">
              The season,
              <br />
              <em className="italic text-accent">softly</em> tailored.
            </h1>
            <p className="mt-5 max-w-md text-sm sm:text-base text-muted-foreground leading-relaxed">
              Hand-picked pieces from India's favourite stores — trending silhouettes,
              understated luxe, and honest prices. One place. One tap to buy.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                to="/"
                hash="trending"
                className="group inline-flex items-center gap-2 h-12 px-6 rounded-full bg-primary text-primary-foreground text-sm tracking-wide hover:bg-accent transition-colors"
              >
                Shop the edit
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link
                to="/"
                hash="categories"
                className="inline-flex items-center gap-2 h-12 px-5 rounded-full border border-border text-sm hover:border-foreground transition-colors"
              >
                Browse categories
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-6 max-w-sm">
              <Stat n="10k+" l="Products" />
              <Stat n="120+" l="Brands" />
              <Stat n="8" l="Stores" />
            </div>
          </div>

          <div className="lg:col-span-7 order-1 lg:order-2">
            <div className="relative">
              <div className="relative aspect-[4/5] sm:aspect-[16/12] overflow-hidden rounded-lg bg-muted">
                <img
                  src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80"
                  alt="Featured autumn look"
                  className="h-full w-full object-cover"
                  loading="eager"
                />
                <div className="absolute left-4 top-4 flex items-center gap-2 bg-background/90 backdrop-blur px-3 py-1.5 rounded-full text-[11px] tracking-[0.18em] uppercase">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  Now trending
                </div>
                <div className="absolute right-4 bottom-4 max-w-[70%] bg-background/95 backdrop-blur rounded-md p-4 sm:p-5">
                  <p className="eyebrow">Look 04</p>
                  <p className="mt-1 font-display text-lg sm:text-xl leading-snug">
                    Camel wool coat over ivory knit
                  </p>
                  <Link
                    to="/"
                    hash="trending"
                    className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-accent"
                  >
                    Shop this look <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
              <div className="hidden sm:grid absolute -left-6 -bottom-6 h-28 w-28 rounded-full bg-accent text-accent-foreground place-items-center rotate-[-12deg] shadow-lg">
                <div className="text-center leading-tight">
                  <div className="font-display text-xl">Up to</div>
                  <div className="font-display text-3xl">60%</div>
                  <div className="text-[10px] tracking-[0.2em] uppercase">off</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div>
      <div className="font-display text-2xl">{n}</div>
      <div className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground mt-1">
        {l}
      </div>
    </div>
  );
}

function Marquee() {
  const items = [
    "Free shipping",
    "New arrivals daily",
    "Trusted stores only",
    "Best price checked",
    "Curated by stylists",
    "Instant redirect",
  ];
  return (
    <div className="border-y border-border bg-background overflow-hidden">
      <div className="flex gap-12 py-3 whitespace-nowrap animate-[marquee_28s_linear_infinite] text-xs tracking-[0.22em] uppercase text-muted-foreground">
        {Array.from({ length: 3 }).flatMap((_, i) =>
          items.map((t) => (
            <span key={`${i}-${t}`} className="flex items-center gap-12">
              <span>{t}</span>
              <span className="text-accent">✦</span>
            </span>
          )),
        )}
      </div>
      <style>{`@keyframes marquee { to { transform: translateX(-50%); } }`}</style>
    </div>
  );
}

function SectionHead({
  eyebrow,
  title,
  to,
  hash,
  cta = "View all",
}: {
  eyebrow: string;
  title: string;
  to?: "/";
  hash?: string;
  cta?: string;
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 pb-6 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
      <div className="min-w-0">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl leading-tight">
          {title}
        </h2>
      </div>
      <Link
        to={to ?? "/"}
        hash={hash}
        className="shrink-0 inline-flex items-center gap-1.5 text-sm border-b border-foreground/40 hover:border-accent hover:text-accent transition-colors pb-1"
      >
        {cta} <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

function Categories() {
  return (
    <section id="categories" className="py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pb-6">
        <p className="eyebrow">Shop by category</p>
        <h2 className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl leading-tight">
          Every wardrobe, one place.
        </h2>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              to="/category/$slug"
              params={{ slug: c.slug }}
              className="group relative aspect-[4/5] overflow-hidden rounded-md bg-muted"
            >
              <img
                src={c.img}
                alt={c.name}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 text-primary-foreground">
                <div className="flex items-end justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-display text-lg sm:text-xl leading-tight truncate">
                      {c.name}
                    </h3>
                    <p className="text-[11px] tracking-[0.18em] uppercase opacity-80 mt-0.5">
                      {c.count}
                    </p>
                  </div>
                  <span className="shrink-0 grid place-items-center h-8 w-8 rounded-full bg-background/90 text-foreground translate-y-0 group-hover:-translate-y-0.5 transition">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductRail({
  id,
  eyebrow,
  title,
  cta,
  products,
  deal = false,
  tinted = false,
}: {
  id: string;
  eyebrow: string;
  title: string;
  cta?: string;
  products: ReturnType<typeof trendingProducts>;
  deal?: boolean;
  tinted?: boolean;
}) {
  return (
    <section id={id} className={`py-14 sm:py-20 ${tinted ? "bg-secondary/60" : ""}`}>
      <SectionHead eyebrow={eyebrow} title={title} cta={cta} hash={id} />
      <div className="mx-auto max-w-7xl">
        <div className="sm:hidden no-scrollbar overflow-x-auto pl-4 pr-4">
          <div className="flex gap-4 w-max">
            {products.map((p) => (
              <div key={p.slug} className="w-[62vw] max-w-[260px]">
                <ProductCard p={p} deal={deal} />
              </div>
            ))}
          </div>
        </div>
        <div className="hidden sm:grid px-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {products.map((p) => (
            <ProductCard key={p.slug} p={p} deal={deal} />
          ))}
        </div>
      </div>
    </section>
  );
}

function EditorialBanner() {
  return (
    <section id="edits" className="py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-lg bg-primary text-primary-foreground">
          <div className="grid lg:grid-cols-2">
            <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-between min-h-[320px]">
              <p className="eyebrow text-primary-foreground/70">The Style Journal</p>
              <div>
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl leading-tight">
                  Six ways to wear <em className="italic text-gold">the</em> camel coat this season.
                </h2>
                <p className="mt-4 text-sm text-primary-foreground/75 max-w-md">
                  Our stylists break down the one silhouette worth investing in — and the pieces
                  from Myntra, Ajio and Amazon that make it work.
                </p>
                <Link
                  to="/category/$slug"
                  params={{ slug: "women" }}
                  className="mt-6 inline-flex items-center gap-2 text-sm border-b border-primary-foreground/40 pb-1 hover:border-accent hover:text-accent transition"
                >
                  Read the edit <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="relative min-h-[280px] lg:min-h-full">
              <img
                src="https://images.unsplash.com/photo-1483721310020-03333e577078?auto=format&fit=crop&w=1200&q=80"
                alt="Camel coat editorial"
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Home() {
  return (
    <SiteLayout>
      <Hero />
      <Marquee />
      <Categories />
      <ProductRail
        id="trending"
        eyebrow="Trending now"
        title="What everyone is wearing."
        cta="View trending"
        products={trendingProducts()}
      />
      <EditorialBanner />
      <ProductRail
        id="new"
        eyebrow="Just in"
        title="New arrivals, freshly picked."
        cta="See all new"
        products={newArrivals()}
        tinted
      />
      <ProductRail
        id="sale"
        eyebrow="Best deals"
        title="Prices we couldn't ignore."
        cta="Shop the sale"
        products={deals()}
        deal
      />
      <RecentlyViewed />
      <InstagramSection />
    </SiteLayout>

  );
}
