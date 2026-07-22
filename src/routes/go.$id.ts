import { createFileRoute } from "@tanstack/react-router";
import { createHash } from "crypto";

// Affiliate click-through redirect: /go/<product-uuid-or-slug>
// - Looks up the product's affiliate URL.
// - Increments click_count via SECURITY DEFINER RPC.
// - Logs an anonymized click row for analytics.
// - 302 redirects to the destination.
export const Route = createFileRoute("/go/$id")({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const key = params.id;
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(key);

        const q = supabaseAdmin
          .from("products")
          .select("id, affiliate_url, status")
          .limit(1);
        const { data, error } = isUuid ? await q.eq("id", key) : await q.eq("slug", key);

        if (error || !data || data.length === 0) {
          return new Response("Product not found", { status: 404 });
        }
        const product = data[0];
        if (product.status === "archived" || !product.affiliate_url) {
          return new Response("Link unavailable", { status: 410 });
        }

        // Fire-and-forget analytics: don't block the redirect on failures.
        const referrer = request.headers.get("referer");
        const userAgent = request.headers.get("user-agent");
        const ip =
          request.headers.get("cf-connecting-ip") ||
          request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
          "";
        const ipHash = ip
          ? createHash("sha256").update(`${ip}:style-mart`).digest("hex").slice(0, 32)
          : null;

        void supabaseAdmin.rpc("increment_product_click", { _product_id: product.id });
        void supabaseAdmin.from("product_clicks").insert({
          product_id: product.id,
          referrer,
          user_agent: userAgent,
          ip_hash: ipHash,
        });

        return new Response(null, {
          status: 302,
          headers: {
            Location: product.affiliate_url,
            "Cache-Control": "no-store, no-cache, must-revalidate",
            "Referrer-Policy": "no-referrer-when-downgrade",
          },
        });
      },
    },
  },
});
