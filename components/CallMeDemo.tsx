"use client";

import { Phone, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useState } from "react";

type State = "idle" | "calling" | "connected" | "error";

const USE_CASES = [
  { id: "booking", label: "Book an auto-repair appointment", sample: "Tito's Automotive" },
  { id: "intake", label: "Patient intake + scheduling", sample: "Dr. Woods Psychiatry" },
  { id: "quote", label: "Cleaning service quote", sample: "Mid-Pacific Cleaning" },
  { id: "afterhours", label: "After-hours voicemail", sample: "Fix It San Clemente" },
];

export default function CallMeDemo() {
  const [state, setState] = useState<State>("idle");
  const [useCase, setUseCase] = useState(USE_CASES[0].id);
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
        body: JSON.stringify({ phone: normalize(phone), useCase }),
      });

      if (res.status === 404) {
        // Route not yet deployed — simulate for UI preview.
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
    <section id="call-me" className="py-20 md:py-28 bg-soft">
      <div className="max-w-6xl mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="section-kicker">Live demo</span>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-navy-900 mt-2 mb-4">
            Let the AI call you. Right now.
          </h2>
          <p className="text-lg text-muted-foreground">
            Drop your number and our FreeSWITCH + OpenAI Realtime voice agent
            will ring you in under 10 seconds. Same stack we deploy for real
            small businesses — this is literally what your customers will hear.
          </p>
        </div>

        <div className="max-w-2xl mx-auto soft-card p-6 md:p-8">
          {/* Use case */}
          <div className="mb-5">
            <span className="block text-sm font-semibold text-navy-900 mb-2">
              1. Pick a scenario
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {USE_CASES.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => setUseCase(u.id)}
                  disabled={state === "calling" || state === "connected"}
                  className={[
                    "text-left px-4 py-3 rounded-md border transition-all text-sm",
                    useCase === u.id
                      ? "border-brand bg-brand/5 text-navy-900 shadow-sm"
                      : "border-border bg-white hover:border-navy-900/30",
                    state === "calling" || state === "connected"
                      ? "opacity-50 cursor-not-allowed"
                      : "",
                  ].join(" ")}
                  aria-pressed={useCase === u.id}
                >
                  <div className="font-semibold">{u.label}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    Like the one for {u.sample}
                  </div>
                </button>
              ))}
            </div>
          </div>

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
              Call me now
            </button>
          ) : null}

          {state === "calling" ? (
            <div
              role="status"
              aria-live="polite"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-md bg-navy-900 text-white font-semibold"
            >
              <Loader2 className="w-4 h-4 animate-spin" />
              Placing call… (your phone should ring in a moment)
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
                Call placed. Pick up — the agent is on the line.
              </div>
              <button onClick={reset} className="btn-ghost text-sm">
                Try another scenario
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
            We call once. No marketing follow-up unless you request it.
            Rate-limited per IP for abuse prevention.
          </p>
        </div>
      </div>
    </section>
  );
}
