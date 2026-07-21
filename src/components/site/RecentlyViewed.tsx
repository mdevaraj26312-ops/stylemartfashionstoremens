import { useQuery } from "@tanstack/react-query";
import { useRecentlyViewed } from "@/lib/user-store";
import { getProductsBySlugs } from "@/lib/products.functions";
import { ProductCard } from "./ProductCard";

export function RecentlyViewed({ excludeSlug }: { excludeSlug?: string } = {}) {
  const slugs = useRecentlyViewed().filter((s) => s !== excludeSlug);
  const { data } = useQuery({
    queryKey: ["recently-viewed", slugs.join(",")],
    queryFn: () => getProductsBySlugs({ data: { slugs } }),
    enabled: slugs.length > 0,
  });

  const bySlug = new Map((data ?? []).map((p) => [p.slug, p]));
  const items = slugs.map((s) => bySlug.get(s)).filter((p): p is NonNullable<typeof p> => Boolean(p)).slice(0, 8);

  if (items.length === 0) return null;

  return (
    <section className="py-14 sm:py-20 border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pb-6">
        <p className="eyebrow">Recently viewed</p>
        <h2 className="mt-2 font-display text-3xl sm:text-4xl leading-tight">
          Pick up where you left off.
        </h2>
      </div>
      <div className="mx-auto max-w-7xl">
        <div className="sm:hidden no-scrollbar overflow-x-auto pl-4 pr-4">
          <div className="flex gap-4 w-max">
            {items.map((p) => (
              <div key={p.slug} className="w-[62vw] max-w-[260px]">
                <ProductCard p={p} />
              </div>
            ))}
          </div>
        </div>
        <div className="hidden sm:grid px-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((p) => (
            <ProductCard key={p.slug} p={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
