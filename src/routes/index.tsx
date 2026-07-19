import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Search,
  Menu,
  Heart,
  ShoppingBag,
  ArrowUpRight,
  ArrowRight,
  Instagram,
  Twitter,
  Facebook,
  Youtube,
  Mail,
} from "lucide-react";

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

/* ---------- Data ---------- */

const NAV = [
  { label: "Women", href: "#women" },
  { label: "Men", href: "#men" },
  { label: "Kids", href: "#kids" },
  { label: "Edits", href: "#edits" },
  { label: "Sale", href: "#sale" },
  { label: "Journal", href: "#journal" },
];

const CATEGORIES = [
  {
    name: "Women's Fashion",
    count: "3,240 pieces",
    img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=70",
  },
  {
    name: "Men's Fashion",
    count: "2,180 pieces",
    img: "https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=900&q=70",
  },
  {
    name: "Kids Fashion",
    count: "980 pieces",
    img: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=900&q=70",
  },
  {
    name: "Footwear",
    count: "1,540 pieces",
    img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=70",
  },
  {
    name: "Bags",
    count: "870 pieces",
    img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=70",
  },
  {
    name: "Watches",
    count: "620 pieces",
    img: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=900&q=70",
  },
  {
    name: "Jewellery",
    count: "1,120 pieces",
    img: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=900&q=70",
  },
  {
    name: "Accessories",
    count: "740 pieces",
    img: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=70",
  },
];

type Product = {
  name: string;
  brand: string;
  price: number;
  original: number;
  img: string;
  source: "Amazon" | "Flipkart" | "Meesho" | "Myntra" | "Ajio";
};

const TRENDING: Product[] = [
  {
    name: "Ribbed Knit Midi Dress",
    brand: "Zara",
    price: 2499,
    original: 3999,
    source: "Myntra",
    img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=70",
  },
  {
    name: "Oversized Linen Shirt",
    brand: "H&M",
    price: 1799,
    original: 2799,
    source: "Amazon",
    img: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=70",
  },
  {
    name: "Chunky Leather Loafers",
    brand: "Charles & Keith",
    price: 3299,
    original: 4999,
    source: "Ajio",
    img: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=70",
  },
  {
    name: "Structured Tote Bag",
    brand: "Lavie",
    price: 1899,
    original: 3499,
    source: "Flipkart",
    img: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=70",
  },
  {
    name: "Gold Hoop Earrings",
    brand: "Accessorize",
    price: 899,
    original: 1499,
    source: "Meesho",
    img: "https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&w=800&q=70",
  },
];

const NEW_ARRIVALS: Product[] = [
  {
    name: "Wide-Leg Pleated Trousers",
    brand: "Mango",
    price: 2799,
    original: 3499,
    source: "Myntra",
    img: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=70",
  },
  {
    name: "Minimal Analog Watch",
    brand: "Daniel Wellington",
    price: 6999,
    original: 9999,
    source: "Amazon",
    img: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=800&q=70",
  },
  {
    name: "Cropped Denim Jacket",
    brand: "Levi's",
    price: 3199,
    original: 4999,
    source: "Ajio",
    img: "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?auto=format&fit=crop&w=800&q=70",
  },
  {
    name: "Silk Scarf, Botanical",
    brand: "Global Desi",
    price: 1299,
    original: 1999,
    source: "Flipkart",
    img: "https://images.unsplash.com/photo-1601924582970-9238bcb495d9?auto=format&fit=crop&w=800&q=70",
  },
  {
    name: "Suede Ankle Boots",
    brand: "Steve Madden",
    price: 4499,
    original: 6999,
    source: "Myntra",
    img: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=800&q=70",
  },
];

const DEALS: Product[] = [
  {
    name: "Cotton Poplin Shirt",
    brand: "Uniqlo",
    price: 999,
    original: 2499,
    source: "Amazon",
    img: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=70",
  },
  {
    name: "Kids Floral Sundress",
    brand: "H&M Kids",
    price: 799,
    original: 1799,
    source: "Meesho",
    img: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=70",
  },
  {
    name: "Classic White Sneakers",
    brand: "Adidas",
    price: 2799,
    original: 5999,
    source: "Flipkart",
    img: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=800&q=70",
  },
  {
    name: "Statement Pearl Necklace",
    brand: "Ayesha",
    price: 599,
    original: 1499,
    source: "Meesho",
    img: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=800&q=70",
  },
  {
    name: "Aviator Sunglasses",
    brand: "Ray-Ban",
    price: 3999,
    original: 8990,
    source: "Amazon",
    img: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=70",
  },
];

/* ---------- Utilities ---------- */

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const off = (p: number, o: number) => Math.round(((o - p) / o) * 100);

