import { createFileRoute } from "@tanstack/react-router";

// Scheduled affiliate sync endpoint. Called hourly by the store's scheduler.
// Requires a bearer token (the project's publishable key — it only filters
// stray traffic; every run is idempotent because products upsert by slug and
// the run never deletes data).
export const Route = createFileRoute("/api/public/hooks/sync-products")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const token = (request.headers.get("authorization") ?? "")
          .replace(/^Bearer\s+/i, "")
          .trim();
        const expected = process.env.SUPABASE_PUBLISHABLE_KEY ?? "";
        if (!token || (expected && token !== expected)) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          });
        }
        const { runSync } = await import("@/lib/sync.server");
        try {
          const report = await runSync();
          return new Response(JSON.stringify(report), {
            headers: { "Content-Type": "application/json" },
          });
        } catch (e) {
          console.error("sync-products failed:", e);
          return new Response(JSON.stringify({ error: (e as Error).message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
