"use client";

import Link from "next/link";
import { ArrowRight, Check, Sparkles, CalendarClock } from "lucide-react";

const NORMAL_PRICE = 2500;
const DISCOUNT_PCT = 20;

// Launch window — hard deadline for the 20% fallback tier.
const LAUNCH_END_ISO = "2026-07-19";

function formatDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Toggle `filled: true` when a tier is fully booked.
 * Filled tiers render struck-through with a FILLED badge and lose their
 * "primary" visual emphasis so the next available tier pulls the eye.
 */
const TIERS: Array<{
  id: string;
  label: string;
  slots: string;
  slotsCount: number;
  price: string;
  priceNote: string;
  savings: string;
  primary: boolean;
  headline: string;
  body: string;
  exchange: string;
  filled: boolean;
}> = [
  {
    id: "free",
    label: "Free",
    slots: "Clients 1–3",
    slotsCount: 3,
    price: "$0",
    priceNote: "tool subscriptions only (~$60/mo combined)",
    savings: `Save $${NORMAL_PRICE.toLocaleString()}`,
    primary: true,
    headline: "Free. Just cover the tools.",
    body:
      "The assessment, the 4-day implementation, and a follow-up review — we cover all of it. You only pay the tool subscriptions themselves.",
    exchange:
      "In exchange: a 2-minute video testimonial and permission to share your results publicly.",
    filled: false,
  },
  {
    id: "seventy",
    label: "70% Off",
    slots: "Clients 4–6",
    slotsCount: 3,
    price: "$750",
    priceNote: `normally $${NORMAL_PRICE.toLocaleString()}`,
    savings: `Save $${(NORMAL_PRICE - 750).toLocaleString()}`,
    primary: false,
    headline: "$750 flat. Full assessment and setup.",
    body:
      "Same deliverables as the free tier. Same hands-on implementation. Just without the testimonial requirement.",
    exchange: "Pay once. Own the results.",
    filled: false,
  },
  {
    id: "fifty",
    label: "50% Off",
    slots: "Clients 7–10",
    slotsCount: 4,
    price: "$1,250",
    priceNote: `normally $${NORMAL_PRICE.toLocaleString()}`,
    savings: `Save $${(NORMAL_PRICE - 1250).toLocaleString()}`,
    primary: false,
    headline: "$1,250 flat. Half off and still early.",
    body:
      "The last of the founding-client discounts. After slot 10, we move to the standard rate.",
    exchange: "Pay once. Own the results.",
    filled: false,
  },
];

