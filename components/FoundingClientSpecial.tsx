"use client";

import Link from "next/link";
import {
  ArrowRight,
  Check,
  HeartHandshake,
  MessageSquareText,
  Phone,
  Sparkles,
} from "lucide-react";

export const LAUNCH_PARTNER_TOTAL_SLOTS = 10;
export const LAUNCH_PARTNER_SLOTS_REMAINING = 10;

const FIXES = [
  "Answer missed calls before they turn into lost jobs",
  "Follow up with leads by text or email",
  "Organize customer requests without another messy spreadsheet",
  "Turn repeat admin work into a simple automation",
  "Build one useful AI workflow your team will actually use",
];

const HOW_IT_WORKS = [
  {
    title: "Tell us what hurts",
    body: "Missed calls, slow follow-up, paperwork, scheduling, customer messages — tell us where time or money is leaking.",
  },
  {
    title: "We build one useful fix",
    body: "We pick one practical AI workflow and implement it for free. No giant platform pitch, no software shopping list.",
  },
  {
    title: "You tell us if it helped",
    body: "If it works, give us honest feedback. If you are happy, we would appreciate an honest public review and permission to share the story.",
  },
];

export default function FoundingClientSpecial() {
  return (
    <section
      id="founding-clients"
      className="relative py-20 md:py-28 px-4 bg-gradient-to-b from-white via-soft to-white"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-14 items-start">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand/10 border border-brand/25 text-brand text-xs font-semibold tracking-[0.16em] uppercase mb-5">
              <HeartHandshake className="w-3.5 h-3.5" />
              Free AI Help For Local Businesses
            </div>

            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-navy-900 tracking-tight leading-[1.05] mb-5">
              We&rsquo;ll implement AI in your business{" "}
              <span className="text-brand">for free.</span>
            </h2>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 max-w-3xl">
              No setup fee. No monthly contract. No catch. If AI could help
              your business answer calls, follow up faster, or cut admin work,
              we&rsquo;ll help you prove it on one real problem first.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Link
                href="#contact"
                className="btn-cta-call inline-flex items-center justify-center gap-2"
              >
                Tell us what AI should fix
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="#assessment"
                className="btn-ghost inline-flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                Get the free assessment
              </Link>
            </div>

            <div className="rounded-xl border border-border bg-white p-6">
              <div className="text-xs font-bold tracking-[0.14em] uppercase text-brand mb-4">
                Good fit if you need help with
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {FIXES.map((item) => (
                  <div key={item} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-brand flex-shrink-0 mt-0.5" />
                    <span className="text-navy-900">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="rounded-xl bg-navy-900 text-white p-7 md:p-8 shadow-[0_20px_50px_-20px_rgba(0,18,46,0.45)]">
            <div className="flex items-center gap-2 text-brand-soft text-xs font-bold tracking-[0.14em] uppercase mb-6">
              <Sparkles className="w-4 h-4" />
              How the free pilot works
            </div>

            <div className="space-y-5 mb-7">
              {HOW_IT_WORKS.map((step, index) => (
                <div key={step.title} className="grid grid-cols-[2rem_1fr] gap-4">
                  <div className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-lg mb-1">
                      {step.title}
                    </h3>
                    <p className="text-sm text-white/75 leading-relaxed">
                      {step.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-md bg-white/[0.08] border border-white/10 p-4">
              <div className="flex items-start gap-3">
                <MessageSquareText className="w-5 h-5 text-brand-soft flex-shrink-0 mt-0.5" />
                <p className="text-sm text-white/80 leading-relaxed">
                  We do not ask for fake praise. We want real results, honest
                  feedback, and a public review only if you are genuinely happy
                  with the work.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
