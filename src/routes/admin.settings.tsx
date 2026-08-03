import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AdminPage } from "@/components/site/AdminShell";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Style Mart Admin" },
      { name: "description", content: "Style Mart store settings and account details." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminSettingsPage,
});

function AdminSettingsPage() {
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? ""));
  }, []);

  const statsQ = useQuery({
    queryKey: ["admin-settings-stats"],
    queryFn: async () => {
      const [products, brands, subs, networks] = await Promise.all([
        supabase.from("products").select("id", { count: "exact", head: true }),
        supabase.from("brands").select("id", { count: "exact", head: true }),
        supabase.from("subcategories").select("id", { count: "exact", head: true }),
        supabase.from("affiliate_networks").select("id, name, is_active").order("name"),
      ]);
      return {
        products: products.count ?? 0,
        brands: brands.count ?? 0,
        subcategories: subs.count ?? 0,
        networks: networks.data ?? [],
      };
    },
  });

  return (
    <AdminPage title="Settings" desc="Account, storefront and private partner configuration.">
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Stat label="Products" value={statsQ.data?.products ?? "—"} />
        <Stat label="Brands" value={statsQ.data?.brands ?? "—"} />
        <Stat label="Subcategories" value={statsQ.data?.subcategories ?? "—"} />
      </div>

      <div className="mt-8 rounded-lg border border-border bg-card p-5 sm:p-7">
        <h2 className="font-display text-2xl">Administrator</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Signed in as <b className="text-foreground">{email || "…"}</b>. This is the only account
          with access to the admin area — new sign-ups are always regular visitors.
        </p>
      </div>

      <div className="mt-6 rounded-lg border border-border bg-card p-5 sm:p-7">
        <h2 className="font-display text-2xl">Partner networks (private)</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Partner names, tracking parameters and referral IDs are stored in the backend only and are
          never shown anywhere on the public storefront.
        </p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {(statsQ.data?.networks ?? []).map((n) => (
            <li
              key={n.id}
              className="flex items-center justify-between rounded-md border border-border px-4 py-3 text-sm"
            >
              <span>{n.name}</span>
              <span
                className={`text-[10px] tracking-[0.16em] uppercase ${
                  n.is_active ? "text-accent" : "text-muted-foreground"
                }`}
              >
                {n.is_active ? "Active" : "Off"}
              </span>
            </li>
          ))}
          {(statsQ.data?.networks ?? []).length === 0 && (
            <li className="text-sm text-muted-foreground">No partner networks configured.</li>
          )}
        </ul>
      </div>

      <div className="mt-6 rounded-lg border border-border bg-card p-5 sm:p-7">
        <h2 className="font-display text-2xl">Storefront</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage the catalog from the{" "}
          <Link to="/admin/products" className="underline hover:text-accent">
            Product manager
          </Link>
          , where you can add products, run the CSV importer and the affiliate importer.
        </p>
      </div>
    </AdminPage>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="font-display text-3xl">{value}</div>
      <div className="mt-1 text-[11px] tracking-[0.18em] uppercase text-muted-foreground">
        {label}
      </div>
    </div>
  );
}
