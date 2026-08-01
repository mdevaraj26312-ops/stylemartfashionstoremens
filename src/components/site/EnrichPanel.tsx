import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Sparkles, RefreshCw } from "lucide-react";
import { adminEnrichBatch, adminEnrichStats } from "@/lib/enrich.functions";

type Log = { line: string; kind: "ok" | "err" | "info" };

export function EnrichPanel({ autoRunToken }: { autoRunToken?: number }) {
  const qc = useQueryClient();
  const [running, setRunning] = useState(false);
  const [logs, setLogs] = useState<Log[]>([]);
  const [progress, setProgress] = useState({ updated: 0, failed: 0 });
  const stopRef = useRef(false);

  const statsQ = useQuery({
    queryKey: ["enrich-stats"],
    queryFn: () => adminEnrichStats(),
  });

  const run = async (retryFailed: boolean) => {
    if (running) return;
    setRunning(true);
    stopRef.current = false;
    setLogs([{ line: "Fetching real product details from your affiliate links…", kind: "info" }]);
    setProgress({ updated: 0, failed: 0 });

    let updated = 0;
    let failed = 0;
    try {
      for (let i = 0; i < 500; i += 1) {
        if (stopRef.current) break;
        const r = await adminEnrichBatch({ data: { limit: 5, retryFailed } });
        if (r.processed === 0) break;
        updated += r.updated;
        failed += r.failed;
        setProgress({ updated, failed });
        if (r.errors.length) {
          setLogs((l) => [...l, ...r.errors.map((e) => ({ line: e, kind: "err" as const }))]);
        }
        qc.invalidateQueries({ queryKey: ["admin-products"] });
        if (!r.remaining) break;
      }
      setLogs((l) => [
        ...l,
        { line: `Finished — ${updated} product${updated === 1 ? "" : "s"} updated with real data, ${failed} failed.`, kind: updated ? "ok" : "info" },
      ]);
    } catch (e) {
      setLogs((l) => [...l, { line: (e as Error).message, kind: "err" }]);
    } finally {
      setRunning(false);
      qc.invalidateQueries({ queryKey: ["enrich-stats"] });
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      qc.invalidateQueries({ queryKey: ["products"] });
    }
  };

  // Auto-run right after a CSV import completes.
  useEffect(() => {
    if (autoRunToken) void run(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRunToken]);

  const stats = statsQ.data;

  return (
    <div className="mt-10 rounded-lg border border-border bg-card p-5 sm:p-7">
      <h2 className="font-display text-2xl">Auto-fetch real product data</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Visits each product's affiliate link and pulls the real title, brand, price, original price,
        image and description into the database. Affiliate links are never changed. This runs
        automatically after every CSV import.
      </p>

      {stats && (
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm">
          <span className="text-muted-foreground">Waiting: <b className="text-foreground">{stats.pending}</b></span>
          <span className="text-muted-foreground">Enriched: <b className="text-foreground">{stats.done}</b></span>
          <span className="text-muted-foreground">Failed: <b className="text-foreground">{stats.failed}</b></span>
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          onClick={() => run(false)}
          disabled={running}
          className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-primary text-primary-foreground text-xs tracking-[0.16em] uppercase hover:bg-accent transition disabled:opacity-50"
        >
          <Sparkles className="h-4 w-4" />
          {running ? `Fetching… (${progress.updated} done)` : "Fetch real data"}
        </button>
        <button
          onClick={() => run(true)}
          disabled={running}
          className="inline-flex items-center gap-2 h-11 px-5 rounded-full border border-border text-xs tracking-[0.16em] uppercase hover:border-foreground disabled:opacity-50"
        >
          <RefreshCw className="h-4 w-4" /> Retry failed
        </button>
        {running && (
          <button
            onClick={() => { stopRef.current = true; }}
            className="inline-flex items-center h-11 px-5 rounded-full border border-border text-xs tracking-[0.16em] uppercase hover:border-foreground"
          >
            Stop
          </button>
        )}
      </div>

      {logs.length > 0 && (
        <div className="mt-4 max-h-56 overflow-auto rounded-md border border-border bg-background p-3 text-xs space-y-1">
          {logs.map((l, i) => (
            <p key={i} className={l.kind === "err" ? "text-destructive" : "text-muted-foreground"}>
              {l.kind === "err" ? "✗ " : l.kind === "ok" ? "✓ " : ""}{l.line}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
