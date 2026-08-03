import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, ArrowRight, Star, Quote, Mail, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ProductCard } from "@/components/site/ProductCard";
import { RecentlyViewed } from "@/components/site/RecentlyViewed";
import { InstagramSection } from "@/components/site/InstagramSection";
import { CATEGORIES, type Product } from "@/lib/catalog";
import { listProducts } from "@/lib/products.functions";
import heroImg from "@/assets/hero-vintage.jpg";
import genzImg from "@/assets/banner-genz.jpg";
import classicImg from "@/assets/banner-classic.jpg";
import vintageImg from "@/assets/banner-vintage.jpg";
import premiumImg from "@/assets/banner-premium.jpg";


export const Route = createFileRoute("/")({
  loader: async () => {
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
    };
  },
  head: () => ({
    meta: [
      { title: "Style Mart — Timeless Style, Modern Elegance" },
      {
        name: "description",
        content:
          "Discover classic, vintage and premium fashion from trusted brands — curated collections, editor's picks and the best deals in one elegant marketplace.",
      },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Style Mart — Timeless Style, Modern Elegance" },
      {
        property: "og:description",
        content: "Classic, vintage and premium fashion curated from trusted brands.",
      },
      { name: "twitter:card", content: "summary_large_image" },
      {
        property: "og:image",
        content:
          "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=80",
      },
      {
        name: "twitter:image",
        content:
          "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=80",
      },
    ],
  }),
  component: Home,
});

/* ---------------------------------- Hero ---------------------------------- */

function Hero() {
  return (
    <section className="relative min-h-[88vh] sm:min-h-screen flex items-end overflow-hidden">
      <img
        src={heroImg}
        alt="Vintage-inspired editorial portrait in a camel wool coat and silk scarf"
        width={1920}
        height={1280}
        className="absolute inset-0 h-full w-full object-cover object-[70%_center]"
        loading="eager"
        fetchPriority="high"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/20" />
      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 pb-14 sm:pb-24 pt-28 text-primary-foreground">
        <p className="eyebrow text-gold">Est. Style Mart · Curated Since Day One</p>
        <h1 className="mt-5 font-display text-[13vw] leading-[0.95] sm:text-6xl lg:text-[5.75rem] max-w-4xl animate-fade-in">
          Timeless Style.
          <br />
          <em className="italic text-gold">Modern</em> Elegance.
        </h1>
        <p className="mt-6 max-w-xl text-sm sm:text-lg text-primary-foreground/80 leading-relaxed">
          Discover Classic, Vintage &amp; Premium Fashion from trusted brands.
        </p>
        <div className="mt-9 flex flex-wrap items-center gap-3">
          <Link
            to="/trending"
            className="group inline-flex items-center gap-2 h-12 sm:h-14 px-7 rounded-full bg-gold text-ink text-sm tracking-[0.14em] uppercase hover:bg-primary-foreground transition-colors"
          >
            Shop Collection
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
          <Link
            to="/"
            hash="brands"
            className="inline-flex items-center gap-2 h-12 sm:h-14 px-7 rounded-full border border-primary-foreground/50 text-sm tracking-[0.14em] uppercase hover:bg-primary-foreground hover:text-ink transition-colors"
          >
            Explore Brands
          </Link>
        </div>
        <div className="mt-12 grid grid-cols-3 gap-6 max-w-md border-t border-primary-foreground/20 pt-6">
          <Stat n="10k+" l="Pieces" />
          <Stat n="120+" l="Houses" />
          <Stat n="8" l="Stores" />
        </div>
      </div>
    </section>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div>
      <div className="font-display text-2xl sm:text-3xl">{n}</div>
      <div className="text-[10px] sm:text-[11px] tracking-[0.2em] uppercase opacity-70 mt-1">{l}</div>
    </div>
  );
}

function Marquee() {
  const items = [
    "Timeless craftsmanship",
    "Vintage archives",
    "Trusted stores only",
    "Best price checked",
    "Curated by stylists",
    "Free shipping",
  ];
  return (
    <div className="border-y border-border bg-secondary/50 overflow-hidden">
      <div className="flex gap-12 py-3 whitespace-nowrap animate-[marquee_32s_linear_infinite] text-xs tracking-[0.22em] uppercase text-muted-foreground">
        {Array.from({ length: 3 }).flatMap((_, i) =>
          items.map((t) => (
            <span key={`${i}-${t}`} className="flex items-center gap-12">
              <span>{t}</span>
              <span className="text-gold">✦</span>
            </span>
          )),
        )}
      </div>
      <style>{`@keyframes marquee { to { transform: translateX(-50%); } }`}</style>
    </div>
  );
}

/* ------------------------------- Collections ------------------------------ */

