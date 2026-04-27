import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export type PricingTierProps = {
  name: string;
  price: string;
  cadence: string;
  pitch: string;
  bullets: string[];
  ctaLabel: string;
  ctaHref: string;
  highlight?: boolean;
  badge?: string;
};

export default function PricingTier({
  name,
  price,
  cadence,
  pitch,
  bullets,
  ctaLabel,
  ctaHref,
  highlight = false,
  badge = "Most chosen",
}: PricingTierProps) {
  return (
    <div
      className={
        highlight
          ? "tier-card tier-card-highlight order-first md:order-2"
          : "tier-card order-last md:order-1"
      }
    >
      {highlight ? <span className="tier-badge">{badge}</span> : null}
      <h3 className="font-heading text-2xl font-bold text-navy-900 mb-1">
        {name}
      </h3>
      <div className="flex items-baseline gap-2 mb-2">
        <span className="font-heading text-5xl font-bold text-navy-900">
          {price}
        </span>
      </div>
      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-5">
        {cadence}
      </p>
      <p className="text-muted-foreground leading-relaxed mb-6">{pitch}</p>
      <ul className="space-y-3 mb-8">
        {bullets.map((b) => (
          <li
            key={b}
            className="flex items-start gap-3 text-sm text-navy-900 leading-relaxed"
          >
            <CheckCircle2
              aria-hidden="true"
              className="w-4 h-4 text-brand shrink-0 mt-0.5"
            />
            <span>{b}</span>
          </li>
        ))}
      </ul>
      <Link
        href={ctaHref}
        className={
          highlight
            ? "btn-accent w-full inline-flex items-center justify-center gap-2"
            : "btn-ghost w-full inline-flex items-center justify-center gap-2"
        }
      >
        {ctaLabel}
        <ArrowRight aria-hidden="true" className="w-4 h-4" />
      </Link>
    </div>
  );
}
