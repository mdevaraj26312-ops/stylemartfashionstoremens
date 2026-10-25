import { describe, expect, it } from "vitest";
import {
  isJunkBrand,
  isJunkDescription,
  isJunkImage,
  isJunkTitle,
  isPlaceholderImage,
} from "./enrich-validate";

describe("enrich-validate", () => {
  it("flags Amazon promo-banner titles as junk", () => {
    expect(isJunkTitle("Great deals Great prices")).toBe(true);
    expect(isJunkTitle("Starting ₹129 Resistance bands, yoga mats & more")).toBe(true);
    expect(isJunkTitle("Under ₹499 String lights")).toBe(true);
    expect(isJunkTitle("Resistance Bands, Yoga Mats & More")).toBe(true);
    expect(isJunkTitle("Shop early deals now on fitness accessories")).toBe(true);
  });

  it("accepts real product titles", () => {
    expect(isJunkTitle("Vastrado Ivory Maroon Checks Shirt")).toBe(false);
    expect(isJunkTitle("The Souled Store Cotton Men Shirt, Relaxed Fit")).toBe(false);
    expect(isJunkTitle("Indian Graphic Streetwear Cropped T-Shirt")).toBe(false);
  });

  it("flags scraped junk brands but keeps real ones", () => {
    expect(isJunkBrand("Amazon")).toBe(true);
    expect(isJunkBrand("Unknown")).toBe(true);
    expect(isJunkBrand("Various")).toBe(true);
    expect(isJunkBrand("Not specified")).toBe(true);
    expect(isJunkBrand("Bathla & more")).toBe(true);
    expect(isJunkBrand("Vastrado")).toBe(false);
    expect(isJunkBrand("The Souled Store")).toBe(false);
  });

  it("flags Amazon chrome and tracking-beacon images as junk", () => {
    expect(isJunkImage("https://m.media-amazon.com/images/G/31/gno/sprites/nav-sprite-global-1x-reorg-privacy._CB546381437_.png")).toBe(true);
    expect(isJunkImage("https://fls-eu.amazon.in/1/batch/1/OP/A21TJRUUN4KGV:525$uedata=s:%2Frd%2Fuedata%3Fstaticb:0")).toBe(true);
    expect(isJunkImage("https://m.media-amazon.com/images/I/21SMN28tDUL._QL80_._FMpng_.png?aicid=homepage-card-logo")).toBe(true);
    expect(isJunkImage("https://m.media-amazon.com/images/I/615xtmWrSCL._SY741_.jpg")).toBe(false);
    expect(isJunkImage("https://example.com/product/shirt-front.jpg")).toBe(false);
  });

  it("flags promo descriptions and scrape-failure filler text as junk", () => {
    expect(isJunkDescription("Shop early deals on resistance bands, yoga mats, and more.")).toBe(true);
    expect(isJunkDescription("Indian Graphic Streetwear Cropped T-Shirt. Check Amazon India for current price.")).toBe(true);
    expect(isJunkDescription("Slim-fit cotton shirt with a spread collar and full sleeves.")).toBe(false);
  });

  it("recognises the neutral placeholder image", () => {
    expect(isPlaceholderImage("https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=900&q=70")).toBe(true);
    expect(isPlaceholderImage("https://m.media-amazon.com/images/I/615xtmWrSCL._SY741_.jpg")).toBe(false);
  });
});
