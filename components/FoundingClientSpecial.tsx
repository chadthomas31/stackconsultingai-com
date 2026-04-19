"use client";

import Link from "next/link";
import { ArrowRight, Check, Sparkles, Clock } from "lucide-react";

const NORMAL_PRICE = 2500;

const TIERS = [
  {
    label: "Free",
    slots: "Clients 1–3",
    slotsCount: 3,
    price: "$0",
    priceNote: "tool subscriptions only (~$60/mo combined)",
    savings: "100% off",
    tone: "primary" as const,
    headline: "Free. Just cover the tools.",
    body:
      "The assessment, the 4-day implementation, and the follow-up review — we cover all of it. You only pay the tool subscriptions themselves (typically under $60/month combined).",
    exchange:
      "In exchange: a 2-minute video testimonial and permission to share your results publicly.",
  },
  {
    label: "70% Off",
    slots: "Clients 4–6",
    slotsCount: 3,
    price: "$750",
    priceNote: `normally $${NORMAL_PRICE.toLocaleString()}`,
    savings: "Save $1,750",
    tone: "warm" as const,
    headline: "$750 flat. Full assessment and setup.",
    body:
      "Same deliverables. Same hands-on implementation. We're still early enough that your case study matters — just without the testimonial requirement.",
    exchange: "Pay once. Own the results.",
  },
  {
    label: "50% Off",
    slots: "Clients 7–10",
    slotsCount: 4,
    price: "$1,250",
    priceNote: `normally $${NORMAL_PRICE.toLocaleString()}`,
    savings: "Save $1,250",
    tone: "neutral" as const,
    headline: "$1,250 flat. Half off and still early.",
    body:
      "The last of the founding discounts. After slot 10, we move to full rate with no exceptions. Worth grabbing before the window closes.",
    exchange: "Pay once. Own the results.",
  },
];

export default function FoundingClientSpecial() {
  const totalSlots = TIERS.reduce((sum, t) => sum + t.slotsCount, 0);
  return (
    <section
      id="founding-clients"
      className="relative py-20 md:py-28 px-4 bg-gradient-to-b from-white via-soft to-white"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand/10 border border-brand/25 text-brand text-xs font-semibold tracking-[0.16em] uppercase mb-5">
            <Sparkles className="w-3 h-3" />
            Launch Partner Program · {totalSlots} Slots
          </div>
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-navy-900 tracking-tight leading-[1.05] mb-5">
            We&rsquo;re building our case studies.
            <br />
            You&rsquo;re getting AI implemented.
            <br />
            <span className="text-brand">Both win.</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Stack Consulting AI is new — and we&rsquo;re trading price for
            proof. Be one of our first ten clients, help us build a track
            record, and pay a fraction of the normal rate. Slots fill in the
            order you book.
          </p>
        </div>

        {/* Tier cards */}
        <div className="grid md:grid-cols-3 gap-5 mb-12">
          {TIERS.map((tier) => {
            const isPrimary = tier.tone === "primary";
            return (
              <div
                key={tier.label}
                className={`relative rounded-xl p-7 md:p-8 flex flex-col border transition-all ${
                  isPrimary
                    ? "bg-navy-900 text-white border-navy-900 shadow-[0_20px_50px_-20px_rgba(0,18,46,0.4)]"
                    : "bg-white text-navy-900 border-border hover:border-navy-900 hover:shadow-[0_12px_32px_-12px_rgba(0,18,46,0.18)]"
                }`}
              >
                {isPrimary && (
                  <div className="absolute -top-3 left-7 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-brand text-white text-[10px] font-bold tracking-[0.14em] uppercase">
                    Biggest win
                  </div>
                )}
                <div className="flex items-baseline justify-between gap-3 mb-3">
                  <span
                    className={`text-xs font-bold tracking-[0.14em] uppercase ${
                      isPrimary ? "text-brand-soft" : "text-brand"
                    }`}
                  >
                    {tier.label}
                  </span>
                  <span
                    className={`text-[10px] font-semibold tracking-wide ${
                      isPrimary ? "text-white/60" : "text-muted-foreground"
                    }`}
                  >
                    {tier.slots}
                  </span>
                </div>
                <div className="mb-5">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-heading text-5xl font-bold tracking-tight">
                      {tier.price}
                    </span>
                  </div>
                  <div
                    className={`text-xs ${
                      isPrimary ? "text-white/60" : "text-muted-foreground"
                    }`}
                  >
                    {tier.priceNote}
                  </div>
                  <div
                    className={`mt-1 text-xs font-semibold ${
                      isPrimary ? "text-brand-soft" : "text-brand"
                    }`}
                  >
                    {tier.savings}
                  </div>
                </div>
                <h3 className="font-heading text-lg font-bold mb-3 leading-snug">
                  {tier.headline}
                </h3>
                <p
                  className={`text-sm leading-relaxed mb-4 ${
                    isPrimary ? "text-white/80" : "text-muted-foreground"
                  }`}
                >
                  {tier.body}
                </p>
                <div
                  className={`text-xs italic leading-relaxed mb-6 ${
                    isPrimary ? "text-white/70" : "text-muted-foreground"
                  }`}
                >
                  {tier.exchange}
                </div>
                <div
                  className={`mt-auto pt-4 text-xs font-semibold inline-flex items-center gap-1.5 ${
                    isPrimary ? "text-brand-soft" : "text-navy-900"
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  {tier.slotsCount} slots available
                </div>
              </div>
            );
          })}
        </div>

        {/* What you get — condensed checklist */}
        <div className="rounded-xl border border-border bg-white p-6 md:p-8 mb-10">
          <div className="text-xs font-bold tracking-[0.14em] uppercase text-brand mb-3">
            Every slot includes
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "Full AI Tools Assessment via phone with Stacks",
              "Personalized 4-day implementation plan",
              "Hands-on setup of 4 quick-win tools",
              "30-day follow-up review call",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <Check className="w-4 h-4 text-brand flex-shrink-0 mt-0.5" />
                <span className="text-navy-900">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-xl bg-navy-900 text-white p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <h3 className="font-heading text-2xl md:text-3xl font-bold leading-tight mb-2">
              Ready to be a launch partner?
            </h3>
            <p className="text-white/80 leading-relaxed">
              Call Stacks, run your free AI assessment, and we&rsquo;ll confirm
              your slot on the spot. No obligation. After slot ten, it&rsquo;s
              full rate for everyone.
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
              Claim a slot directly
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
