import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertAdmin(supabase: { from: (t: string) => any }, userId: string) {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error || !data) throw new Error("Forbidden");
}

/** Runs the affiliate sync on demand from the admin Sources page. */
export const adminRunSync = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ source: z.string().optional() }).parse(input ?? {}))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase as never, context.userId);
    const { runSync } = await import("./sync.server");
    return runSync(data.source);
  });

/** Everything the admin Sources page shows: status, history, counts, clicks. */
export const adminSourcesData = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase as never, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { paapiConfigured } = await import("./paapi.server");
    const [sourcesRes, runsRes, productsRes] = await Promise.all([
      supabaseAdmin.from("affiliate_sources").select("*").order("name"),
      supabaseAdmin
        .from("sync_runs")
        .select("*")
        .order("started_at", { ascending: false })
        .limit(15),
      supabaseAdmin.from("products").select("source, click_count").limit(10000),
    ]);
    if (sourcesRes.error) throw new Error(sourcesRes.error.message);
    if (runsRes.error) throw new Error(runsRes.error.message);
    if (productsRes.error) throw new Error(productsRes.error.message);
    const counts = new Map<string, number>();
    const clicks = new Map<string, number>();
    for (const p of productsRes.data ?? []) {
      counts.set(p.source, (counts.get(p.source) ?? 0) + 1);
      clicks.set(p.source, (clicks.get(p.source) ?? 0) + Number(p.click_count ?? 0));
    }
    return {
      amazonConfigured: paapiConfigured(),
      sources: sourcesRes.data ?? [],
      runs: runsRes.data ?? [],
      counts: Object.fromEntries(counts) as Record<string, number>,
      clicks: Object.fromEntries(clicks) as Record<string, number>,
    };
  });