export default function FoundingClientSpecial() {
  const totalSlots = TIERS.reduce((sum, t) => sum + t.slotsCount, 0);
  const slotsRemaining = TIERS.filter((t) => !t.filled).reduce(
    (sum, t) => sum + t.slotsCount,
    0,
  );
  // First available tier gets promoted to "primary" regardless of the tier's
  // own `primary` flag — so as slots fill, the next-available tier pulls the eye.
  const firstOpenIdx = TIERS.findIndex((t) => !t.filled);
  const endDateLabel = formatDate(LAUNCH_END_ISO);
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
            Launch Partner Program ·{" "}
            {slotsRemaining === totalSlots
              ? `${totalSlots} Slots`
              : slotsRemaining === 0
                ? "All slots filled"
                : `${slotsRemaining} of ${totalSlots} slots left`}
          </div>
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-navy-900 tracking-tight leading-[1.05] mb-5">
            <span className="text-brand">Free</span> for the first three
            clients.
            <br className="hidden md:block" /> Big discounts for the next
            seven. <span className="text-brand">20% off</span> for everyone who
            signs before {endDateLabel}.
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Stack Consulting AI is new — and we&rsquo;re trading price for
            proof. Be one of our first ten clients and pay a fraction of the
            regular rate. Miss the ten-slot window and you can still lock in{" "}
            {DISCOUNT_PCT}% off any engagement signed before the cutoff. After
            that, full rate for everyone.
          </p>
        </div>

        {/* Tier cards — the hook */}
        <div className="grid md:grid-cols-3 gap-5 mb-10">
          {TIERS.map((tier, idx) => {
            const isPrimary = !tier.filled && idx === firstOpenIdx;
            return (
            <div
              key={tier.id}
              className={`relative rounded-xl p-7 md:p-8 flex flex-col border transition-all ${
                tier.filled
                  ? "bg-neutral-50 text-neutral-500 border-neutral-200"
                  : isPrimary
                    ? "bg-navy-900 text-white border-navy-900 shadow-[0_20px_50px_-20px_rgba(0,18,46,0.4)]"
                    : "bg-white text-navy-900 border-border hover:border-navy-900 hover:shadow-[0_12px_32px_-12px_rgba(0,18,46,0.18)]"
              }`}
            >
              {tier.filled ? (
                <div className="absolute -top-3 left-7 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-neutral-800 text-white text-[10px] font-bold tracking-[0.14em] uppercase">
                  Filled
                </div>
              ) : isPrimary ? (
                <div className="absolute -top-3 left-7 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-brand text-white text-[10px] font-bold tracking-[0.14em] uppercase">
                  Next available
                </div>
              ) : null}
              <div className="flex items-baseline justify-between gap-3 mb-3">
                <span
                  className={`text-xs font-bold tracking-[0.14em] uppercase ${
                    tier.filled
                      ? "text-neutral-400 line-through"
                      : isPrimary
                        ? "text-brand-soft"
                        : "text-brand"
                  }`}
                >
                  {tier.label}
                </span>
                <span
                  className={`text-[10px] font-semibold tracking-wide ${
                    tier.filled
                      ? "text-neutral-400"
                      : isPrimary
                        ? "text-white/60"
                        : "text-muted-foreground"
                  }`}
                >
                  {tier.slots}
                </span>
              </div>
              <div className="mb-5">
                <div className="flex items-baseline gap-2 mb-1">
                  <span
                    className={`font-heading text-5xl font-bold tracking-tight ${
                      tier.filled ? "line-through text-neutral-400" : ""
                    }`}
                  >
                    {tier.price}
                  </span>
                </div>
                <div
                  className={`text-xs ${
                    tier.filled
                      ? "text-neutral-400"
                      : isPrimary
                        ? "text-white/60"
                        : "text-muted-foreground"
                  }`}
                >
                  {tier.priceNote}
                </div>
                <div
                  className={`mt-1 text-xs font-semibold ${
                    tier.filled
                      ? "text-neutral-400"
                      : isPrimary
                        ? "text-brand-soft"
                        : "text-brand"
                  }`}
                >
                  {tier.savings}
                </div>
              </div>
              <h3
                className={`font-heading text-lg font-bold mb-3 leading-snug ${
                  tier.filled ? "text-neutral-500" : ""
                }`}
              >
                {tier.headline}
              </h3>
              <p
                className={`text-sm leading-relaxed mb-4 ${
                  tier.filled
                    ? "text-neutral-500"
                    : isPrimary
                      ? "text-white/80"
                      : "text-muted-foreground"
                }`}
              >
                {tier.body}
              </p>
              <div
                className={`text-xs italic leading-relaxed mb-6 ${
                  tier.filled
                    ? "text-neutral-400"
                    : isPrimary
                      ? "text-white/70"
                      : "text-muted-foreground"
                }`}
              >
                {tier.exchange}
              </div>
              <div
                className={`mt-auto pt-4 text-xs font-semibold inline-flex items-center gap-1.5 ${
                  tier.filled
                    ? "text-neutral-400"
                    : isPrimary
                      ? "text-brand-soft"
                      : "text-navy-900"
                }`}
              >
                <CalendarClock className="w-3.5 h-3.5" />
                {tier.filled
                  ? "All slots filled"
                  : `${tier.slotsCount} slots available`}
              </div>
            </div>
            );
          })}
        </div>

        {/* Fallback — 20% for everyone else */}
        <div className="rounded-xl border-2 border-dashed border-brand/30 bg-brand/5 p-6 md:p-7 mb-10">
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-brand/30 text-brand text-xs font-bold tracking-[0.14em] uppercase self-start flex-shrink-0">
              <CalendarClock className="w-3 h-3" />
              Closes {endDateLabel}
            </div>
            <div className="flex-1">
              <h3 className="font-heading text-lg md:text-xl font-bold text-navy-900 mb-1">
                Miss the first ten? Still get {DISCOUNT_PCT}% off.
              </h3>
              <p className="text-sm text-navy-900/80 leading-relaxed">
                Sign any engagement before{" "}
                <span className="font-semibold">{endDateLabel}</span> and{" "}
                {DISCOUNT_PCT}% comes off every invoice — assessment,
                implementation, voice agent subscription, maintenance retainer.
                The launch window closes on that date. Full rate for everyone
                after.
              </p>
            </div>
          </div>
        </div>

        {/* What every tier includes */}
        <div className="rounded-xl border border-border bg-white p-6 md:p-8 mb-10">
          <div className="text-xs font-bold tracking-[0.14em] uppercase text-brand mb-3">
            Every tier includes
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
              Ready to claim your slot?
            </h3>
            <p className="text-white/80 leading-relaxed">
              Call Stacks, run your free AI assessment, and we&rsquo;ll confirm
              which tier is still open when you&rsquo;re ready to sign. No
              obligation to move forward. Slots fill in the order clients book.
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
              Talk to an AI expert
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
