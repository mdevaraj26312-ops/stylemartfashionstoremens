import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, MessageCircle, Instagram, MapPin } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Style Mart" },
      {
        name: "description",
        content:
          "Get in touch with Style Mart — brand partnerships, product suggestions, or feedback.",
      },
      { property: "og:title", content: "Contact — Style Mart" },
      { property: "og:description", content: "We'd love to hear from you." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <SiteLayout>
      <section className="mx-auto max-w-5xl px-4 sm:px-6 py-16 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <p className="eyebrow">Say hello</p>
            <h1 className="mt-3 font-display text-4xl sm:text-6xl leading-[1.05]">
              We'd love to <em className="italic text-accent">hear</em> from you.
            </h1>
            <p className="mt-5 text-muted-foreground max-w-md leading-relaxed">
              Brand collaborations, product suggestions, or just a hello — drop us a line and
              we'll get back within two working days.
            </p>

            <ul className="mt-10 grid gap-5 text-sm">
              <ContactRow icon={Mail} label="hello@stylemart.in" />
              <ContactRow icon={MessageCircle} label="+91 90000 12345 (WhatsApp)" />
              <ContactRow icon={Instagram} label="@stylemart.in" />
              <ContactRow icon={MapPin} label="Bangalore · Mumbai · Remote" />
            </ul>
          </div>

          <div className="rounded-lg border border-border bg-card p-6 sm:p-8">
            {sent ? (
              <div className="min-h-[360px] flex flex-col items-center justify-center text-center">
                <p className="eyebrow">Message sent</p>
                <h2 className="mt-2 font-display text-2xl">Thanks — we'll be in touch.</h2>
                <button
                  onClick={() => setSent(false)}
                  className="mt-6 text-sm underline underline-offset-4"
                >
                  Send another
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
                className="grid gap-4"
              >
                <Field label="Your name">
                  <input required className="input" placeholder="Ada Lovelace" />
                </Field>
                <Field label="Email">
                  <input required type="email" className="input" placeholder="you@email.com" />
                </Field>
                <Field label="Subject">
                  <select className="input">
                    <option>General enquiry</option>
                    <option>Brand partnership</option>
                    <option>Product suggestion</option>
                    <option>Press</option>
                  </select>
                </Field>
                <Field label="Message">
                  <textarea rows={5} required className="input resize-none" placeholder="Tell us what's on your mind…" />
                </Field>
                <button
                  type="submit"
                  className="mt-2 inline-flex items-center justify-center h-12 rounded-full bg-primary text-primary-foreground text-sm tracking-[0.15em] uppercase hover:bg-accent transition"
                >
                  Send message
                </button>
                <style>{`.input{width:100%;background:transparent;border:1px solid var(--color-border);border-radius:9999px;padding:0 1rem;height:2.75rem;font-size:.875rem;outline:none;transition:border-color .15s}textarea.input{border-radius:1rem;padding:.75rem 1rem;height:auto}.input:focus{border-color:var(--color-accent);box-shadow:0 0 0 3px color-mix(in oklab, var(--color-accent) 20%, transparent)}`}</style>
              </form>
            )}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function ContactRow({ icon: Icon, label }: { icon: typeof Mail; label: string }) {
  return (
    <li className="flex items-center gap-3">
      <span className="grid h-10 w-10 place-items-center rounded-full bg-secondary">
        <Icon className="h-4 w-4" />
      </span>
      <span>{label}</span>
    </li>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
