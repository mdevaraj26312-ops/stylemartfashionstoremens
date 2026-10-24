import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { LogOut } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { getMyAdminStatus } from "@/lib/products.functions";

const TABS = [
  { to: "/admin", label: "Dashboard" },
  { to: "/admin/products", label: "Products" },
  { to: "/admin/categories", label: "Categories" },
  { to: "/admin/brands", label: "Brands" },
  { to: "/admin/sources", label: "Sources" },
  { to: "/admin/settings", label: "Settings" },
] as const;

export function AdminNav() {
  return (
    <nav className="mt-6 -mx-4 sm:mx-0 px-4 sm:px-0 flex gap-2 overflow-x-auto no-scrollbar">
      {TABS.map((t) => (
        <Link
          key={t.to}
          to={t.to}
          activeOptions={{ exact: true }}
          className="shrink-0 h-9 px-4 inline-flex items-center rounded-full border border-border text-[11px] tracking-[0.16em] uppercase text-muted-foreground hover:border-foreground hover:text-foreground transition"
          activeProps={{
            className: "bg-primary text-primary-foreground border-primary hover:text-primary-foreground",
          }}
        >
          {t.label}
        </Link>
      ))}
    </nav>
  );
}

export function AdminSignOut() {
  const navigate = useNavigate();
  return (
    <button
      onClick={async () => {
        await supabase.auth.signOut();
        navigate({ to: "/auth", replace: true });
      }}
      className="inline-flex items-center gap-2 h-10 px-4 rounded-full border border-border text-xs tracking-[0.16em] uppercase hover:border-foreground"
    >
      <LogOut className="h-3.5 w-3.5" /> Sign out
    </button>
  );
}

/** Guards an admin page: redirects signed-out visitors to the admin sign-in page. */
export function AdminGate({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [session, setSession] = useState<"loading" | "signed-out" | "signed-in">("loading");

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) =>
      setSession(s ? "signed-in" : "signed-out"),
    );
    supabase.auth.getSession().then(({ data }) =>
      setSession(data.session ? "signed-in" : "signed-out"),
    );
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

  if (session !== "signed-in" || statusQ.isLoading) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-3xl px-6 py-24 text-center text-sm text-muted-foreground">
          Loading…
        </div>
      </SiteLayout>
    );
  }

  if (statusQ.data && !statusQ.data.isAdmin) {
    return (
      <SiteLayout>
        <section className="mx-auto max-w-md px-6 py-24 text-center">
          <p className="eyebrow">Restricted</p>
          <h1 className="mt-2 font-display text-3xl">Not authorized</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This area is reserved for the site administrator.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              to="/"
              className="h-11 px-6 inline-flex items-center rounded-full bg-primary text-primary-foreground text-xs tracking-[0.18em] uppercase hover:bg-accent transition"
            >
              Back to store
            </Link>
            <AdminSignOut />
          </div>
        </section>
      </SiteLayout>
    );
  }

  return <>{children}</>;
}

export function AdminPage({
  title,
  desc,
  children,
}: {
  title: string;
  desc: string;
  children: ReactNode;
}) {
  return (
    <AdminGate>
      <SiteLayout>
        <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Admin</p>
              <h1 className="mt-2 font-display text-4xl sm:text-5xl">{title}</h1>
              <p className="mt-2 text-sm text-muted-foreground max-w-xl">{desc}</p>
            </div>
            <AdminSignOut />
          </div>
          <AdminNav />
          {children}
        </section>
      </SiteLayout>
    </AdminGate>
  );
}
