import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Star } from "lucide-react";
import { AdminPage } from "@/components/site/AdminShell";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/brands")({
  head: () => ({
    meta: [
      { title: "Brands — Style Mart Admin" },
      { name: "description", content: "Manage the brands featured on Style Mart." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminBrandsPage,
});

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);

function AdminBrandsPage() {
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const [logo, setLogo] = useState("");
  const [website, setWebsite] = useState("");
  const [error, setError] = useState<string | null>(null);

  const listQ = useQuery({
    queryKey: ["admin-brands"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("brands")
        .select("id, name, slug, logo_url, website, is_featured")
        .order("name");
      if (error) throw error;
      return data ?? [];
    },
  });

  const add = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("brands").insert({
        name: name.trim(),
        slug: slugify(name),
        logo_url: logo.trim() || null,
        website: website.trim() || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setName("");
      setLogo("");
      setWebsite("");
      setError(null);
      qc.invalidateQueries({ queryKey: ["admin-brands"] });
    },
    onError: (e) => setError((e as Error).message),
  });

  const toggleFeatured = useMutation({
    mutationFn: async ({ id, value }: { id: string; value: boolean }) => {
      const { error } = await supabase.from("brands").update({ is_featured: value }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-brands"] }),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("brands").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-brands"] }),
  });

  return (
    <AdminPage title="Brands" desc="Curate the fashion houses shown across the storefront.">
      <div className="mt-8 rounded-lg border border-border bg-card p-5 sm:p-7">
        <h2 className="font-display text-2xl">Add a brand</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_1fr_auto]">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Brand name"
            className="h-11 rounded-md border border-border bg-background px-3 text-sm"
          />
          <input
            value={logo}
            onChange={(e) => setLogo(e.target.value)}
            placeholder="Logo URL (optional)"
            className="h-11 rounded-md border border-border bg-background px-3 text-sm"
          />
          <input
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="Website (optional)"
            className="h-11 rounded-md border border-border bg-background px-3 text-sm"
          />
          <button
            onClick={() => name.trim() && add.mutate()}
            disabled={add.isPending}
            className="h-11 px-5 inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground text-xs tracking-[0.16em] uppercase hover:bg-accent transition disabled:opacity-50"
          >
            <Plus className="h-4 w-4" /> Add
          </button>
        </div>
        {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
      </div>

      <div className="mt-8 rounded-lg border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60 text-[11px] tracking-[0.16em] uppercase text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-3">Brand</th>
              <th className="text-left px-4 py-3 hidden sm:table-cell">Website</th>
              <th className="text-left px-4 py-3">Featured</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {(listQ.data ?? []).map((b) => (
              <tr key={b.id} className="border-t border-border">
                <td className="px-4 py-3">{b.name}</td>
                <td className="px-4 py-3 hidden sm:table-cell text-muted-foreground truncate max-w-[240px]">
                  {b.website ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleFeatured.mutate({ id: b.id, value: !b.is_featured })}
                    className={b.is_featured ? "text-gold" : "text-muted-foreground"}
                    aria-label="Toggle featured"
                  >
                    <Star className={`h-4 w-4 ${b.is_featured ? "fill-gold" : ""}`} />
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => del.mutate(b.id)}
                    className="text-muted-foreground hover:text-destructive"
                    aria-label={`Delete ${b.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
            {(listQ.data ?? []).length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-muted-foreground">
                  No brands yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminPage>
  );
}
