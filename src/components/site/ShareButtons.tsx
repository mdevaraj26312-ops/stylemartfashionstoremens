import { useEffect, useState } from "react";
import { Facebook, Twitter, Link2, Check, MessageCircle } from "lucide-react";

export function ShareButtons({ title }: { title: string }) {
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const enc = encodeURIComponent;
  const share = [
    {
      label: "WhatsApp",
      href: `https://wa.me/?text=${enc(`${title} — ${url}`)}`,
      Icon: MessageCircle,
    },
    {
      label: "Twitter",
      href: `https://twitter.com/intent/tweet?url=${enc(url)}&text=${enc(title)}`,
      Icon: Twitter,
    },
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`,
      Icon: Facebook,
    },
  ];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-[11px] tracking-[0.18em] uppercase text-muted-foreground mr-1">
        Share
      </span>
      {share.map(({ label, href, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${label}`}
          className="grid h-9 w-9 place-items-center rounded-full border border-border hover:border-foreground transition"
        >
          <Icon className="h-4 w-4" />
        </a>
      ))}
      <button
        onClick={copy}
        aria-label="Copy link"
        className="grid h-9 w-9 place-items-center rounded-full border border-border hover:border-foreground transition"
      >
        {copied ? <Check className="h-4 w-4 text-accent" /> : <Link2 className="h-4 w-4" />}
      </button>
    </div>
  );
}
