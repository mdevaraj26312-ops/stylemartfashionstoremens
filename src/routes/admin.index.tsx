import { createFileRoute, Link } from "@tanstack/react-router";
import { Package, Upload, LinkIcon, Layers, Tag, Settings, RefreshCw } from "lucide-react";
import { AdminPage } from "@/components/site/AdminShell";

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

type TargetPath =
  | "/admin/products"
  | "/admin/categories"
  | "/admin/brands"
  | "/admin/sources"
  | "/admin/settings";

const MODULES: { to: TargetPath; icon: React.ReactNode; title: string; desc: string }[] = [
  {
    to: "/admin/products",
    icon: <Package className="h-5 w-5" />,
    title: "Products",
    desc: "Add, edit or delete products in your catalog.",
  },
  {
    to: "/admin/products",
    icon: <Upload className="h-5 w-5" />,
    title: "CSV import",
    desc: "Import thousands of products from a spreadsheet.",
  },
  {
    to: "/admin/products",
    icon: <LinkIcon className="h-5 w-5" />,
    title: "Affiliate importer",
    desc: "Pull real titles, prices and images from your partner links.",
  },
  {
    to: "/admin/categories",
    icon: <Layers className="h-5 w-5" />,
    title: "Categories",
    desc: "Organise the catalog with subcategories.",
  },
  {
    to: "/admin/brands",
    icon: <Tag className="h-5 w-5" />,
    title: "Brands",
    desc: "Curate the fashion houses shown on the storefront.",
  },
  {
    to: "/admin/sources",
    icon: <RefreshCw className="h-5 w-5" />,
    title: "Affiliate sources",
    desc: "Partner connections, automatic syncing and import stats.",
  },
  {
    to: "/admin/settings",
    icon: <Settings className="h-5 w-5" />,
    title: "Settings",
    desc: "Account, store stats and private partner config.",
  },
];

function AdminDashboardPage() {
  return (
    <AdminPage
      title="Dashboard"
      desc="Manage products, imports, categories and brands for Style Mart."
    >
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MODULES.map((m) => (
          <Link
            key={m.title}
            to={m.to}
            className="group rounded-2xl border border-border bg-card p-6 hover:border-foreground hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className="grid h-10 w-10 place-items-center rounded-full bg-muted group-hover:bg-accent group-hover:text-accent-foreground transition">
              {m.icon}
            </div>
            <h2 className="mt-4 font-display text-xl">{m.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{m.desc}</p>
          </Link>
        ))}
      </div>
    </AdminPage>
  );
}
