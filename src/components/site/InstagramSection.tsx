import { Instagram } from "lucide-react";

const TILES = [
  "https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=600&q=70",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=70",
  "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=70",
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=70",
  "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=70",
  "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=600&q=70",
];

export function InstagramSection() {
  return (
    <section className="py-14 sm:py-20 border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">On Instagram</p>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl leading-tight">
            @stylemart · Follow along.
          </h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-md">
            Behind-the-scenes edits, styling tips and first looks at what's trending.
          </p>
        </div>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-primary text-primary-foreground text-xs tracking-[0.16em] uppercase hover:bg-accent transition"
        >
          <Instagram className="h-4 w-4" /> Follow
        </a>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 sm:gap-3">
          {TILES.map((src, i) => (
            <a
              key={i}
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden rounded-md bg-muted"
            >
              <img
                src={src}
               alt="Style Mart men's fashion editorial"
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 grid place-items-center bg-black/0 group-hover:bg-black/30 transition">
                <Instagram className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
