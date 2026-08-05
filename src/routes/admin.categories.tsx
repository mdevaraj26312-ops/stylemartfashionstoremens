import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { AdminPage } from "@/components/site/AdminShell";
import { CATEGORIES } from "@/lib/catalog";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/categories")({
  head: () => ({
    meta: [
      { title: "Categories — Style Mart Admin" },
      { name: "description", content: "Manage Style Mart categories and subcategories." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminCategoriesPage,
});

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);

function AdminCategoriesPage() {
  const qc = useQueryClient();
  const [category, setCategory] = useState<string>("men");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const listQ = useQuery({
    queryKey: ["admin-subcategories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subcategories")
        .select("id, category, slug, name")
        .order("category")
        .order("name");
      if (error) throw error;
      return data ?? [];
    },
  });

  const add = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("subcategories")
        .insert({ category: category as never, name: name.trim(), slug: slugify(name) });
      if (error) throw error;
    },
    onSuccess: () => {
      setName("");
      setError(null);
      qc.invalidateQueries({ queryKey: ["admin-subcategories"] });
    },
    onError: (e) => setError((e as Error).message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("subcategories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-subcategories"] }),
  });

  return (
    <AdminPage
      title="Categories"
      desc="The eight storefront categories are fixed. Add subcategories to organise products inside each one."
    >
      <div className="mt-8 rounded-lg border border-border bg-card p-5 sm:p-7">
        <h2 className="font-display text-2xl">Add a subcategory</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-[200px_1fr_auto]">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-11 rounded-md border border-border bg-background px-3 text-sm"
          >
            {CATEGORIES.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Kurtas, Sneakers, Tote bags"
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

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CATEGORIES.map((c) => {
          const subs = (listQ.data ?? []).filter((s) => s.category === c.slug);
          return (
            <div key={c.slug} className="rounded-lg border border-border bg-card p-5">
              <h3 className="font-display text-xl">{c.name}</h3>
              <p className="mt-1 text-[11px] tracking-[0.16em] uppercase text-muted-foreground">
                {subs.length} subcategories
              </p>
              <ul className="mt-3 grid gap-1.5">
                {subs.map((s) => (
                  <li key={s.id} className="flex items-center justify-between gap-2 text-sm">
                    <span className="truncate">{s.name}</span>
                    <button
                      onClick={() => del.mutate(s.id)}
                      aria-label={`Delete ${s.name}`}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ))}
                {subs.length === 0 && (
                  <li className="text-sm text-muted-foreground">None yet.</li>
                )}
              </ul>
            </div>
          );
        })}
      </div>
    </AdminPage>
  );
}
