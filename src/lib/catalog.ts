export type Store = "Amazon" | "Flipkart" | "Meesho" | "Myntra" | "Ajio";

export type CategorySlug =
  | "women"
  | "men"
  | "kids"
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
  gallery?: string[];
  source: Store;
  category: CategorySlug;
  rating: number;
  reviews: number;
  description: string;
  features?: string[];
  affiliateUrl: string;
  tags?: string[];
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
    slug: "women",
    name: "Women's Fashion",
    short: "Women",
    tagline: "Dresses, ethnic, denim & everyday edits.",
    hero: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&q=80",
    img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=70",
    count: "3,240 pieces",
  },
  {
    slug: "men",
    name: "Men's Fashion",
    short: "Men",
    tagline: "Shirts, tees, denim & tailored essentials.",
    hero: "https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=1600&q=80",
    img: "https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=900&q=70",
    count: "2,180 pieces",
  },
  {
    slug: "kids",
    name: "Kids Fashion",
    short: "Kids",
    tagline: "Playful, comfy pieces for every age.",
    hero: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=1600&q=80",
    img: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=900&q=70",
    count: "980 pieces",
  },
  {
    slug: "footwear",
    name: "Footwear",
    short: "Footwear",
    tagline: "Sneakers, heels, boots & everyday steps.",
    hero: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1600&q=80",
    img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=70",
    count: "1,540 pieces",
  },
  {
    slug: "bags",
    name: "Bags & Accessories",
    short: "Bags",
    tagline: "Totes, backpacks, clutches & more.",
    hero: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1600&q=80",
    img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=70",
    count: "870 pieces",
  },
  {
    slug: "watches",
    name: "Watches",
    short: "Watches",
    tagline: "Analog, smart & statement pieces.",
    hero: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=1600&q=80",
    img: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=900&q=70",
    count: "620 pieces",
  },
  {
    slug: "jewellery",
    name: "Jewellery",
    short: "Jewellery",
    tagline: "Everyday gold, statement stones & bridal.",
    hero: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1600&q=80",
    img: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=900&q=70",
    count: "1,120 pieces",
  },
  {
    slug: "accessories",
    name: "Fashion Accessories",
    short: "Accessories",
    tagline: "Sunglasses, belts, scarves & more.",
    hero: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1600&q=80",
    img: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=70",
    count: "740 pieces",
  },
];

export const getCategory = (slug: string) =>
  CATEGORIES.find((c) => c.slug === slug);

