import { useEffect, useState, useCallback } from "react";
import type { Product, CategorySlug, Store } from "./catalog";

const WISHLIST_KEY = "sm.wishlist.v1";
const RECENT_KEY = "sm.recent.v1";
const ADMIN_KEY = "sm.admin.products.v1";
const CLICKS_KEY = "sm.clicks.v1";
const MAX_RECENT = 12;

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent(`sm-store-${key}`));
  } catch {
    // ignore
  }
}

function useStore<T>(key: string, fallback: T): [T, (v: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(fallback);
  useEffect(() => {
    setValue(read<T>(key, fallback));
    const handler = () => setValue(read<T>(key, fallback));
    window.addEventListener(`sm-store-${key}`, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(`sm-store-${key}`, handler);
      window.removeEventListener("storage", handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  const set = useCallback(
    (v: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const next = typeof v === "function" ? (v as (p: T) => T)(prev) : v;
        write(key, next);
        return next;
      });
    },
    [key],
  );
  return [value, set];
}

/* ---------- Wishlist ---------- */
export function useWishlist() {
  const [slugs, setSlugs] = useStore<string[]>(WISHLIST_KEY, []);
  const toggle = (slug: string) =>
    setSlugs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [slug, ...prev],
    );
  const has = (slug: string) => slugs.includes(slug);
  const clear = () => setSlugs([]);
  return { slugs, toggle, has, clear };
}

/* ---------- Recently Viewed ---------- */
export function pushRecentView(slug: string) {
  if (typeof window === "undefined") return;
  const cur = read<string[]>(RECENT_KEY, []);
  const next = [slug, ...cur.filter((s) => s !== slug)].slice(0, MAX_RECENT);
  write(RECENT_KEY, next);
}
export function useRecentlyViewed() {
  const [slugs] = useStore<string[]>(RECENT_KEY, []);
  return slugs;
}

/* ---------- Affiliate click tracking ---------- */
type ClickLog = { slug: string; source: Store | string; url: string; at: number };
export function trackAffiliateClick(p: Pick<Product, "slug" | "source" | "affiliateUrl">) {
  if (typeof window === "undefined") return;
  const cur = read<ClickLog[]>(CLICKS_KEY, []);
  const entry: ClickLog = { slug: p.slug, source: p.source, url: p.affiliateUrl, at: Date.now() };
  write(CLICKS_KEY, [entry, ...cur].slice(0, 200));
  // Hook for future analytics providers
  try {
    (window as unknown as { dataLayer?: unknown[] }).dataLayer?.push({
      event: "affiliate_click",
      ...entry,
    });
  } catch {
    // ignore
  }
}
export function useClickLog() {
  const [log] = useStore<ClickLog[]>(CLICKS_KEY, []);
  return log;
}

/* ---------- Admin custom products ---------- */
export type AdminProduct = {
  slug: string;
  name: string;
  brand: string;
  category: CategorySlug;
  price: number;
  original: number;
  img: string;
  source: Store | string;
  rating: number;
  reviews: number;
  description: string;
  affiliateUrl: string;
  trending?: boolean;
  newArrival?: boolean;
  deal?: boolean;
};
export function useAdminProducts() {
  return useStore<AdminProduct[]>(ADMIN_KEY, []);
}
