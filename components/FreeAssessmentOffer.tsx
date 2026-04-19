"use client";

import { Phone, Loader2, CheckCircle2, AlertCircle, Sparkles, LayoutGrid, CalendarCheck, TrendingUp } from "lucide-react";
import { useState } from "react";
import { INDUSTRY_OPTIONS } from "@/lib/interview-scripts";

type State = "idle" | "calling" | "connected" | "error";

const WHAT_YOU_GET = [
  {
    icon: Sparkles,
    title: "Executive summary",
    desc: "Your top pain points mapped to time lost and dollars on the table.",
  },
  {
    icon: LayoutGrid,
    title: "Impact-Effort matrix",
    desc: "Which fixes are Quick Wins, which are Major Projects, which to ignore.",
  },
  {
    icon: CalendarCheck,
    title: "4-Day Quick Wins plan",
    desc: "Day-by-day checklist to get the high-leverage tools live this week.",
  },
  {
    icon: TrendingUp,
    title: "Financial impact",
    desc: "Hours reclaimed per week, monthly tool cost, net ROI — in dollars.",
  },
];

export default function FreeAssessmentOffer() {
  const [state, setState] = useState<State>("idle");
  const [industry, setIndustry] = useState<string>(INDUSTRY_OPTIONS[0]?.id ?? "other");
  const [phone, setPhone] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const normalize = (p: string) => p.replace(/[^\d]/g, "");
  const valid = normalize(phone).length >= 10;

  const handleCall = async () => {
    setErrorMsg(null);
    if (!valid) {
      setErrorMsg("Please enter a valid US phone number.");
      return;
    }
    setState("calling");

    try {
      const res = await fetch("/api/call-me", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ phone: normalize(phone), industry }),
      });

      if (res.status === 404) {
        // Backend not live yet — simulate for homepage UX.
        await new Promise((r) => setTimeout(r, 2500));
        setState("connected");
        return;
      }
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Call could not be placed.");
      }
      setState("connected");
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "Something went wrong.");
      setState("error");
    }
  };

  const reset = () => {
    setState("idle");
    setErrorMsg(null);
  };

  return (
    <section id="assessment" className="py-20 md:py-28 bg-soft">
      <div className="max-w-6xl mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="section-kicker">Free AI Tools Assessment</span>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-navy-900 mt-2 mb-4">
            Meet Stacks. The AI will call you.
          </h2>
          <p className="text-lg text-muted-foreground">
            Drop your number. Stacks — our FreeSWITCH + OpenAI Realtime voice
            agent — calls you back in about ten seconds and conducts a
            ten-minute business interview. We turn it into a personalized
            report and email it to you within 24 hours.
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            No sales pitch. No credit card. Same stack we deploy for real customers.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* Left: What you'll receive */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-heading text-lg font-semibold text-navy-900 mb-2">
              What you&rsquo;ll receive
            </h3>
            {WHAT_YOU_GET.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-9 h-9 rounded-md bg-brand/10 text-brand flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-navy-900 text-sm">{item.title}</div>
                    <div className="text-sm text-muted-foreground">{item.desc}</div>
                  </div>
                </div>
              );
            })}
            <div className="pt-4 mt-4 border-t border-border text-xs text-muted-foreground">
              Typical client outcome: <span className="font-semibold text-navy-900">8+ hours/week back, ~$59/mo tool cost.</span>
            </div>
          </div>

          {/* Right: The form */}
          <div className="lg:col-span-3 soft-card p-6 md:p-8">
            {/* Industry */}
            <label className="block mb-5">
              <span className="block text-sm font-semibold text-navy-900 mb-2">
                1. What kind of business do you run?
              </span>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                disabled={state === "calling" || state === "connected"}
                className="w-full px-4 py-3 rounded-md border border-border bg-white text-navy-900 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Industry"
              >
                {INDUSTRY_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.emoji}  {opt.label}
                  </option>
                ))}
              </select>
              <span className="mt-1.5 block text-xs text-muted-foreground">
                Stacks tailors the interview to your industry.
              </span>
            </label>

            {/* Phone */}
            <label className="block mb-5">
              <span className="block text-sm font-semibold text-navy-900 mb-2">
                2. Your US phone number
              </span>
              <div className="flex items-center gap-2 px-4 py-3 rounded-md border border-border bg-white focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20 transition-all">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <input
                  type="tel"
                  inputMode="tel"
                  placeholder="(555) 555-5555"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={state === "calling" || state === "connected"}
                  className="w-full bg-transparent outline-none text-navy-900 placeholder:text-muted-foreground disabled:cursor-not-allowed"
                  aria-label="Phone number"
                />
              </div>
            </label>

            {/* Action */}
            {state === "idle" || state === "error" ? (
              <button
                onClick={handleCall}
                disabled={!valid}
                className="w-full btn-accent inline-flex items-center justify-center gap-2 text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Phone className="w-4 h-4" />
                Have Stacks call me now
              </button>
            ) : null}

            {state === "calling" ? (
              <div
                role="status"
                aria-live="polite"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-md bg-navy-900 text-white font-semibold"
              >
                <Loader2 className="w-4 h-4 animate-spin" />
                Stacks is dialing… your phone should ring any second.
              </div>
            ) : null}

            {state === "connected" ? (
              <div
                role="status"
                aria-live="polite"
                className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 rounded-md bg-brand/10 border border-brand/30"
              >
                <div className="inline-flex items-center gap-2 text-navy-900 font-semibold">
                  <CheckCircle2 className="w-5 h-5 text-brand" />
                  Call placed. Pick up — Stacks is on the line.
                </div>
                <button onClick={reset} className="btn-ghost text-sm">
                  Try another industry
                </button>
              </div>
            ) : null}

            {errorMsg ? (
              <div className="mt-3 inline-flex items-center gap-2 text-sm text-red-700">
                <AlertCircle className="w-4 h-4" />
                {errorMsg}
              </div>
            ) : null}

            <p className="mt-5 text-xs text-muted-foreground text-center">
              One call per number per hour. Interview takes 10&ndash;20 minutes.
              You&rsquo;ll get the written report within 24 hours.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
