# Style Mart — Fashion Affiliate Platform Plan

A polished, brand-forward discovery site where visitors browse curated fashion products across categories and click **Buy Now** to purchase via affiliate links on Amazon, Flipkart, Meesho, Myntra, Ajio and others.

---

## 1. Brand Direction

- **Name:** Style Mart
- **Tagline:** *Discover fashion you'll love — from every store, in one place.*
- **Vibe:** Editorial, minimal, magazine-style. Big imagery, generous whitespace, elegant serif headings paired with a clean sans-serif body.
- **Palette (suggested):** Ivory background, deep charcoal text, muted blush/rose accent, subtle gold for highlights.
- **Trust cues:** "Curated picks", "Updated daily", visible source badge (Amazon / Flipkart / Meesho) on every product card.

---

## 2. Website Structure

```text
Style Mart
├── Home
├── Categories
│   ├── Men
│   ├── Women
│   ├── Kids
│   ├── Footwear
│   ├── Bags
│   ├── Watches
│   ├── Jewellery
│   └── Accessories
├── Trending
├── New Arrivals
├── Deals & Offers
├── Brands / Stores
├── Style Edits (Lookbooks)
├── Blog / Style Guide
├── Product Detail Page
├── Search & Filter Results
├── About
├── Contact
├── Affiliate Disclosure
├── Privacy Policy
└── Terms of Use
```

---

## 3. Main Pages

**Home**
- Hero carousel with seasonal edit + CTA
- Shop-by-category grid (8 tiles for the 8 categories)
- Trending Now rail
- Featured Brands / Stores strip
- Editor's Picks / Lookbook teaser
- Best Deals rail
- Newsletter signup

**Category Page** (e.g. Women's Fashion)
- Subcategory chips (Dresses, Tops, Ethnic, Denim…)
- Filters: price, brand, store, color, size, rating, discount
- Sort: trending, newest, price low→high, biggest discount
- Product grid with source badge

**Product Detail Page**
- Large gallery, price, discount %, original price
- Short description + key features
- Source badge + big **Buy Now on [Store]** button (opens affiliate link in new tab, `rel="sponsored noopener"`)
- "You may also like" rail
- Share buttons

**Trending / New Arrivals / Deals** — filtered feeds of the same product pool.

**Brands / Stores page** — grid of partner marketplaces, each linking to a filtered listing.

**Style Edits (Lookbooks)** — themed collections ("Monsoon Edit", "Wedding Guest", "Office Capsule") that group products into a shoppable story.

**Blog** — SEO-driven style guides and trend articles that link to category and product pages.

**Legal:** Affiliate Disclosure (required), Privacy, Terms, Contact, About.

---

## 4. Category Plan

Each of the 8 top categories has curated subcategories:

- **Men:** Shirts, T-Shirts, Jeans, Trousers, Ethnic, Jackets, Activewear, Innerwear
- **Women:** Dresses, Tops, Kurtas & Ethnic, Sarees, Jeans, Skirts, Co-ords, Activewear, Lingerie
- **Kids:** Boys, Girls, Infants, School, Ethnic, Footwear
- **Footwear:** Sneakers, Formal, Heels, Flats, Sandals, Boots, Sports
- **Bags:** Handbags, Backpacks, Totes, Clutches, Laptop Bags, Travel
- **Watches:** Men, Women, Smart, Luxury, Analog, Digital
- **Jewellery:** Earrings, Necklaces, Rings, Bracelets, Bangles, Bridal, Everyday
- **Accessories:** Sunglasses, Belts, Wallets, Caps, Scarves, Ties, Hair

Each subcategory is filterable by store, brand, price and discount.

---

## 5. User Journey

```text
Landing (Home / Google / Social)
        │
        ▼
Browse (Category · Trending · Search · Lookbook)
        │
        ▼
Filter & Sort  ──►  Product Card (image, price, source badge)
        │
        ▼
Product Detail Page
        │
        ▼
Click "Buy Now on Amazon / Flipkart / Meesho"
        │
        ▼
Affiliate redirect (new tab) → purchase on partner store
        │
        ▼
Return: related picks · save to wishlist · newsletter
```

Secondary loops: newsletter signup, wishlist, share to WhatsApp/Instagram, read blog → click product.

---

## 6. Product Organization Plan

Every product entry stores:

- Title, short description, images (multiple)
- Price, original price, discount %
- Currency, source store, brand
- Primary category + subcategory
- Tags (color, occasion, season, material, gender, age group)
- Affiliate URL (per store)
- Rating & review count (from source if allowed)
- Flags: `is_trending`, `is_new`, `is_deal`, `is_featured`
- Timestamps: added, last updated, price last checked

Organization principles:
- One product = one canonical entry, even if listed on multiple stores (store variants stored as children with their own affiliate URL and price).
- Tags power lookbooks, "similar items", and SEO landing pages ("Red Dresses under 1000").
- Admin can pin items to Trending, Featured Brands, or a specific Lookbook.

---

## 7. SEO & Content Strategy

- Unique title + meta description per category, subcategory, product and blog post.
- Clean URLs: `/women/dresses`, `/product/floral-midi-dress-zara`.
- JSON-LD `Product` schema on product pages, `BreadcrumbList` sitewide.
- Blog topics: "Top 10 Monsoon Dresses under ₹1500", "How to Style White Sneakers", buyer guides — all linking into category and product pages.
- Auto-generated `sitemap.xml` + `robots.txt`.

---

## 8. Future Growth Ideas

- **User accounts + Wishlist + Price-drop alerts** (email/WhatsApp).
- **Price history graph** per product.
- **Personalized feed** based on browsed categories.
- **Influencer / Creator storefronts** — creators build their own Style Edits with their affiliate splits.
- **Cashback / coupon layer** aggregating offers from partner stores.
- **AI Stylist** — "Build me an outfit for a beach wedding under ₹5000" returns a shoppable set.
- **Visual search** — upload an image, find similar products.
- **Mobile app (PWA first, native later)** with push notifications for drops and deals.
- **Multi-region / multi-currency** expansion (IN → ME → SEA).
- **Automated product ingestion** via Amazon PA-API, Flipkart Affiliate API, Meesho feeds, plus scheduled price refreshes.

---

## 9. Technical Foundation (proposed)

- TanStack Start + React + Tailwind (this stack).
- Lovable Cloud for database (products, categories, tags, lookbooks, subscribers, clicks) and auth (later, for wishlists).
- Server routes for scheduled affiliate feed sync + click-tracking redirects (`/go/:productId` → logs click → 302 to affiliate URL).
- Image CDN for fast, responsive product imagery.

---

## 10. Suggested Build Order

1. Design system + Home + one category + product detail (visual foundation).
2. Remaining 7 categories, Trending, Deals, New Arrivals.
3. Lookbooks, Brands, Blog shell.
4. Lovable Cloud schema + admin flow to add/curate products.
5. Click tracking, newsletter, SEO polish (sitemap, schema, OG images).
6. Growth features from section 8, prioritized by traffic data.

---

Reply with **"Go"** to start building step 1 (design system + Home + a sample category + product detail), or tell me which piece you want first.