type Collection = { title: string; blurb: string; img: string; q: string };

const COLLECTIONS: Collection[] = [
  {
    title: "Classic Collection",
    blurb: "Tailored staples that never date.",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1000&q=70",
    q: "classic",
  },
  {
    title: "Vintage Collection",
    blurb: "Archive silhouettes, revived.",
    img: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1000&q=70",
    q: "vintage",
  },
  {
    title: "Premium Collection",
    blurb: "Elevated fabrics and finishing.",
    img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1000&q=70",
    q: "premium",
  },
  {
    title: "Modern Essentials",
    blurb: "The quiet everyday wardrobe.",
    img: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1000&q=70",
    q: "essentials",
  },
  {
    title: "Luxury Accessories",
    blurb: "Gold, leather and fine detail.",
    img: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1000&q=70",
    q: "luxury",
  },
];

function FeaturedCollections() {
  return (
    <section id="collections" className="py-14 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pb-8">
        <p className="eyebrow">Featured collections</p>
        <h2 className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl leading-tight">
          Curated houses of <em className="italic text-accent">taste</em>.
        </h2>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {COLLECTIONS.map((c, i) => (
          <Link
            key={c.title}
            to="/search"
            search={{ q: c.q }}
            className={`group relative overflow-hidden rounded-3xl bg-muted ${
              i === 0 ? "lg:col-span-2 aspect-[16/10]" : "aspect-[4/3]"
            }`}
          >
            <img
              src={c.img}
              alt={c.title}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7 text-primary-foreground">
              <h3 className="font-display text-2xl sm:text-3xl leading-tight">{c.title}</h3>
              <p className="mt-1 text-xs sm:text-sm text-primary-foreground/80">{c.blurb}</p>
              <span className="mt-3 inline-flex items-center gap-1.5 text-[11px] tracking-[0.18em] uppercase text-gold">
                Explore <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------- Categories ------------------------------- */

const EXTRA_TILES = [
  {
    name: "Luxury",
    q: "luxury",
    img: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=900&q=70",
  },
  {
    name: "Vintage",
    q: "vintage",
    img: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=900&q=70",
  },
];

function Categories() {
  return (
    <section id="categories" className="py-14 sm:py-24 bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pb-8">
        <p className="eyebrow">Premium categories</p>
        <h2 className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl leading-tight">
          Every wardrobe, one atelier.
        </h2>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              to="/category/$slug"
              params={{ slug: c.slug }}
              className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted"
            >
              <img
                src={c.img}
                alt={c.name}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 text-primary-foreground">
                <div className="flex items-end justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-display text-lg sm:text-xl leading-tight truncate">
                      {c.short}
                    </h3>
                    <p className="text-[10px] tracking-[0.18em] uppercase opacity-80 mt-0.5 truncate">
                      {c.count}
                    </p>
                  </div>
                  <span className="shrink-0 grid place-items-center h-8 w-8 rounded-full bg-background/90 text-foreground group-hover:-translate-y-0.5 transition">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
          {EXTRA_TILES.map((t) => (
            <Link
              key={t.name}
              to="/search"
              search={{ q: t.q }}
              className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted"
            >
              <img
                src={t.img}
                alt={t.name}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 text-primary-foreground">
                <h3 className="font-display text-lg sm:text-xl leading-tight">{t.name}</h3>
                <p className="text-[10px] tracking-[0.18em] uppercase text-gold mt-0.5">
                  The edit
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- Rails ---------------------------------- */

function SectionHead({
  eyebrow,
  title,
  to,
  cta = "View all",
}: {
  eyebrow: string;
  title: string;
  to: "/trending" | "/new-arrivals" | "/deals";
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
        to={to}
        className="shrink-0 inline-flex items-center gap-1.5 text-sm border-b border-foreground/40 hover:border-accent hover:text-accent transition-colors pb-1"
      >
        {cta} <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

function ProductRail({
  id,
  eyebrow,
  title,
  cta,
  to,
  products,
  deal = false,
  tinted = false,
}: {
  id: string;
  eyebrow: string;
  title: string;
  cta?: string;
  to: "/trending" | "/new-arrivals" | "/deals";
  products: Product[];
  deal?: boolean;
  tinted?: boolean;
}) {
  if (products.length === 0) return null;
  return (
    <section id={id} className={`py-14 sm:py-20 ${tinted ? "bg-secondary/50" : ""}`}>
      <SectionHead eyebrow={eyebrow} title={title} cta={cta} to={to} />
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

function EmptyState() {
  return (
    <section className="py-14 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center">
        <p className="eyebrow">Coming soon</p>
        <h2 className="mt-2 font-display text-3xl sm:text-4xl">The next edit lands shortly.</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Our editors are curating the next drop. Check back soon for fresh picks across every
          category.
        </p>
      </div>
    </section>
  );
}

/* ------------------------------ Editor's picks ----------------------------- */

function EditorsPicks({ products }: { products: Product[] }) {
  if (products.length === 0) return null;
  const [lead, ...rest] = products.slice(0, 5);
  return (
    <section id="editors" className="py-14 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="pb-8">
          <p className="eyebrow">Editor's picks</p>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl leading-tight">
            Chosen by our <em className="italic text-accent">stylists</em>.
          </h2>
        </div>
        <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr] items-stretch">
          <div className="relative overflow-hidden rounded-3xl bg-muted min-h-[320px]">
            <img
              src={lead.img}
              alt={lead.name}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 text-primary-foreground">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/95 text-ink px-3 py-1 text-[10px] tracking-[0.18em] uppercase">
                <Sparkles className="h-3 w-3" /> Pick of the week
              </span>
              <h3 className="mt-3 font-display text-2xl sm:text-3xl leading-tight max-w-lg">
                {lead.name}
              </h3>
              <Link
                to="/product/$slug"
                params={{ slug: lead.slug }}
                className="mt-4 inline-flex items-center gap-2 h-11 px-6 rounded-full bg-primary-foreground text-ink text-xs tracking-[0.16em] uppercase hover:bg-gold transition"
              >
                View piece <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-5">
            {rest.map((p) => (
              <ProductCard key={p.slug} p={p} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ Premium brands ----------------------------- */

function PremiumBrands({ products }: { products: Product[] }) {
  const brands = useMemo(() => {
    const seen = new Map<string, string>();
    for (const p of products) {
      if (p.brand && !seen.has(p.brand)) seen.set(p.brand, p.slug);
    }
    const list = Array.from(seen.keys());
    return list.length
      ? list.slice(0, 12)
      : ["Zara", "H&M", "Levi's", "Raymond", "Fabindia", "Titan", "Tanishq", "Clarks"];
  }, [products]);

  return (
    <section id="brands" className="py-14 sm:py-24 bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="pb-8">
          <p className="eyebrow text-primary-foreground/60">Premium brands</p>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl leading-tight">
            Houses we <em className="italic text-gold">trust</em>.
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {brands.map((b) => (
            <Link
              key={b}
              to="/search"
              search={{ q: b }}
              className="group grid place-items-center h-24 rounded-2xl border border-primary-foreground/15 hover:border-gold hover:bg-primary-foreground/5 transition-colors px-3"
            >
              <span className="font-display text-lg sm:text-xl text-center truncate w-full group-hover:text-gold transition-colors">
                {b}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ Style banners ------------------------------ */

const STYLE_BANNERS = [
  {
    id: "gen-z",
    img: genzImg,
    eyebrow: "Gen Z",
    title: "Bold, playful, unmistakably now.",
    blurb:
      "Statement silhouettes, street-ready layers and colour that refuses to whisper — the edit for a new generation.",
    cta: "Shop Gen Z",
    q: "gen z",
  },
  {
    id: "classic",
    img: classicImg,
    eyebrow: "Classic",
    title: "Tailoring that never dates.",
    blurb:
      "Crisp shirting, clean lines and quiet luxury. Considered pieces designed to stay in rotation for decades.",
    cta: "Shop classic",
    q: "classic",
  },
  {
    id: "vintage",
    img: vintageImg,
    eyebrow: "Vintage",
    title: "Pieces with a past, made for now.",
    blurb:
      "Camel wool coats, silk scarves, heritage denim and gold-toned watches — the archive edit, warmly reimagined.",
    cta: "Shop vintage",
    q: "vintage",
  },
  {
    id: "premium",
    img: premiumImg,
    eyebrow: "Premium",
    title: "The house of gold and ink.",
    blurb:
      "Our most refined selection: elevated fabrics, precise finishing and the kind of detail you only notice up close.",
    cta: "Shop premium",
    q: "premium",
  },
] as const;

function StyleBanners() {
  return (
    <div className="bg-background">
      {STYLE_BANNERS.map((b, i) => (
        <section
          key={b.id}
          id={b.id}
          className={`py-10 sm:py-16 scroll-mt-24 ${i % 2 === 1 ? "bg-secondary/40" : ""}`}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="group relative overflow-hidden rounded-3xl bg-secondary shadow-[0_20px_60px_-30px_rgba(0,0,0,0.45)]">
              <div className={`grid lg:grid-cols-2 ${i % 2 === 1 ? "lg:[direction:rtl]" : ""}`}>
                <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center min-h-[320px] [direction:ltr]">
                  <p className="eyebrow">{b.eyebrow}</p>
                  <h2 className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl leading-tight">
                    {b.title}
                  </h2>
                  <p className="mt-4 text-sm text-muted-foreground max-w-md leading-relaxed">
                    {b.blurb}
                  </p>
                  <Link
                    to="/search"
                    search={{ q: b.q }}
                    className="mt-7 inline-flex w-fit items-center gap-2 h-12 px-6 rounded-full bg-primary text-primary-foreground text-xs tracking-[0.16em] uppercase hover:bg-accent transition-all duration-300 hover:gap-3"
                  >
                    {b.cta} <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className="relative min-h-[300px] lg:min-h-[440px] overflow-hidden [direction:ltr]">
                  <img
                    src={b.img}
                    alt={`${b.eyebrow} fashion editorial`}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent lg:bg-gradient-to-r lg:from-secondary/60 lg:to-transparent" />
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}


/* --------------------------------- Reviews --------------------------------- */

const REVIEWS = [
  {
    name: "Ananya R.",
    city: "Bengaluru",
    text: "Style Mart is the only place I browse before buying. The vintage edit is genuinely well curated.",
  },
  {
    name: "Rohit M.",
    city: "Mumbai",
    text: "Found a camel coat at half the price I'd seen elsewhere. The links took me straight to checkout.",
  },
  {
    name: "Priya S.",
    city: "Delhi",
    text: "It feels like a luxury boutique but the prices are from stores I already trust. Beautifully done.",
  },
];

function Reviews() {
  return (
    <section className="py-14 sm:py-24 bg-secondary/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="pb-8">
          <p className="eyebrow">Customer reviews</p>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl leading-tight">
            Loved by well-dressed people.
          </h2>
        </div>
        <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
          {REVIEWS.map((r) => (
            <figure
              key={r.name}
              className="rounded-3xl bg-card border border-border p-6 sm:p-8 flex flex-col"
            >
              <Quote className="h-6 w-6 text-gold" />
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-foreground/85">
                “{r.text}”
              </blockquote>
              <div className="mt-5 flex items-center gap-1 text-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
              <figcaption className="mt-3 text-[11px] tracking-[0.18em] uppercase text-muted-foreground">
                {r.name} · {r.city}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- Newsletter ------------------------------- */

function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  return (
    <section className="py-14 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
        <p className="eyebrow">The Style Journal</p>
        <h2 className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl leading-tight">
          Weekly edits, quietly delivered.
        </h2>
        <p className="mt-3 text-sm text-muted-foreground max-w-lg mx-auto">
          New arrivals, archive finds and price drops — one considered email a week.
        </p>
        {done ? (
          <p className="mt-7 text-sm text-accent">Thank you — you're on the list.</p>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (email.trim()) setDone(true);
            }}
            className="mt-7 grid gap-3 sm:flex sm:items-center sm:justify-center"
          >
            <label className="flex items-center gap-3 h-12 rounded-full border border-border bg-card px-5 sm:w-96 focus-within:border-accent transition">
              <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="min-w-0 flex-1 bg-transparent outline-none text-sm"
              />
            </label>
            <button
              type="submit"
              className="h-12 px-7 rounded-full bg-primary text-primary-foreground text-xs tracking-[0.18em] uppercase hover:bg-accent transition"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

/* ---------------------------------- Page ----------------------------------- */

function Home() {
  const { trending, fresh, sale, best } = Route.useLoaderData();
  const hasAny = trending.length + fresh.length + sale.length + best.length > 0;

  return (
    <SiteLayout>
      <Hero />
      <Marquee />
      <FeaturedCollections />
      <Categories />
      {!hasAny && <EmptyState />}
      <ProductRail
        id="trending"
        eyebrow="Trending this week"
        title="What everyone is wearing."
        cta="View trending"
        to="/trending"
        products={trending}
      />
      <ProductRail
        id="new"
        eyebrow="New arrivals"
        title="Freshly picked this week."
        cta="See all new"
        to="/new-arrivals"
        products={fresh}
        tinted
      />
      <EditorsPicks products={best.length ? best : trending} />
      <PremiumBrands products={[...best, ...trending, ...fresh, ...sale]} />
      <VintageBanner />
      <ProductRail
        id="best-sellers"
        eyebrow="Best sellers"
        title="Highest rated, most loved."
        cta="Browse all"
        to="/trending"
        products={best}
        tinted
      />
      <ProductRail
        id="sale"
        eyebrow="Featured deals"
        title="Prices we couldn't ignore."
        cta="Shop the sale"
        to="/deals"
        products={sale}
        deal
      />
      <Reviews />
      <RecentlyViewed />
      <Newsletter />
      <InstagramSection />
    </SiteLayout>
  );
}
