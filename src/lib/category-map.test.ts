import { describe, expect, it } from "vitest";
import { BUCKETS, SEARCH_PLAN, bucketById, isLikelyNotMens } from "./category-map";

describe("category map", () => {
  it("covers every men's style category requested for the store", () => {
    const labels = BUCKETS.map((b) => b.label);
    for (const required of [
      "Oversized & Graphic T-Shirts",
      "Casual, Korean & Vintage Shirts",
      "Jeans, Baggy Jeans & Cargo Pants",
      "Trousers, Joggers & Track Pants",
      "Hoodies, Sweatshirts & Jackets",
      "Co-ord Sets & Streetwear",
      "Sneakers, Shoes, Sandals & Slides",
      "Watches",
      "Chains, Bracelets & Rings",
      "Belts, Wallets, Caps & Sunglasses",
      "Formal Wear",
      "Party Wear",
      "Ethnic Wear",
      "Gym Wear",
    ]) {
      expect(labels).toContain(required);
    }
  });

  it("never maps into a women's or kids store category", () => {
    for (const b of BUCKETS) {
      expect(["men", "footwear", "watches", "jewellery", "accessories"]).toContain(b.category);
    }
  });

  it("has at least one keyword search for every bucket", () => {
    const covered = new Set(SEARCH_PLAN.map((s) => s.bucket));
    for (const b of BUCKETS) expect(covered.has(b.id)).toBe(true);
  });

  it("every planned search resolves to a real bucket", () => {
    for (const s of SEARCH_PLAN) expect(bucketById(s.bucket)).toBeDefined();
  });

  it("drops women's and kids titles, keeps men's", () => {
    expect(isLikelyNotMens("Women's Cotton Kurta Set")).toBe(true);
    expect(isLikelyNotMens("Girls Party Frock")).toBe(true);
    expect(isLikelyNotMens("Kids Graphic T-Shirt")).toBe(true);
    expect(isLikelyNotMens("Ladies Handbag")).toBe(true);
    expect(isLikelyNotMens("Men's Oversized Drop-Shoulder Tee")).toBe(false);
    expect(isLikelyNotMens("Men Regular Fit Casual Shirt")).toBe(false);
  });
});
