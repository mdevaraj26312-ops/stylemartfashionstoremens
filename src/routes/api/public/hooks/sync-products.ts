import { createFileRoute } from "@tanstack/react-router";

// Scheduled affiliate sync endpoint. Called hourly by the store's scheduler.
// Requires a bearer token (the project's publishable key — it only filters
// stray traffic; every run is idempotent because products upsert by slug and
// the run never deletes data).
//
// Never reports success when zero products were saved: if nothing was saved
// the run returns HTTP 503 with fetched/saved/skipped/failed counts so a
// scheduler can't mistake an empty or misconfigured run for success.
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
          const saved = report.summary.saved;
          if (saved > 0) {
            return new Response(JSON.stringify(report), {
              headers: { "Content-Type": "application/json" },
            });
          }
          const detail = report.summary.failed
            ? `${report.summary.failed} source${report.summary.failed === 1 ? "" : "s"} failed or needs setup (0 products fetched)`
            : report.ran.length
              ? "the source returned no products"
              : "no active affiliate source is connected";
          return new Response(
            JSON.stringify({
              ...report,
              warning: `No products were saved: ${detail}.`,
            }),
            { status: 503, headers: { "Content-Type": "application/json" } },
          );
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