// Central product catalog. Add new products here.
export const PRODUCTS: Product[] = [
  // ----- WOMEN -----
  {
    slug: "ribbed-knit-midi-dress-zara",
    name: "Ribbed Knit Midi Dress",
    brand: "Zara",
    price: 2499,
    original: 3999,
    source: "Myntra",
    category: "women",
    rating: 4.6,
    reviews: 328,
    img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1200&q=80",
    description:
      "A softly ribbed midi in a body-skimming silhouette. Pairs beautifully with loafers by day and slingbacks after dark.",
    features: ["Ribbed stretch knit", "Midi length", "Machine washable", "Made in Turkey"],
    affiliateUrl: "https://www.myntra.com",
    trending: true,
  },
  {
    slug: "wide-leg-pleated-trousers-mango",
    name: "Wide-Leg Pleated Trousers",
    brand: "Mango",
    price: 2799,
    original: 3499,
    source: "Myntra",
    category: "women",
    rating: 4.4,
    reviews: 142,
    img: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=1200&q=80",
    description:
      "High-rise pleated trousers in a fluid drape. The clean office-to-evening trouser worth investing in.",
    features: ["High rise", "Pleated front", "Concealed side zip"],
    affiliateUrl: "https://www.myntra.com",
    newArrival: true,
  },
  {
    slug: "cropped-denim-jacket-levis",
    name: "Cropped Denim Jacket",
    brand: "Levi's",
    price: 3199,
    original: 4999,
    source: "Ajio",
    category: "women",
    rating: 4.7,
    reviews: 519,
    img: "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?auto=format&fit=crop&w=1200&q=80",
    description:
      "The Levi's cropped trucker in a lived-in rinse — cut boxy to layer over dresses and knits.",
    features: ["100% cotton denim", "Cropped fit", "Classic Levi's trucker"],
    affiliateUrl: "https://www.ajio.com",
    newArrival: true,
  },
  {
    slug: "silk-scarf-botanical-global-desi",
    name: "Silk Scarf, Botanical",
    brand: "Global Desi",
    price: 1299,
    original: 1999,
    source: "Flipkart",
    category: "women",
    rating: 4.3,
    reviews: 88,
    img: "https://images.unsplash.com/photo-1601924582970-9238bcb495d9?auto=format&fit=crop&w=1200&q=80",
    description: "Hand-rolled silk scarf in a soft botanical print. Wear it at the neck, hair or handbag.",
    affiliateUrl: "https://www.flipkart.com",
  },
  {
    slug: "cotton-poplin-shirt-uniqlo",
    name: "Cotton Poplin Shirt",
    brand: "Uniqlo",
    price: 999,
    original: 2499,
    source: "Amazon",
    category: "women",
    rating: 4.5,
    reviews: 1032,
    img: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1200&q=80",
    description: "Crisp poplin shirt with a relaxed drop shoulder — a true wardrobe workhorse.",
    affiliateUrl: "https://www.amazon.in",
    deal: true,
  },

  // ----- MEN -----
  {
    slug: "oversized-linen-shirt-hm",
    name: "Oversized Linen Shirt",
    brand: "H&M",
    price: 1799,
    original: 2799,
    source: "Amazon",
    category: "men",
    rating: 4.4,
    reviews: 214,
    img: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1200&q=80",
    description: "Airy pure-linen shirt with a relaxed cut. Roll the sleeves and go.",
    features: ["100% linen", "Relaxed fit", "Coconut buttons"],
    affiliateUrl: "https://www.amazon.in",
    trending: true,
  },
  {
    slug: "slim-fit-chinos-arrow",
    name: "Slim-Fit Stretch Chinos",
    brand: "Arrow",
    price: 1499,
    original: 2999,
    source: "Flipkart",
    category: "men",
    rating: 4.3,
    reviews: 402,
    img: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=1200&q=80",
    description: "A polished slim chino with just enough stretch for all-day comfort.",
    affiliateUrl: "https://www.flipkart.com",
    deal: true,
  },
  {
    slug: "merino-crew-neck-sweater-marks",
    name: "Merino Crew-Neck Sweater",
    brand: "Marks & Spencer",
    price: 3499,
    original: 4999,
    source: "Myntra",
    category: "men",
    rating: 4.6,
    reviews: 178,
    img: "https://images.unsplash.com/photo-1526718583451-e88ebf774771?auto=format&fit=crop&w=1200&q=80",
    description: "Fine-gauge merino in an easy crew — the kind of knit you'll live in.",
    affiliateUrl: "https://www.myntra.com",
    newArrival: true,
  },
  {
    slug: "graphic-tee-nike",
    name: "Essential Graphic Tee",
    brand: "Nike",
    price: 899,
    original: 1495,
    source: "Ajio",
    category: "men",
    rating: 4.5,
    reviews: 641,
    img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
    description: "Soft-hand cotton tee with a subtle chest graphic. Weekend uniform.",
    affiliateUrl: "https://www.ajio.com",
  },

  // ----- KIDS -----
  {
    slug: "kids-floral-sundress-hm",
    name: "Kids Floral Sundress",
    brand: "H&M Kids",
    price: 799,
    original: 1799,
    source: "Meesho",
    category: "kids",
    rating: 4.4,
    reviews: 89,
    img: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=1200&q=80",
    description: "Breezy cotton sundress with a ruffled hem — made for garden birthdays.",
    affiliateUrl: "https://www.meesho.com",
    deal: true,
    trending: true,
  },
  {
    slug: "boys-denim-overalls-uspa",
    name: "Boys Denim Overalls",
    brand: "U.S. Polo Kids",
    price: 1299,
    original: 2199,
    source: "Flipkart",
    category: "kids",
    rating: 4.5,
    reviews: 122,
    img: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=1200&q=80",
    description: "Classic denim overalls with adjustable straps. Layer over a stripe tee.",
    affiliateUrl: "https://www.flipkart.com",
    newArrival: true,
  },
  {
    slug: "kids-hooded-sweatshirt-puma",
    name: "Kids Hooded Sweatshirt",
    brand: "Puma Kids",
    price: 1099,
    original: 1799,
    source: "Amazon",
    category: "kids",
    rating: 4.6,
    reviews: 305,
    img: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=1200&q=80",
    description: "Soft-fleece hoodie in a roomy cut. Perfect for school runs and playdates.",
    affiliateUrl: "https://www.amazon.in",
  },

  // ----- FOOTWEAR -----
  {
    slug: "chunky-leather-loafers-ck",
    name: "Chunky Leather Loafers",
    brand: "Charles & Keith",
    price: 3299,
    original: 4999,
    source: "Ajio",
    category: "footwear",
    rating: 4.5,
    reviews: 268,
    img: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=1200&q=80",
    description: "The season's loafer — a lugged sole and clean upper that finish every outfit.",
    affiliateUrl: "https://www.ajio.com",
    trending: true,
  },
  {
    slug: "classic-white-sneakers-adidas",
    name: "Classic White Sneakers",
    brand: "Adidas",
    price: 2799,
    original: 5999,
    source: "Flipkart",
    category: "footwear",
    rating: 4.7,
    reviews: 2145,
    img: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=1200&q=80",
    description: "The white sneaker that goes with everything. Leather upper, rubber cupsole.",
    affiliateUrl: "https://www.flipkart.com",
    deal: true,
  },
  {
    slug: "suede-ankle-boots-steve-madden",
    name: "Suede Ankle Boots",
    brand: "Steve Madden",
    price: 4499,
    original: 6999,
    source: "Myntra",
    category: "footwear",
    rating: 4.6,
    reviews: 187,
    img: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=1200&q=80",
    description: "Sculpted heel ankle boots in soft suede. The evening staple.",
    affiliateUrl: "https://www.myntra.com",
    newArrival: true,
  },
  {
    slug: "strappy-block-heels-mango",
    name: "Strappy Block Heels",
    brand: "Mango",
    price: 2299,
    original: 3499,
    source: "Myntra",
    category: "footwear",
    rating: 4.3,
    reviews: 96,
    img: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1200&q=80",
    description: "A dressy block heel that's actually wearable. Great with denim and dresses.",
    affiliateUrl: "https://www.myntra.com",
  },

  // ----- BAGS -----
  {
    slug: "structured-tote-bag-lavie",
    name: "Structured Tote Bag",
    brand: "Lavie",
    price: 1899,
    original: 3499,
    source: "Flipkart",
    category: "bags",
    rating: 4.4,
    reviews: 512,
    img: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=80",
    description: "A roomy structured tote that fits a laptop and still looks polished.",
    affiliateUrl: "https://www.flipkart.com",
    trending: true,
  },
  {
    slug: "canvas-backpack-fossil",
    name: "Canvas Everyday Backpack",
    brand: "Fossil",
    price: 3499,
    original: 5999,
    source: "Amazon",
    category: "bags",
    rating: 4.6,
    reviews: 231,
    img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=80",
    description: "Waxed-canvas backpack with a padded laptop sleeve. Commute-approved.",
    affiliateUrl: "https://www.amazon.in",
    newArrival: true,
  },
  {
    slug: "quilted-shoulder-bag-accessorize",
    name: "Quilted Shoulder Bag",
    brand: "Accessorize",
    price: 1499,
    original: 2999,
    source: "Meesho",
    category: "bags",
    rating: 4.2,
    reviews: 108,
    img: "https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=1200&q=80",
    description: "The little quilted bag that does dinner, drinks and everything after.",
    affiliateUrl: "https://www.meesho.com",
    deal: true,
  },

  // ----- WATCHES -----
  {
    slug: "minimal-analog-watch-dw",
    name: "Minimal Analog Watch",
    brand: "Daniel Wellington",
    price: 6999,
    original: 9999,
    source: "Amazon",
    category: "watches",
    rating: 4.7,
    reviews: 892,
    img: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=1200&q=80",
    description: "A clean, minimalist watch on a woven NATO strap. Dresses up or down.",
    affiliateUrl: "https://www.amazon.in",
    trending: true,
  },
  {
    slug: "chronograph-steel-watch-fossil",
    name: "Chronograph Steel Watch",
    brand: "Fossil",
    price: 8499,
    original: 12995,
    source: "Myntra",
    category: "watches",
    rating: 4.5,
    reviews: 314,
    img: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1200&q=80",
    description: "Brushed-steel chronograph with a navy sunray dial. A proper everyday watch.",
    affiliateUrl: "https://www.myntra.com",
    newArrival: true,
  },
  {
    slug: "smartwatch-active-2-noise",
    name: "ColorFit Smartwatch",
    brand: "Noise",
    price: 2499,
    original: 5999,
    source: "Flipkart",
    category: "watches",
    rating: 4.2,
    reviews: 4021,
    img: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=1200&q=80",
    description: "AMOLED smartwatch with health tracking and 7-day battery life.",
    affiliateUrl: "https://www.flipkart.com",
    deal: true,
  },

  // ----- JEWELLERY -----
  {
    slug: "gold-hoop-earrings-accessorize",
    name: "Gold Hoop Earrings",
    brand: "Accessorize",
    price: 899,
    original: 1499,
    source: "Meesho",
    category: "jewellery",
    rating: 4.4,
    reviews: 476,
    img: "https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&w=1200&q=80",
    description: "Everyday gold-tone hoops in a mid-size — the earring you'll never take off.",
    affiliateUrl: "https://www.meesho.com",
    trending: true,
  },
  {
    slug: "statement-pearl-necklace-ayesha",
    name: "Statement Pearl Necklace",
    brand: "Ayesha",
    price: 599,
    original: 1499,
    source: "Meesho",
    category: "jewellery",
    rating: 4.3,
    reviews: 231,
    img: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=1200&q=80",
    description: "Chunky faux-pearl necklace that finishes a plain tee in seconds.",
    affiliateUrl: "https://www.meesho.com",
    deal: true,
  },
  {
    slug: "kundan-earrings-tribe",
    name: "Kundan Drop Earrings",
    brand: "Tribe Amrapali",
    price: 2199,
    original: 3499,
    source: "Myntra",
    category: "jewellery",
    rating: 4.7,
    reviews: 143,
    img: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=1200&q=80",
    description: "Handcrafted kundan drops with pearl detailing. The occasion pair.",
    affiliateUrl: "https://www.myntra.com",
    newArrival: true,
  },

  // ----- ACCESSORIES -----
  {
    slug: "aviator-sunglasses-rayban",
    name: "Aviator Sunglasses",
    brand: "Ray-Ban",
    price: 3999,
    original: 8990,
    source: "Amazon",
    category: "accessories",
    rating: 4.8,
    reviews: 1520,
    img: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=1200&q=80",
    description: "The original aviator, with G-15 lenses and a lightweight metal frame.",
    affiliateUrl: "https://www.amazon.in",
    trending: true,
    deal: true,
  },
  {
    slug: "leather-belt-tommy",
    name: "Reversible Leather Belt",
    brand: "Tommy Hilfiger",
    price: 1799,
    original: 2999,
    source: "Ajio",
    category: "accessories",
    rating: 4.5,
    reviews: 288,
    img: "https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=1200&q=80",
    description: "Two belts in one — brown one side, black the other. Polished either way.",
    affiliateUrl: "https://www.ajio.com",
    newArrival: true,
  },
  {
    slug: "woven-baseball-cap-hm",
    name: "Woven Baseball Cap",
    brand: "H&M",
    price: 599,
    original: 999,
    source: "Amazon",
    category: "accessories",
    rating: 4.2,
    reviews: 176,
    img: "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=1200&q=80",
    description: "Soft-brim woven cap in a warm neutral. Weekend essential.",
    affiliateUrl: "https://www.amazon.in",
  },
];

export const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
export const discountPct = (price: number, original: number) =>
  original > price ? Math.round(((original - price) / original) * 100) : 0;

export const findProduct = (slug: string) =>
  PRODUCTS.find((p) => p.slug === slug);

export const productsByCategory = (slug: CategorySlug) =>
  PRODUCTS.filter((p) => p.category === slug);

export const trendingProducts = () => PRODUCTS.filter((p) => p.trending);
export const newArrivals = () => PRODUCTS.filter((p) => p.newArrival);
export const deals = () => PRODUCTS.filter((p) => p.deal);

export const searchProducts = (q: string) => {
  const s = q.trim().toLowerCase();
  if (!s) return [] as Product[];
  return PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(s) ||
      p.brand.toLowerCase().includes(s) ||
      p.category.toLowerCase().includes(s) ||
      p.description.toLowerCase().includes(s),
  );
};

export const relatedProducts = (p: Product, limit = 4) =>
  PRODUCTS.filter((x) => x.category === p.category && x.slug !== p.slug).slice(
    0,
    limit,
  );
