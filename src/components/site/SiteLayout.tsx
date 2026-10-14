import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { BottomNav } from "./BottomNav";
import type { ReactNode } from "react";

export function SiteLayout({ children, modern = false }: { children: ReactNode; modern?: boolean }) {
  return (
    <div className={`${modern ? "modern-home " : ""}min-h-screen bg-background text-foreground flex flex-col`}>
      <SiteHeader modern={modern} />
      <main className="flex-1">{children}</main>
      <SiteFooter modern={modern} />
      <div className="h-16 md:hidden" aria-hidden />
      <BottomNav modern={modern} />
    </div>
  );
}
