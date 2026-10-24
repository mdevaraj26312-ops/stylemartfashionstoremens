// Amazon Product Advertising API 5.0 client — India marketplace.
// Server-side only: credentials come from project secrets, never from code.
import { createHash, createHmac } from "node:crypto";

const HOST = "webservices.amazon.in";
// PA-API India signs requests with the eu-west-1 credential scope.
const REGION = "eu-west-1";
const SERVICE = "ProductAdvertisingAPI";
const TARGET = "com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems";

export type PaapiItem = {
  asin: string;
  title: string;
  brand: string | null;
  url: string;
  image: string | null;
  price: number | null;
  originalPrice: number | null;
  inStock: boolean | null;
  features: string[];
};

export function paapiConfigured(): boolean {
  return Boolean(
    process.env.AMAZON_PAAPI_ACCESS_KEY &&
      process.env.AMAZON_PAAPI_SECRET_KEY &&
      process.env.AMAZON_PAAPI_PARTNER_TAG,
  );
}

export function paapiSetupHint(): string {
  if (paapiConfigured()) return "";
  return "Not connected: Amazon Product Advertising API credentials are required (AMAZON_PAAPI_ACCESS_KEY, AMAZON_PAAPI_SECRET_KEY, AMAZON_PAAPI_PARTNER_TAG from your Amazon Associates account). Until then the automatic Amazon import stays paused; existing products and links are untouched.";
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function sign(payload: string, amzDate: string): string {
  const accessKey = process.env.AMAZON_PAAPI_ACCESS_KEY!;
  const secretKey = process.env.AMAZON_PAAPI_SECRET_KEY!;
  const dateStamp = amzDate.slice(0, 8);
  const canonicalHeaders =
    `content-encoding:amz-1.0\ncontent-type:application/json\nhost:${HOST}\n` +
    `x-amz-date:${amzDate}\nx-amz-target:${TARGET}\n`;
  const signedHeaders = "content-encoding;content-type;host;x-amz-date;x-amz-target";
  const payloadHash = createHash("sha256").update(payload).digest("hex");
  const canonicalRequest = `POST\n/paapi5/searchitems\n\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;
  const scope = `${dateStamp}/${REGION}/${SERVICE}/aws4_request`;
  const stringToSign =
    `AWS4-HMAC-SHA256\n${amzDate}\n${scope}\n` +
    `${createHash("sha256").update(canonicalRequest).digest("hex")}`;
  let key = createHmac("sha256", `AWS4${secretKey}`).update(dateStamp).digest();
  key = createHmac("sha256", key).update(REGION).digest();
  key = createHmac("sha256", key).update(SERVICE).digest();
  key = createHmac("sha256", key).update("aws4_request").digest();
  const signature = createHmac("sha256", key).update(stringToSign).digest("hex");
  return `AWS4-HMAC-SHA256 Credential=${accessKey}/${scope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
}

/** Amazon India sometimes reports amounts in paise; guard against absurd values. */
function normalizeInr(amount: number): number {
  return amount >= 1_000_000 ? amount / 100 : amount;
}

async function searchItems(keywords: string, searchIndex: string): Promise<PaapiItem[]> {
  const payload = JSON.stringify({
    Keywords: keywords,
    SearchIndex: searchIndex,
    ItemCount: 10,
    PartnerTag: process.env.AMAZON_PAAPI_PARTNER_TAG!,
    PartnerType: "Associates",
    Marketplace: "www.amazon.in",
    Resources: [
      "ItemInfo.Title",
      "ItemInfo.ByLineInfo",
      "ItemInfo.Features",
      "Images.Primary.Large",
      "DetailPageURL",
      "Offers.Listings.Price",
      "Offers.Listings.SavingBasis",
      "Offers.Listings.Availability.Type",
      "Offers.Summaries.LowestPrice",
    ],
  });
  const amzDate = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const res = await fetch(`https://${HOST}/paapi5/searchitems`, {
    method: "POST",
    headers: {
      "content-encoding": "amz-1.0",
      "content-type": "application/json",
      "x-amz-date": amzDate,
      "x-amz-target": TARGET,
      Authorization: sign(payload, amzDate),
    },
    body: payload,
  });
  const text = await res.text();
  if (!res.ok) {
    let msg = text.slice(0, 200);
    try {
      const j = JSON.parse(text) as { Message?: string; message?: string; __type?: string };
      msg = String(j.Message ?? j.message ?? j.__type ?? msg).slice(0, 200);
    } catch {
      /* keep raw text */
    }
    throw new Error(`Amazon API [${res.status}] for "${keywords}": ${msg}`);
  }
  type Listing = {
    Price?: { Amount?: number };
    SavingBasis?: { Amount?: number };
    Availability?: { Type?: string };
  };
  type Item = {
    ASIN: string;
    DetailPageURL?: string;
    ItemInfo?: {
      Title?: { DisplayValue?: string };
      ByLineInfo?: { Brand?: string };
      Features?: { DisplayValues?: string[] };
    };
    Images?: { Primary?: { Large?: { URL?: string } } };
    Offers?: { Listings?: Listing[]; Summaries?: { LowestPrice?: { Amount?: number } }[] };
  };
  const data = JSON.parse(text) as { SearchResult?: { Items?: Item[] } };
  const out: PaapiItem[] = [];
  for (const it of data.SearchResult?.Items ?? []) {
    const listing = it.Offers?.Listings?.[0];
    const rawPrice = listing?.Price?.Amount ?? it.Offers?.Summaries?.[0]?.LowestPrice?.Amount ?? null;
    const rawOriginal = listing?.SavingBasis?.Amount ?? null;
    const avail = listing?.Availability?.Type ?? null;
    out.push({
      asin: it.ASIN,
      title: it.ItemInfo?.Title?.DisplayValue ?? "",
      brand: it.ItemInfo?.ByLineInfo?.Brand ?? null,
      url: it.DetailPageURL ?? "",
      image: it.Images?.Primary?.Large?.URL ?? null,
      price: rawPrice == null ? null : normalizeInr(rawPrice),
      originalPrice: rawOriginal == null ? null : normalizeInr(rawOriginal),
      inStock: avail == null ? null : avail === "Now",
      features: it.ItemInfo?.Features?.DisplayValues ?? [],
    });
  }
  return out.filter((i) => i.title && i.url);
}

/**
 * Runs the keyword searches sequentially with a delay between each — Amazon
 * throttles newer Associates accounts to roughly one request per second.
 * Returns per-search errors so one bad keyword never stops the whole run.
 */
export async function searchAll(
  plan: { keywords: string; searchIndex: string }[],
  onBatch: (items: PaapiItem[], keywords: string) => void,
  delayMs = 1100,
): Promise<string[]> {
  const errors: string[] = [];
  for (const [i, step] of plan.entries()) {
    try {
      onBatch(await searchItems(step.keywords, step.searchIndex), step.keywords);
    } catch (e) {
      errors.push((e as Error).message.slice(0, 300));
    }
    if (i < plan.length - 1) await sleep(delayMs);
  }
  return errors;
}
