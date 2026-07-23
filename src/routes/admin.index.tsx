import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Package, Upload, LogOut, LinkIcon } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { getMyAdminStatus } from "@/lib/products.functions";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Style Mart" },
      { name: "description", content: "Style Mart admin dashboard." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminDashboardPage,
});

function AdminDashboardPage() {
  const navigate = useNavigate();
  const [session, setSession] = useState<"loading" | "signed-out" | "signed-in">("loading");

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s ? "signed-in" : "signed-out");
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ? "signed-in" : "signed-out");
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session === "signed-out") navigate({ to: "/auth", replace: true });
  }, [session, navigate]);

  const statusQ = useQuery({
    queryKey: ["admin-status"],
    queryFn: () => getMyAdminStatus(),
    enabled: session === "signed-in",
  });

  if (session === "loading" || (session === "signed-in" && statusQ.isLoading)) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-3xl px-6 py-24 text-center text-sm text-muted-foreground">
          Loading…
        </div>
      </SiteLayout>
    );
  }

  if (session === "signed-in" && statusQ.data && !statusQ.data.isAdmin) {
    return (
      <SiteLayout>
        <section className="mx-auto max-w-md px-6 py-24 text-center">
          <p className="eyebrow">Restricted</p>
          <h1 className="mt-2 font-display text-3xl">Not authorized</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This area is reserved for the site administrator.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex h-11 px-6 items-center rounded-full bg-primary text-primary-foreground text-xs tracking-[0.18em] uppercase hover:bg-accent transition"
          >
            Back to store
          </Link>
        </section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Admin</p>
            <h1 className="mt-2 font-display text-4xl sm:text-5xl">Dashboard</h1>
            <p className="mt-2 text-sm text-muted-foreground max-w-xl">
              Manage products, affiliate links, and imports for Style Mart.
            </p>
          </div>
          <button
            onClick={() => supabase.auth.signOut()}
            className="inline-flex items-center gap-2 h-10 px-4 rounded-full border border-border text-xs tracking-[0.16em] uppercase hover:border-foreground"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </button>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AdminCard
            to="/admin/products"
            icon={<Package className="h-5 w-5" />}
            title="Products"
            desc="Add, edit, or delete products in your catalog."
          />
          <AdminCard
            to="/admin/products"
            icon={<Upload className="h-5 w-5" />}
            title="Bulk CSV import"
            desc="Import hundreds of products from a spreadsheet."
          />
          <AdminCard
            to="/admin/products"
            icon={<LinkIcon className="h-5 w-5" />}
            title="Affiliate links"
            desc="Manage Buy Now URLs across all products."
          />
        </div>
      </section>
    </SiteLayout>
  );
}

function AdminCard({
  to, icon, title, desc,
}: { to: "/admin/products"; icon: React.ReactNode; title: string; desc: string }) {
  return (
    <Link
      to={to}
      className="group rounded-lg border border-border bg-card p-6 hover:border-foreground transition"
    >
      <div className="grid h-10 w-10 place-items-center rounded-full bg-muted group-hover:bg-accent group-hover:text-accent-foreground transition">
        {icon}
      </div>
      <h2 className="mt-4 font-display text-xl">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
    </Link>
  );
}
