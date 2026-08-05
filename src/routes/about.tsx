import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Style Mart" },
      {
        name: "description",
        content:
          "Style Mart is a curated men's fashion marketplace for tailoring, streetwear, footwear, watches and accessories.",
      },
      { property: "og:title", content: "About — Style Mart" },
      { property: "og:description", content: "A curated fashion discovery platform." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-4xl px-4 sm:px-6 py-16 sm:py-24">
        <p className="eyebrow">Our story</p>
        <h1 className="mt-3 font-display text-4xl sm:text-6xl leading-[1.05]">
          Menswear, <em className="italic text-accent">curated</em> — <br />
          for a life well dressed.
        </h1>
        <p className="mt-6 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl">
          Style Mart started with a simple frustration: too many apps, too many tabs, and never
          quite the right piece. So we built one place — an editor-led discovery platform that
            selects the strongest menswear pieces across tailoring, streetwear and accessories.
        </p>

        <div className="mt-14 grid gap-8 sm:grid-cols-3">
          <Pillar
            n="01"
            t="Editor curated"
            b="Every product is hand-picked by our style team — no algorithmic clutter, no filler."
          />
          <Pillar
            n="02"
            t="Every major store"
            b="One search across a broad catalogue of shirts, tailoring, footwear, watches and accessories."
          />
          <Pillar
            n="03"
            t="One tap to buy"
            b="Tap Buy Now and land straight on the store's product page. Prices always live."
          />
        </div>

        <div className="mt-16 rounded-lg bg-secondary/60 p-8 sm:p-12">
          <p className="eyebrow">Affiliate disclosure</p>
          <p className="mt-3 text-sm text-foreground/85 leading-relaxed">
            Style Mart participates in the affiliate programs of leading fashion retailers. When
            you buy through our links we may earn a small commission — at no extra
            cost to you. That's what keeps this platform independent and free.

          </p>
        </div>

        <div className="mt-16 flex flex-wrap gap-3">
          <Link
            to="/"
            className="inline-flex items-center h-12 px-6 rounded-full bg-primary text-primary-foreground text-sm tracking-wide hover:bg-accent transition"
          >
            Browse the edit
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center h-12 px-6 rounded-full border border-border text-sm hover:border-foreground transition"
          >
            Get in touch
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}

function Pillar({ n, t, b }: { n: string; t: string; b: string }) {
  return (
    <div>
      <div className="font-display text-3xl text-accent">{n}</div>
      <h3 className="mt-3 font-display text-xl">{t}</h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{b}</p>
    </div>
  );
}
