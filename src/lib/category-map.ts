// Pure mapping logic for the automatic men's fashion sync.
// Every product pulled from a partner feed/API is bucketed into one of the
// store's men's style categories here. No imports — unit-testable as-is.

export type StyleCategory = "men" | "footwear" | "watches" | "jewellery" | "accessories";

export type BucketId =
  | "oversized-tshirts"
  | "shirts"
  | "jeans-cargos"
  | "trousers-joggers"
  | "hoodies-jackets"
  | "coord-street"
  | "footwear"
  | "watches"
  | "jewellery"
  | "belts-wallets"
  | "formal"
  | "party"
  | "ethnic"
  | "gym";

export const BUCKETS: {
  id: BucketId;
  label: string;
  category: StyleCategory;
  searchIndex: string;
}[] = [
  { id: "oversized-tshirts", label: "Oversized & Graphic T-Shirts", category: "men", searchIndex: "Apparel" },
  { id: "shirts", label: "Casual, Korean & Vintage Shirts", category: "men", searchIndex: "Apparel" },
  { id: "jeans-cargos", label: "Jeans, Baggy Jeans & Cargo Pants", category: "men", searchIndex: "Apparel" },
  { id: "trousers-joggers", label: "Trousers, Joggers & Track Pants", category: "men", searchIndex: "Apparel" },
  { id: "hoodies-jackets", label: "Hoodies, Sweatshirts & Jackets", category: "men", searchIndex: "Apparel" },
  { id: "coord-street", label: "Co-ord Sets & Streetwear", category: "men", searchIndex: "Apparel" },
  { id: "footwear", label: "Sneakers, Shoes, Sandals & Slides", category: "footwear", searchIndex: "Shoes" },
  { id: "watches", label: "Watches", category: "watches", searchIndex: "Watches" },
  { id: "jewellery", label: "Chains, Bracelets & Rings", category: "jewellery", searchIndex: "Jewellery" },
  { id: "belts-wallets", label: "Belts, Wallets, Caps & Sunglasses", category: "accessories", searchIndex: "Apparel" },
  { id: "formal", label: "Formal Wear", category: "men", searchIndex: "Apparel" },
  { id: "party", label: "Party Wear", category: "men", searchIndex: "Apparel" },
  { id: "ethnic", label: "Ethnic Wear", category: "men", searchIndex: "Apparel" },
  { id: "gym", label: "Gym Wear", category: "men", searchIndex: "Apparel" },
];

export const bucketById = (id: BucketId) => BUCKETS.find((b) => b.id === id)!;

// One partner keyword search per line — a full run stays inside safe API limits.
export const SEARCH_PLAN: { keywords: string; bucket: BucketId }[] = [
  { keywords: "oversized tshirt men", bucket: "oversized-tshirts" },
  { keywords: "graphic print tshirt men", bucket: "oversized-tshirts" },
  { keywords: "casual shirt men", bucket: "shirts" },
  { keywords: "korean vintage shirt men", bucket: "shirts" },
  { keywords: "jeans men", bucket: "jeans-cargos" },
  { keywords: "baggy jeans men", bucket: "jeans-cargos" },
  { keywords: "cargo pants men", bucket: "jeans-cargos" },
  { keywords: "trousers men", bucket: "trousers-joggers" },
  { keywords: "joggers track pants men", bucket: "trousers-joggers" },
  { keywords: "hoodie men", bucket: "hoodies-jackets" },
  { keywords: "sweatshirt jacket men", bucket: "hoodies-jackets" },
  { keywords: "co-ord set men", bucket: "coord-street" },
  { keywords: "streetwear co-ord men", bucket: "coord-street" },
  { keywords: "sneakers men", bucket: "footwear" },
  { keywords: "sandals slides men", bucket: "footwear" },
  { keywords: "wrist watch men", bucket: "watches" },
  { keywords: "chain bracelet men", bucket: "jewellery" },
  { keywords: "rings men", bucket: "jewellery" },
  { keywords: "wallet men", bucket: "belts-wallets" },
  { keywords: "belt cap sunglasses men", bucket: "belts-wallets" },
  { keywords: "formal shirt trousers men", bucket: "formal" },
  { keywords: "party wear shirt men", bucket: "party" },
  { keywords: "ethnic kurta men", bucket: "ethnic" },
  { keywords: "gym wear men", bucket: "gym" },
];

// Titles that clearly belong to women or children are dropped — men's only.
export function isLikelyNotMens(title: string): boolean {
  return /women|ladies|lady|girls?\b|kids?\b|boys?\b|junior/i.test(title);
}
