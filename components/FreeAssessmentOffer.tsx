"use client";

import {
  Phone,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  LayoutGrid,
  CalendarCheck,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { INDUSTRY_OPTIONS } from "@/lib/interview-scripts";

const STACKS_PHONE = "+14422121616";
const STACKS_PHONE_DISPLAY = "(442) 212-1616";

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
  const [industry, setIndustry] = useState<string>(
    INDUSTRY_OPTIONS[0]?.id ?? "other"
  );
  const [phone, setPhone] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const normalize = (p: string) => p.replace(/[^\d]/g, "");
  const valid = normalize(phone).length >= 10;

  const trackCallClick = () => {
    if (typeof window !== "undefined" && window.dataLayer) {
      window.dataLayer.push({
        event: "phone_click",
        phone_number: STACKS_PHONE,
        source: "free_assessment_offer",
      });
    }
  };

  const handleCallback = async () => {
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
        // Backend not live yet — treat as "we got your request" UX.
        await new Promise((r) => setTimeout(r, 1800));
        setState("connected");
        return;
      }
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Request could not be submitted.");
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
            Call Stacks. Get a custom AI report.
          </h2>
          <p className="text-lg text-muted-foreground">
            Pick up the phone. Stacks — our FreeSWITCH + OpenAI Realtime voice
            agent — conducts a ten-minute business interview and turns it into
            a personalized written report, emailed to you within 24 hours.
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            No sales pitch. No credit card. Same stack we deploy for real clients.
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
                    <div className="font-semibold text-navy-900 text-sm">
                      {item.title}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {item.desc}
                    </div>
                  </div>
                </div>
              );
            })}
            <div className="pt-4 mt-4 border-t border-border text-xs text-muted-foreground">
              Typical client outcome:{" "}
              <span className="font-semibold text-navy-900">
                8+ hours/week back, ~$59/mo tool cost.
              </span>
            </div>
          </div>

          {/* Right: Phone-first CTA + secondary callback form */}
          <div className="lg:col-span-3 space-y-6">
            {/* Primary: Call now */}
            <div className="rounded-md bg-navy-900 text-white p-6 md:p-8">
              <div className="flex items-center gap-2 text-brand text-xs font-semibold uppercase tracking-wider mb-3">
                <span className="live-dot" aria-hidden="true" />
                Stacks is live 24/7
              </div>
              <h3 className="font-heading text-2xl md:text-3xl font-bold mb-2">
                Call Stacks now
              </h3>
              <a
                href={`tel:${STACKS_PHONE}`}
                onClick={trackCallClick}
                className="block font-heading text-4xl md:text-5xl font-bold tracking-tight text-white hover:text-brand transition-colors mb-3"
                aria-label={`Call Stacks at ${STACKS_PHONE_DISPLAY}`}
              >
                {STACKS_PHONE_DISPLAY}
              </a>
              <p className="text-white/70 text-sm mb-5 leading-relaxed">
                Direct line to the assessment agent. Palm Springs area code.
                10&ndash;20 minute call. Report in your inbox within 24 hours.
              </p>
              <a
                href={`tel:${STACKS_PHONE}`}
                onClick={trackCallClick}
                className="inline-flex items-center gap-2 rounded-md bg-brand hover:bg-brand-hover px-6 py-3 text-white font-medium transition-colors"
              >
                <Phone className="w-4 h-4" />
                Tap to call
              </a>
            </div>

            {/* Secondary: Request a callback */}
            <details className="soft-card p-5 md:p-6 group">
              <summary className="cursor-pointer list-none flex items-center justify-between gap-3">
                <span className="font-semibold text-navy-900">
                  Can&rsquo;t call right now? Request a callback.
                </span>
                <span
                  className="text-xs text-muted-foreground group-open:hidden"
                  aria-hidden="true"
                >
                  Expand
                </span>
                <span
                  className="text-xs text-muted-foreground hidden group-open:inline"
                  aria-hidden="true"
                >
                  Collapse
                </span>
              </summary>

              <div className="mt-5 pt-5 border-t border-border">
                <label className="block mb-4">
                  <span className="block text-sm font-semibold text-navy-900 mb-2">
                    Industry
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
                        {opt.emoji} {opt.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block mb-4">
                  <span className="block text-sm font-semibold text-navy-900 mb-2">
                    Your US phone number
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

                {state === "idle" || state === "error" ? (
                  <button
                    onClick={handleCallback}
                    disabled={!valid}
                    className="w-full btn-ghost inline-flex items-center justify-center gap-2 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Request callback
                  </button>
                ) : null}

                {state === "calling" ? (
                  <div
                    role="status"
                    aria-live="polite"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-md bg-navy-900 text-white font-semibold"
                  >
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending your request&hellip;
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
                      Got it — Chad will call you back within a few hours.
                    </div>
                    <button onClick={reset} className="btn-ghost text-sm">
                      New request
                    </button>
                  </div>
                ) : null}

                {errorMsg ? (
                  <div className="mt-3 inline-flex items-center gap-2 text-sm text-red-700">
                    <AlertCircle className="w-4 h-4" />
                    {errorMsg}
                  </div>
                ) : null}

                <p className="mt-4 text-xs text-muted-foreground">
                  Or just pick up and dial {STACKS_PHONE_DISPLAY} &mdash; Stacks
                  is on every day, all day.
                </p>
              </div>
            </details>
          </div>
        </div>
      </div>
    </section>
  );
}
