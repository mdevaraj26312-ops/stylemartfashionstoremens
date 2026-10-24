import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";
import { AdminPage } from "@/components/site/AdminShell";
import { adminSourcesData, adminRunSync } from "@/lib/sync.functions";

export const Route = createFileRoute("/admin/sources")({
  head: () => ({
    meta: [
      { title: "Affiliate sources — Style Mart Admin" },
      { name: "description", content: "Affiliate partner connections, sync schedule, import counts and sync history." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminSourcesPage,
});

type Source = {
  id: string;
  slug: string;
  name: string;
  kind: string;
  is_active: boolean;
  sync_interval_minutes: number;
  last_sync_at: string | null;
  last_sync_status: string;
  last_sync_error: string | null;
};

type Run = {
  id: string;
  source_slug: string;
  status: string;
  started_at: string;
  imported: number;
  updated: number;
  hidden: number;
  error: string | null;
};

type SourcesData = {
  amazonConfigured: boolean;
  sources: Source[];
  runs: Run[];
  counts: Record<string, number>;
  clicks: Record<string, number>;
};

const fmt = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "Never";

function Pill({ tone, children }: { tone: "ok" | "warn" | "off"; children: React.ReactNode }) {
  const cls =
    tone === "ok"
      ? "text-accent"
      : tone === "warn"
        ? "text-foreground"
        : "text-muted-foreground";
  return (
    <span className={`text-[10px] tracking-[0.16em] uppercase border border-border rounded-full px-3 py-1 ${cls}`}>
      {children}
    </span>
  );
}

function SourceCard({
  s,
  count,
  clickCount,
  onSync,
  syncing,
}: {
  s: Source;
  count: number;
  clickCount: number;
  onSync?: () => void;
  syncing?: boolean;
}) {
  const external = s.kind === "external";
  const status = external
    ? { label: s.is_active ? "Connected" : "Authorization required", tone: (s.is_active ? "ok" : "off") as "ok" | "off" }
    : s.last_sync_status === "needs_setup"
      ? { label: "Needs setup", tone: "warn" as const }
      : s.last_sync_status === "error"
        ? { label: "Error", tone: "warn" as const }
        : s.last_sync_status === "ok"
          ? { label: "Connected", tone: "ok" as const }
          : { label: "Not synced yet", tone: "off" as const };

  return (
    <div className="rounded-lg border border-border bg-card p-5 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl">{s.name}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Automatic sync every {s.sync_interval_minutes} minutes
          </p>
        </div>
        <Pill tone={status.tone}>{status.label}</Pill>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <div>
          <div className="font-display text-2xl">{count}</div>
          <div className="mt-1 text-[11px] tracking-[0.18em] uppercase text-muted-foreground">Products</div>
        </div>
        <div>
          <div className="font-display text-2xl">{clickCount}</div>
          <div className="mt-1 text-[11px] tracking-[0.18em] uppercase text-muted-foreground">Clicks to partner</div>
        </div>
        <div>
          <div className="font-display text-2xl">{fmt(s.last_sync_at)}</div>
          <div className="mt-1 text-[11px] tracking-[0.18em] uppercase text-muted-foreground">Last sync</div>
        </div>
      </div>

      {s.last_sync_error && (
        <p className="mt-4 rounded-md border border-border bg-background px-4 py-3 text-sm text-muted-foreground">
          {s.last_sync_error}
        </p>
      )}

      {!external && s.slug === "amazon-paapi" && (
        <p className="mt-4 text-sm text-muted-foreground">
          To connect Amazon India, the Product Advertising API credentials (Access Key, Secret Key,
          Partner Tag) from your Amazon Associates account are stored as project secrets. Existing
          products and affiliate links are never modified by the sync.
        </p>
      )}

      {external && !s.is_active && (
        <p className="mt-4 text-sm text-muted-foreground">
          {s.name} requires an approved affiliate/partner account with API or product-feed access.
          The store never scrapes retailer websites or invents links — once an authorized feed is
          provided, this source can be connected and synced automatically.
        </p>
      )}

      {!external && onSync && (
        <button
          onClick={onSync}
          disabled={syncing}
          className="mt-5 inline-flex items-center gap-2 h-10 px-4 rounded-full border border-border text-xs tracking-[0.16em] uppercase hover:border-foreground disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${syncing ? "animate-spin" : ""}`} />
          {syncing ? "Syncing…" : "Sync now"}
        </button>
      )}
    </div>
  );
}

function AdminSourcesPage() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["admin-sources"], queryFn: () => adminSourcesData() });
  const sync = useMutation({
    mutationFn: (source?: string) => adminRunSync({ data: { source } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-sources"] }),
  });

  const d = q.data;
  const countFor = (s: Source) => {
    if (s.slug === "amazon-paapi") return d?.counts["Amazon"] ?? 0;
    if (s.slug === "myntra") return d?.counts["Myntra"] ?? 0;
    if (s.slug === "ajio") return d?.counts["Ajio"] ?? 0;
    return d?.counts[s.slug] ?? 0;
  };

  const lastResult = sync.data?.results?.[0];

  return (
    <AdminPage
      title="Affiliate sources"
      desc="Partner connections, automatic syncing, import counts and sync history."
    >
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          The scheduler runs an automatic sync for every connected source. Last successful sync:{" "}
          <b className="text-foreground">
            {fmt(
              (d?.runs ?? []).find((r) => r.status === "ok")?.started_at ?? null,
            )}
          </b>
          .
        </p>
        <button
          onClick={() => sync.mutate(undefined)}
          disabled={sync.isPending}
          className="inline-flex items-center gap-2 h-10 px-4 rounded-full border border-border text-xs tracking-[0.16em] uppercase hover:border-foreground disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${sync.isPending ? "animate-spin" : ""}`} />
          {sync.isPending ? "Syncing…" : "Sync all sources"}
        </button>
      </div>

      {lastResult && (
        <p className="mt-4 rounded-md border border-border bg-card px-4 py-3 text-sm">
          Last run: <b>{lastResult.slug}</b> — {lastResult.imported} imported, {lastResult.updated}{" "}
          updated, {lastResult.hidden} marked unavailable.
          {lastResult.status === "needs_setup" && " Waiting for partner credentials."}
          {lastResult.errors.length > 0 && (
            <span className="block mt-1 text-muted-foreground">{lastResult.errors[0]}</span>
          )}
        </p>
      )}

      <div className="mt-6 grid gap-4">
        {(d?.sources ?? []).map((s) => (
          <SourceCard
            key={s.id}
            s={s}
            count={countFor(s)}
            clickCount={d?.clicks[slugToStoreName(s.slug)] ?? 0}
            onSync={s.kind === "paapi" ? () => sync.mutate(s.slug) : undefined}
            syncing={sync.isPending}
          />
        ))}
        {q.isLoading && <p className="text-sm text-muted-foreground">Loading sources…</p>}
      </div>

      <div className="mt-6 rounded-lg border border-border bg-card p-5 sm:p-7">
        <h2 className="font-display text-2xl">Sync history</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The most recent automatic and manual sync runs, including errors.
        </p>
        <ul className="mt-4 grid gap-2">
          {(d?.runs ?? []).map((r) => (
            <li
              key={r.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-border px-4 py-3 text-sm"
            >
              <span>
                {fmt(r.started_at)} · <b>{r.source_slug}</b>
              </span>
              <span className="text-muted-foreground">
                {r.status} · {r.imported} new · {r.updated} updated · {r.hidden} unavailable
              </span>
              {r.error && (
                <span className="w-full text-xs text-muted-foreground">{r.error}</span>
              )}
            </li>
          ))}
          {(d?.runs ?? []).length === 0 && (
            <li className="text-sm text-muted-foreground">No sync runs yet.</li>
          )}
        </ul>
      </div>

      <div className="mt-6 rounded-lg border border-border bg-card p-5 sm:p-7">
        <h2 className="font-display text-2xl">Earnings & disclosure</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Click counts above show how often shoppers tap through to a partner. Sales and
          commissions are never claimed unless confirmed by the partner's own reporting. Customers
          see the public{" "}
          <a href="/affiliate-disclosure" className="underline hover:text-accent">
            affiliate disclosure
          </a>
          ; partner names and credentials are never shown on the storefront.
        </p>
      </div>
    </AdminPage>
  );
}

function slugToStoreName(slug: string): string {
  if (slug === "amazon-paapi") return "Amazon";
  if (slug === "myntra") return "Myntra";
  if (slug === "ajio") return "Ajio";
  return slug;
}
