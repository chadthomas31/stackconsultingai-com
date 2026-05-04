"use client";

import {
  Phone,
  AlertCircle,
  Sparkles,
  LayoutGrid,
  CalendarCheck,
  TrendingUp,
  Mail,
  Clock,
  FileText,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { INDUSTRY_OPTIONS } from "@/lib/interview-scripts";
import CallOpsConsole, {
  type ConsoleStage,
  type StageStatus,
} from "./CallOpsConsole";

const STACKS_PHONE = "+14422121616";
const STACKS_PHONE_DISPLAY = "(442) 212-1616";

type ViewState = "form" | "streaming" | "done" | "error";

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

const NEXT_STEPS = [
  {
    icon: Mail,
    title: "AI expert paged",
    detail: "Your industry and number are in the dispatch queue now.",
  },
  {
    icon: Clock,
    title: "Callback inside 2–4 hours",
    detail: "Local time, daylight hours. Voicemail if we miss you.",
  },
  {
    icon: FileText,
    title: "Written report within 24h",
    detail: "Executive summary, Impact-Effort matrix, 4-day Quick Wins plan.",
  },
];

// Placeholder stages shown before the stream starts responding
const DEFAULT_STAGES: ConsoleStage[] = [
  {
    id: "validated",
    label: "Number validated",
    detail: "E.164 format accepted",
    status: "pending",
  },
  {
    id: "queued",
    label: "Request queued in dispatcher",
    detail: "Stacks backlog check",
    status: "pending",
  },
  {
    id: "notified",
    label: "AI expert paged via SMS",
    detail: "Expert notification sent",
    status: "pending",
  },
  {
    id: "scheduled",
    label: "Call window confirmed",
    detail: "Callback window",
    status: "pending",
  },
];

/**
 * Wraps state updates in a View Transition when supported.
 * Gracefully falls back to a direct update.
 */
function withViewTransition(cb: () => void) {
  if (typeof document !== "undefined") {
    const startVT = document.startViewTransition;
    if (typeof startVT === "function") {
      startVT.call(document, cb);
      return;
    }
  }
  cb();
}

export default function FreeAssessmentOffer() {
  const [view, setView] = useState<ViewState>("form");
  const [industry, setIndustry] = useState<string>(
    INDUSTRY_OPTIONS[0]?.id ?? "other",
  );
  const [phone, setPhone] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [stages, setStages] = useState<ConsoleStage[]>(DEFAULT_STAGES);
  const [streamPhone, setStreamPhone] = useState<string>("");
  const [streamIndustry, setStreamIndustry] = useState<string>("");
  const [totalMs, setTotalMs] = useState<number | undefined>(undefined);
  const abortRef = useRef<AbortController | null>(null);

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

  const markStage = useCallback(
    (id: string, patch: Partial<ConsoleStage>) => {
      setStages((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...patch } : s)),
      );
    },
    [],
  );

  const setActive = useCallback((id: string) => {
    setStages((prev) =>
      prev.map((s) => {
        if (s.id === id) return { ...s, status: "active" satisfies StageStatus };
        return s;
      }),
    );
  }, []);

  const runStream = useCallback(async () => {
    setErrorMsg(null);
    if (!valid) {
      setErrorMsg("Please enter a valid US phone number.");
      return;
    }

    const digits = normalize(phone);
    const e164 = digits.length === 11 ? `+${digits}` : `+1${digits}`;

    setStreamPhone(e164);
    setStreamIndustry(industry);
    setStages(DEFAULT_STAGES.map((s) => ({ ...s, status: "pending" })));
    setTotalMs(undefined);

    withViewTransition(() => setView("streaming"));

    // Light it up: first stage begins "active" immediately so the console isn't empty
    // while we wait for the first SSE frame
    const kickoffId = DEFAULT_STAGES[0].id;
    setTimeout(() => setActive(kickoffId), 60);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/call-me", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ phone: digits, industry }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Request could not be submitted.");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let nextIdx = 0;

      const stageOrder = DEFAULT_STAGES.map((s) => s.id);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const frames = buffer.split("\n\n");
        buffer = frames.pop() ?? "";

        for (const frame of frames) {
          if (!frame.trim()) continue;
          const lines = frame.split("\n");
          let ev = "message";
          let payload = "";
          for (const line of lines) {
            if (line.startsWith("event:")) ev = line.slice(6).trim();
            else if (line.startsWith("data:")) payload = line.slice(5).trim();
          }
          let parsed: Record<string, unknown> = {};
          try {
            parsed = payload ? JSON.parse(payload) : {};
          } catch {
            /* ignore */
          }

          if (ev === "stage") {
            const id = String(parsed.id ?? "");
            const elapsedMs = Number(parsed.elapsedMs ?? 0);
            const label = String(parsed.label ?? "");
            const detail = String(parsed.detail ?? "");
            markStage(id, {
              status: "done",
              elapsedMs,
              label,
              detail,
            });
            // Activate the next one
            const idx = stageOrder.indexOf(id);
            const next = stageOrder[idx + 1];
            nextIdx = idx + 1;
            if (next) setActive(next);
          } else if (ev === "done") {
            const t = Number(parsed.totalMs ?? 0);
            setTotalMs(t);
            // In case any remaining stages didn't receive explicit events
            for (let i = nextIdx; i < stageOrder.length; i++) {
              markStage(stageOrder[i], { status: "done" });
            }
            withViewTransition(() => setView("done"));
          }
        }
      }
    } catch (e) {
      if (controller.signal.aborted) return;
      setErrorMsg(
        e instanceof Error ? e.message : "Something went wrong — please retry.",
      );
      withViewTransition(() => setView("error"));
    } finally {
      abortRef.current = null;
    }
  }, [industry, markStage, phone, setActive, valid]);

  const reset = () => {
    abortRef.current?.abort();
    withViewTransition(() => {
      setView("form");
      setErrorMsg(null);
      setStages(DEFAULT_STAGES.map((s) => ({ ...s, status: "pending" })));
      setTotalMs(undefined);
    });
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
            Pick up the phone. Stacks — our custom VoIP voice agent we
            design and deploy — conducts a ten-minute business interview and turns it into
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

          {/* Right: Phone-first CTA + live ops submission */}
          <div className="lg:col-span-3 space-y-6">
            {/* Primary: Call now (unchanged — the preferred path is outbound) */}
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

            {/* Secondary: the cinematic live-ops callback flow */}
            {view === "form" || view === "error" ? (
              <details
                className="soft-card p-5 md:p-6 group"
                open={view === "error"}
              >
                <summary
                  className="cursor-pointer list-none flex items-center justify-between gap-3"
                  style={{ viewTransitionName: "assessment-card" }}
                >
                  <span className="font-semibold text-navy-900">
                    Can&rsquo;t call right now? Request a callback.
                  </span>
                  <span
                    className="flex items-center justify-center w-8 h-8 rounded-full border border-border text-navy-900 transition-transform group-open:rotate-180"
                    aria-hidden="true"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
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
                      className="w-full px-4 py-3 rounded-md border border-border bg-white text-navy-900 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all"
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
                        className="w-full bg-transparent outline-none text-navy-900 placeholder:text-muted-foreground"
                        aria-label="Phone number"
                      />
                    </div>
                  </label>

                  <button
                    onClick={runStream}
                    disabled={!valid}
                    className="w-full btn-cta-call inline-flex items-center justify-center gap-2 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                    data-testid="assessment-submit"
                  >
                    Request callback
                  </button>

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
            ) : null}

            {view === "streaming" || view === "done" ? (
              <CallOpsConsole
                phone={streamPhone}
                industry={streamIndustry}
                stages={stages}
                isStreaming={view === "streaming"}
                totalMs={totalMs}
              />
            ) : null}

            {view === "done" ? (
              <div className="soft-card p-5 md:p-6">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <h4 className="font-heading text-lg font-semibold text-navy-900">
                    What happens next
                  </h4>
                  <button
                    onClick={reset}
                    className="text-xs text-muted-foreground hover:text-navy-900 transition-colors"
                  >
                    New request
                  </button>
                </div>
                <ul className="space-y-3">
                  {NEXT_STEPS.map((step, i) => {
                    const Icon = step.icon;
                    return (
                      <li
                        key={step.title}
                        className="next-step flex items-start gap-3"
                        style={{ animationDelay: `${i * 140 + 120}ms` }}
                      >
                        <div className="flex-shrink-0 w-8 h-8 rounded-md bg-brand/10 text-brand flex items-center justify-center">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-navy-900 text-sm">
                            {step.title}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {step.detail}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
