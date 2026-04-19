"use client";

import Link from "next/link";
import { ArrowRight, Check, Sparkles, Clock } from "lucide-react";

const DISCOUNT_PCT = 20;
const DISCOUNT_MONTHS = 3;

const SAMPLE_LINES = [
  {
    name: "AI Voice Agent monthly",
    regular: 150,
  },
  {
    name: "Maintenance retainer",
    regular: 500,
  },
  {
    name: "Automation support",
    regular: 750,
  },
];

export default function FoundingClientSpecial() {
  const discountMultiplier = (100 - DISCOUNT_PCT) / 100;
  return (
    <section
      id="founding-clients"
      className="relative py-20 md:py-28 px-4 bg-gradient-to-b from-white via-soft to-white"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand/10 border border-brand/25 text-brand text-xs font-semibold tracking-[0.16em] uppercase mb-5">
            <Sparkles className="w-3 h-3" />
            New Client Special
          </div>
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-navy-900 tracking-tight leading-[1.05] mb-5">
            <span className="text-brand">{DISCOUNT_PCT}% off</span> your first
            <br className="hidden md:block" /> {DISCOUNT_MONTHS} months.
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            We&rsquo;re new. We&rsquo;re good. A small discount is how we earn
            your confidence. Start with us in your first {DISCOUNT_MONTHS} months
            and every invoice — assessment through implementation through
            ongoing services — comes in {DISCOUNT_PCT}% lighter.
          </p>
        </div>

        {/* Two-column — what it looks like in practice + what&rsquo;s included */}
        <div className="grid md:grid-cols-5 gap-6 mb-10">
          {/* Price examples — dark card, visual anchor */}
          <div className="md:col-span-3 rounded-xl bg-navy-900 text-white p-8 md:p-10 shadow-[0_20px_50px_-20px_rgba(0,18,46,0.4)] relative overflow-hidden">
            <div
              aria-hidden="true"
              className="absolute -top-20 -right-20 w-[280px] h-[280px] rounded-full bg-brand/15 blur-2xl pointer-events-none"
            />
            <div className="relative">
              <div className="text-xs font-bold tracking-[0.14em] uppercase text-brand-soft mb-5">
                What it looks like in practice
              </div>
              <div className="space-y-4">
                {SAMPLE_LINES.map((line) => {
                  const discounted = Math.round(
                    line.regular * discountMultiplier,
                  );
                  const savings = line.regular - discounted;
                  return (
                    <div
                      key={line.name}
                      className="flex items-baseline justify-between gap-4 pb-4 border-b border-white/10 last:border-b-0 last:pb-0"
                    >
                      <div className="min-w-0">
                        <div className="font-semibold text-white truncate">
                          {line.name}
                        </div>
                        <div className="text-xs text-white/60">
                          first {DISCOUNT_MONTHS} months, then ${line.regular}/mo
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="flex items-baseline gap-2 justify-end">
                          <span className="text-white/40 line-through text-sm">
                            ${line.regular}
                          </span>
                          <span className="font-heading text-3xl font-bold text-white">
                            ${discounted}
                          </span>
                          <span className="text-xs text-white/60">/mo</span>
                        </div>
                        <div className="text-xs text-brand-soft font-semibold mt-0.5">
                          Save ${savings}/mo
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-white/60 mt-5 leading-relaxed">
                Numbers above are examples. Your scope is set after your free
                assessment with Stacks.
              </p>
            </div>
          </div>

          {/* Checklist — what&rsquo;s included */}
          <div className="md:col-span-2 rounded-xl border border-border bg-white p-8 flex flex-col">
            <div className="text-xs font-bold tracking-[0.14em] uppercase text-brand mb-4">
              The {DISCOUNT_PCT}% applies to
            </div>
            <ul className="space-y-3 flex-1">
              {[
                "Your monthly service retainer",
                "Voice agent subscriptions",
                "Maintenance and support plans",
                "Any automation engagement during the window",
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-navy-900"
                >
                  <Check className="w-4 h-4 text-brand flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="w-3.5 h-3.5 text-brand" />
                <span>
                  Locks in at signing. After {DISCOUNT_MONTHS} months,
                  standard rate applies.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-xl bg-navy-900 text-white p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <h3 className="font-heading text-2xl md:text-3xl font-bold leading-tight mb-2">
              Ready to get in while the discount is active?
            </h3>
            <p className="text-white/80 leading-relaxed">
              Start with your free AI assessment. If we&rsquo;re a fit,
              your {DISCOUNT_PCT}% discount locks in the moment you sign. No
              obligation to move forward after the assessment.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <Link
              href="#assessment"
              className="btn-accent inline-flex items-center gap-2 whitespace-nowrap"
            >
              Start the assessment
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="#contact"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-md border border-white/30 text-white font-semibold hover:bg-white/10 transition-colors whitespace-nowrap"
            >
              Talk to Chad
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