/* ---------- Components ---------- */

function Logo() {
  return (
    <a href="#" className="flex items-center gap-2 group">
      <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground font-display text-lg">
        S
      </span>
      <span className="font-display text-2xl leading-none tracking-tight">
        Style<span className="text-accent">Mart</span>
      </span>
    </a>
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

function Header() {
  const [open, setOpen] = useState(false);
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
              <Menu className="h-5 w-5" />
            </button>
            <Logo />
          </div>

          <nav className="hidden md:flex items-center justify-center gap-8 text-sm">
            {NAV.map((n) => (
              <a
                key={n.label}
                href={n.href}
                className="relative py-1 text-foreground/80 hover:text-foreground transition-colors after:absolute after:left-0 after:right-0 after:-bottom-0.5 after:h-px after:bg-accent after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
              >
                {n.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <button
              className="hidden sm:grid place-items-center h-9 w-9 rounded-full hover:bg-muted"
              aria-label="Wishlist"
            >
              <Heart className="h-4.5 w-4.5" />
            </button>
            <button
              className="grid place-items-center h-9 w-9 rounded-full hover:bg-muted"
              aria-label="Bag"
            >
              <ShoppingBag className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>

        {/* Search bar */}
        <div className="pb-4">
          <label className="flex items-center gap-3 h-11 rounded-full border border-border bg-card px-4 focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20 transition">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
              placeholder="Search dresses, sneakers, watches, brands…"
            />
            <span className="hidden sm:inline text-[11px] tracking-[0.18em] uppercase text-muted-foreground">
              10k+ items
            </span>
          </label>
        </div>

        {open && (
          <div className="md:hidden pb-4 grid gap-1">
            {NAV.map((n) => (
              <a
                key={n.label}
                href={n.href}
                onClick={() => setOpen(false)}
                className="py-2 text-sm border-b border-border/60"
              >
                {n.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}

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
              <a
                href="#trending"
                className="group inline-flex items-center gap-2 h-12 px-6 rounded-full bg-primary text-primary-foreground text-sm tracking-wide hover:bg-accent transition-colors"
              >
                Shop the edit
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <a
                href="#categories"
                className="inline-flex items-center gap-2 h-12 px-5 rounded-full border border-border text-sm hover:border-foreground transition-colors"
              >
                Browse categories
              </a>
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
                  <a
                    href="#trending"
                    className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-accent"
                  >
                    Shop this look <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
              <div className="hidden sm:block absolute -left-6 -bottom-6 h-28 w-28 rounded-full bg-accent text-accent-foreground grid place-items-center rotate-[-12deg] shadow-lg">
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
  href = "#",
  cta = "View all",
}: {
  eyebrow: string;
  title: string;
  href?: string;
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
      <a
        href={href}
        className="shrink-0 inline-flex items-center gap-1.5 text-sm border-b border-foreground/40 hover:border-accent hover:text-accent transition-colors pb-1"
      >
        {cta} <ArrowRight className="h-4 w-4" />
      </a>
    </div>
  );
}

function Categories() {
  return (
    <section id="categories" className="py-14 sm:py-20">
      <SectionHead eyebrow="Shop by category" title="Every wardrobe, one place." cta="All categories" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {CATEGORIES.map((c) => (
            <a
              key={c.name}
              href="#"
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
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCard({ p, deal = false }: { p: Product; deal?: boolean }) {
  const pct = off(p.price, p.original);
  return (
    <article className="group flex flex-col">
      <div className="relative aspect-[3/4] overflow-hidden rounded-md bg-muted">
        <img
          src={p.img}
          alt={p.name}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {pct > 0 && (
          <span
            className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wider ${
              deal
                ? "bg-destructive text-destructive-foreground"
                : "bg-background text-foreground"
            }`}
          >
            {pct}% OFF
          </span>
        )}
        <button
          aria-label="Save"
          className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-background/90 text-foreground opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition"
        >
          <Heart className="h-4 w-4" />
        </button>
        <span className="absolute left-3 bottom-3 rounded-sm bg-background/90 backdrop-blur px-2 py-0.5 text-[10px] tracking-[0.16em] uppercase">
          {p.source}
        </span>
      </div>

      <div className="mt-3 flex-1 flex flex-col">
        <p className="text-[11px] tracking-[0.18em] uppercase text-muted-foreground">
          {p.brand}
        </p>
        <h3 className="mt-1 text-sm font-medium leading-snug line-clamp-2 min-h-[2.5rem]">
          {p.name}
        </h3>
        <div className="mt-1.5 flex items-baseline gap-2">
          <span className="font-display text-lg">{inr(p.price)}</span>
          {p.original > p.price && (
            <span className="text-xs text-muted-foreground line-through">
              {inr(p.original)}
            </span>
          )}
        </div>
        <a
          href="#"
          className="mt-3 inline-flex items-center justify-center gap-1.5 h-10 rounded-full bg-primary text-primary-foreground text-xs tracking-[0.15em] uppercase hover:bg-accent transition-colors"
        >
          Buy Now <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </article>
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
  products: Product[];
  deal?: boolean;
  tinted?: boolean;
}) {
  return (
    <section
      id={id}
      className={`py-14 sm:py-20 ${tinted ? "bg-secondary/60" : ""}`}
    >
      <SectionHead eyebrow={eyebrow} title={title} cta={cta} />
      <div className="mx-auto max-w-7xl">
        {/* Mobile horizontal scroll */}
        <div className="sm:hidden no-scrollbar overflow-x-auto pl-4 pr-4">
          <div className="flex gap-4 w-max">
            {products.map((p) => (
              <div key={p.name} className="w-[62vw] max-w-[260px]">
                <ProductCard p={p} deal={deal} />
              </div>
            ))}
          </div>
        </div>
        {/* Desktop grid */}
        <div className="hidden sm:grid px-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {products.map((p) => (
            <ProductCard key={p.name} p={p} deal={deal} />
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
                <a
                  href="#"
                  className="mt-6 inline-flex items-center gap-2 text-sm border-b border-primary-foreground/40 pb-1 hover:border-accent hover:text-accent transition"
                >
                  Read the edit <ArrowRight className="h-4 w-4" />
                </a>
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

function Newsletter() {
  return (
    <section className="py-14 sm:py-20 bg-secondary/60">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center">
        <p className="eyebrow">The Style Mart Letter</p>
        <h2 className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl leading-tight">
          Trends, drops and deals — <em className="italic text-accent">weekly</em>.
        </h2>
        <p className="mt-4 text-sm text-muted-foreground">
          One thoughtful email. No spam, ever. Unsubscribe with one click.
        </p>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="mt-7 grid grid-cols-[minmax(0,1fr)_auto] gap-2 max-w-md mx-auto"
        >
          <label className="flex items-center gap-3 h-12 rounded-full border border-border bg-card px-5 focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20 min-w-0">
            <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
            <input
              type="email"
              required
              placeholder="your@email.com"
              className="flex-1 min-w-0 bg-transparent outline-none text-sm"
            />
          </label>
          <button className="shrink-0 h-12 px-5 sm:px-6 rounded-full bg-primary text-primary-foreground text-sm tracking-wide hover:bg-accent transition">
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}

function Footer() {
  const cols = [
    {
      h: "Shop",
      links: ["Women", "Men", "Kids", "Footwear", "Bags", "Watches", "Jewellery", "Accessories"],
    },
    { h: "Discover", links: ["New Arrivals", "Trending", "Best Deals", "Style Edits", "Journal", "Brands"] },
    { h: "Help", links: ["How it works", "Affiliate disclosure", "Contact", "FAQ"] },
    { h: "Company", links: ["About Style Mart", "Careers", "Press", "Privacy", "Terms"] },
  ];
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

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {cols.map((c) => (
              <div key={c.h}>
                <p className="text-[11px] tracking-[0.22em] uppercase text-primary-foreground/60">
                  {c.h}
                </p>
                <ul className="mt-4 space-y-2.5">
                  {c.links.map((l) => (
                    <li key={l}>
                      <a href="#" className="text-sm text-primary-foreground/85 hover:text-accent transition">
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-primary-foreground/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs text-primary-foreground/60">
            © {new Date().getFullYear()} Style Mart. Prices and availability provided by partner
            stores. Style Mart earns commission on qualifying purchases.
          </p>
          <div className="flex items-center gap-3 text-[10px] tracking-[0.22em] uppercase text-primary-foreground/60">
            <span>Amazon</span>
            <span className="opacity-40">·</span>
            <span>Flipkart</span>
            <span className="opacity-40">·</span>
            <span>Myntra</span>
            <span className="opacity-40">·</span>
            <span>Meesho</span>
            <span className="opacity-40">·</span>
            <span>Ajio</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Hero />
        <Marquee />
        <Categories />
        <ProductRail
          id="trending"
          eyebrow="Trending now"
          title="What everyone is wearing."
          cta="View trending"
          products={TRENDING}
        />
        <EditorialBanner />
        <ProductRail
          id="new"
          eyebrow="Just in"
          title="New arrivals, freshly picked."
          cta="See all new"
          products={NEW_ARRIVALS}
          tinted
        />
        <ProductRail
          id="sale"
          eyebrow="Best deals"
          title="Prices we couldn't ignore."
          cta="Shop the sale"
          products={DEALS}
          deal
        />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
