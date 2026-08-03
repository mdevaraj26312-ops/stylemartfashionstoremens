import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/affiliate-disclosure")({
  head: () => ({
    meta: [
      { title: "Affiliate Disclosure — Style Mart" },
      {
        name: "description",
        content:
          "How Style Mart makes money: our affiliate relationships with leading fashion retailers.",
      },
      { property: "og:title", content: "Affiliate Disclosure — Style Mart" },
    ],
    links: [{ rel: "canonical", href: "/affiliate-disclosure" }],
  }),
  component: DisclosurePage,
});

function DisclosurePage() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-16 sm:py-24">
        <p className="eyebrow">Transparency</p>
        <h1 className="mt-3 font-display text-4xl sm:text-6xl leading-[1.05]">
          Affiliate <em className="italic text-accent">disclosure</em>.
        </h1>

        <div className="mt-10 space-y-6 text-base text-foreground/85 leading-relaxed">
          <p>
            Style Mart is an independent fashion discovery platform. We are a participant in
            affiliate programs run by leading fashion retailers and other partner
            retailers. When you click a "Buy Now" button on our site and make a purchase, we may
            earn a small commission — at no extra cost to you.
          </p>
          <p>
            The commission we earn helps us keep Style Mart free to use and lets our editors keep
            hunting for the best pieces across the web. It does not influence the products we
            feature. We only recommend pieces we would genuinely wear ourselves.
          </p>
          <p>
            Prices, stock, sizes and shipping are controlled entirely by the partner store you buy
            from. We do our best to keep prices in sync but final pricing shown at checkout on the
            partner store is the correct one. Any returns, refunds or delivery questions must be
            raised with that store directly.
          </p>
          <p>
            Have a question or concern about a listing?{" "}
            <Link to="/contact" className="underline hover:text-accent">
              Get in touch
            </Link>
            .
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}
