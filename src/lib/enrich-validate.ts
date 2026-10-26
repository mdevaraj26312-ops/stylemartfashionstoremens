// Guards against scraped "product data" that is actually Amazon promotional
// banner content (deal banners, nav sprites, tracking beacons). Any value that
// matches these patterns must never be written over real product data — the
// stored value is kept and a neutral fallback is shown instead.

const JUNK_TITLE_RE =
  /great deals|great prices|starting\s*(₹|rs\.?|inr)|under\s*(₹|rs\.?|inr)\s*\d|resistance bands|yoga mats|string lights|deal of the day|lightning deal|shop early deals|shop now|top offers|fashion sale|mega sale|shop by category/i;

const JUNK_BRAND_RE =
  /^(amazon|unknown|various|not specified|n\/a|na|brand|generic|seller)$|& more/i;

const JUNK_IMAGE_RE =
  /nav-sprite|gno\/sprites|fls-eu\.amazon|uedata|aicid=homepage|homepage-card|beacon|transparent-pixel|aiweblab/i;

const JUNK_DESCRIPTION_RE =
  /great deals|great prices|resistance bands|yoga mats|string lights|deal of the day|shop early deals|check amazon/i;

// The exact neutral placeholder image used when no real product image exists.
export const PLACEHOLDER_IMAGE_PREFIX =
  "https://images.unsplash.com/photo-1445205170230-053b83016050";

export function isJunkTitle(v: string): boolean {
  return JUNK_TITLE_RE.test(v);
}

export function isJunkBrand(v: string): boolean {
  return JUNK_BRAND_RE.test(v.trim());
}

export function isJunkImage(v: string): boolean {
  return JUNK_IMAGE_RE.test(v);
}

export function isJunkDescription(v: string): boolean {
  return JUNK_DESCRIPTION_RE.test(v);
}

/** A stored image that is the neutral placeholder — safe to replace with real data. */
export function isPlaceholderImage(v: string): boolean {
  return v.startsWith(PLACEHOLDER_IMAGE_PREFIX);
}
