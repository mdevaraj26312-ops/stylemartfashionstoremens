import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { Home, Sparkles, Crown, Gem, Watch } from "lucide-react";
import { useEffect, useState } from "react";

const ITEMS = [
  { id: "top", label: "Home", Icon: Home },
  { id: "gen-z", label: "Gen Z", Icon: Sparkles },
  { id: "classic", label: "Classic", Icon: Gem },
  { id: "vintage", label: "Vintage", Icon: Watch },
  { id: "premium", label: "Premium", Icon: Crown },
] as const;

export function BottomNav({ modern = false }: { modern?: boolean }) {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const hash = useRouterState({ select: (s) => s.location.hash });
  const navigate = useNavigate();
  const onHome = pathname === "/";

  if (pathname.startsWith("/admin") || pathname === "/auth") return null;

  const go = (e: React.MouseEvent, id: string) => {
    if (!onHome) return; // let the Link navigate home with the hash
    e.preventDefault();
    const el = id === "top" ? null : document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    else window.scrollTo({ top: 0, behavior: "smooth" });
    navigate({ to: "/", hash: id, replace: true });
  };

  return (
    <nav
      aria-label="Collections"
      className="md:hidden fixed bottom-0 inset-x-0 z-50 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="grid grid-cols-5">
        {ITEMS.map(({ id, label, Icon }) => {
          // URL fragments are not sent to SSR; apply their active state after hydration.
          const active = hydrated && onHome && (hash === id || (id === "top" && !hash));
          return (
            <li key={id}>
              <Link
                to="/"
                hash={id}
                onClick={(e) => go(e, id)}
                className={`flex flex-col items-center justify-center gap-1 h-16 text-[10px] tracking-[0.12em] uppercase transition-colors ${
                  active ? "text-accent" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className={`h-[18px] w-[18px] transition-transform ${active ? "scale-110" : ""}`} />
                {modern ? ({ top: "Home", "gen-z": "Street", classic: "Everyday", vintage: "New", premium: "Premium" }[id]) : label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
