import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Admin Sign In — Style Mart" },
      { name: "description", content: "Sign in to manage the Style Mart product catalog." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [needsConfirm, setNeedsConfirm] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    // Handle verification callback (Supabase appends #access_token=... on success)
    if (typeof window !== "undefined") {
      const hash = window.location.hash;
      if (hash.includes("access_token") || hash.includes("type=signup")) {
        setInfo("Email verified successfully. You are now signed in.");
        // Clean hash
        history.replaceState(null, "", window.location.pathname);
      } else if (hash.includes("error")) {
        const params = new URLSearchParams(hash.slice(1));
        setError(params.get("error_description") || "Verification failed. Please try again.");
        history.replaceState(null, "", window.location.pathname);
      }
    }

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin/products", replace: true });
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setNeedsConfirm(false);
    setLoading(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          if (/confirm/i.test(error.message)) {
            setNeedsConfirm(true);
            throw new Error("Email not confirmed. Resend the verification email below, then try again.");
          }
          throw error;
        }
        navigate({ to: "/admin/products", replace: true });
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/auth` },
        });
        if (error) throw error;
        if (data.session) {
          navigate({ to: "/admin/products", replace: true });
        } else {
          setInfo("Account created. Check your inbox to verify your email, then sign in.");
          setMode("signin");
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async () => {
    if (!email) {
      setError("Enter your email above first.");
      return;
    }
    setResending(true);
    setError(null);
    setInfo(null);
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
        options: { emailRedirectTo: `${window.location.origin}/auth` },
      });
      if (error) throw error;
      setInfo(`Verification email resent to ${email}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not resend email.");
    } finally {
      setResending(false);
    }
  };

  return (
    <SiteLayout>
      <section className="mx-auto max-w-md px-4 sm:px-6 py-16 sm:py-24">
        <p className="eyebrow">Admin access</p>
        <h1 className="mt-2 font-display text-4xl">
          {mode === "signin" ? "Sign in" : "Create admin"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {mode === "signin"
            ? "Sign in to manage the Style Mart catalog."
            : "Register the first admin account. Later sign-ups will be regular users."}
        </p>

        <form onSubmit={submit} className="mt-8 grid gap-4">
          <label className="grid gap-1.5">
            <span className="text-[11px] tracking-[0.18em] uppercase text-muted-foreground">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:border-accent"
            />
          </label>
          <label className="grid gap-1.5">
            <span className="text-[11px] tracking-[0.18em] uppercase text-muted-foreground">Password</span>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:border-accent"
            />
          </label>
          {error && <p className="text-sm text-destructive">{error}</p>}
          {info && <p className="text-sm text-emerald-700">{info}</p>}
          <button
            type="submit"
            disabled={loading}
            className="h-11 rounded-full bg-primary text-primary-foreground text-xs tracking-[0.18em] uppercase hover:bg-accent transition disabled:opacity-50"
          >
            {loading ? "Working…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        {(needsConfirm || mode === "signin") && (
          <button
            onClick={resendVerification}
            disabled={resending}
            className="mt-3 text-sm underline text-muted-foreground hover:text-foreground disabled:opacity-50"
          >
            {resending ? "Sending…" : "Resend verification email"}
          </button>
        )}

        <div className="mt-4">
          <button
            onClick={() => {
              setMode(mode === "signin" ? "signup" : "signin");
              setError(null);
              setInfo(null);
              setNeedsConfirm(false);
            }}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            {mode === "signin" ? "Need to create the first admin? Sign up" : "Already registered? Sign in"}
          </button>
        </div>

        <p className="mt-8 text-xs text-muted-foreground">
          <Link to="/" className="underline">← Back to store</Link>
        </p>
      </section>
    </SiteLayout>
  );
}
