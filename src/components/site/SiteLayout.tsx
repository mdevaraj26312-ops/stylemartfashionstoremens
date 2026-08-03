import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { BottomNav } from "./BottomNav";
import type { ReactNode } from "react";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <div className="h-16 md:hidden" aria-hidden />
      <BottomNav />
    </div>
  );
}
