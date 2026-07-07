import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

type ToolSeoPanelProps = {
  title: string;
  intro: string;
  bullets: string[];
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export default function ToolSeoPanel({
  title,
  intro,
  bullets,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: ToolSeoPanelProps) {
  return (
    <section className="px-4 py-14 border-t border-border bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="max-w-3xl">
          <h2 className="font-heading text-3xl font-bold text-navy-900 mb-4">
            {title}
          </h2>
          <p className="text-muted-foreground leading-relaxed text-lg">
            {intro}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          {bullets.map((bullet) => (
            <div
              key={bullet}
              className="rounded-md border border-border bg-card p-5"
            >
              <CheckCircle2
                className="w-5 h-5 text-brand mb-3"
                aria-hidden="true"
              />
              <p className="text-sm text-muted-foreground leading-relaxed">
                {bullet}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Link href={primaryHref} className="btn-primary">
            {primaryLabel}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
          {secondaryHref && secondaryLabel ? (
            <Link href={secondaryHref} className="btn-ghost">
              {secondaryLabel}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
