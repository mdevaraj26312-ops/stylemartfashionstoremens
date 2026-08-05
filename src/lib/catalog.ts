export type Store = "Amazon" | "Flipkart" | "Meesho" | "Myntra" | "Ajio" | "Other";

export type CategorySlug =
  | "men"
  | "footwear"
  | "bags"
  | "watches"
  | "jewellery"
  | "accessories";

export type Product = {
  slug: string;
  name: string;
  brand: string;
  price: number;
  original: number;
  img: string;
  source: Store;
  category: CategorySlug;
  rating: number;
  reviews: number;
  description: string;
  affiliateUrl: string;
  trending?: boolean;
  newArrival?: boolean;
  deal?: boolean;
};

export type Category = {
  slug: CategorySlug;
  name: string;
  short: string;
  tagline: string;
  hero: string;
  img: string;
  count: string;
};

export const CATEGORIES: Category[] = [
  {
    slug: "men",
    name: "Men's Fashion",
    short: "Men",
    tagline: "Shirts, tees, denim & tailored essentials.",
    hero: "https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=1600&q=80",
    img: "https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=900&q=70",
    count: "Shop men",
  },
  {
    slug: "footwear",
    name: "Footwear",
    short: "Footwear",
    tagline: "Sneakers, loafers, boots & formal shoes.",
    hero: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1600&q=80",
    img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=70",
    count: "Shop footwear",
  },
  {
    slug: "bags",
    name: "Bags & Accessories",
    short: "Bags",
    tagline: "Briefcases, backpacks, duffles & more.",
    hero: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1600&q=80",
    img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=70",
    count: "Shop bags",
  },
  {
    slug: "watches",
    name: "Watches",
    short: "Watches",
    tagline: "Analog, smart & statement pieces.",
    hero: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=1600&q=80",
    img: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=900&q=70",
    count: "Shop watches",
  },
  {
    slug: "jewellery",
    name: "Men's Jewellery",
    short: "Jewellery",
    tagline: "Chains, rings, bracelets & statement pieces.",
    hero: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1600&q=80",
    img: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=900&q=70",
    count: "Shop jewellery",
  },
  {
    slug: "accessories",
    name: "Fashion Accessories",
    short: "Accessories",
    tagline: "Sunglasses, belts, scarves & more.",
    hero: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1600&q=80",
    img: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=70",
    count: "Shop accessories",
  },
];

export const STORES: Store[] = ["Amazon", "Flipkart", "Meesho", "Myntra", "Ajio", "Other"];

export const getCategory = (slug: string) =>
  CATEGORIES.find((c) => c.slug === slug);

export const inr = (n: number) => `₹${Number(n).toLocaleString("en-IN")}`;
export const discountPct = (price: number, original: number) =>
  original > price ? Math.round(((original - price) / original) * 100) : 0;
