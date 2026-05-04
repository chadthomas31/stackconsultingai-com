"use client";

import { useState, type FormEvent } from "react";
import { Phone, PhoneOutgoing, CheckCircle2, AlertCircle } from "lucide-react";

type Stage = {
  id: string;
  label: string;
  detail: string;
};

type StreamState =
  | { kind: "idle" }
  | { kind: "running"; stages: Stage[] }
  | { kind: "done"; stages: Stage[] }
  | { kind: "error"; message: string };

const formatPhone = (raw: string) => {
  const d = raw.replace(/\D/g, "").slice(0, 10);
  if (d.length < 4) return d;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
};

export default function CallMeDemo() {
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<StreamState>({ kind: "idle" });

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (state.kind === "running") return;
    if (!consent) {
      setState({ kind: "error", message: "Please confirm consent to receive a call." });
      return;
    }
    const digits = phone.replace(/\D/g, "");
    if (digits.length !== 10) {
      setState({ kind: "error", message: "Enter a 10-digit US phone number." });
      return;
    }

    setState({ kind: "running", stages: [] });

    try {
      const res = await fetch("/api/demos/call", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ phone: digits }),
      });
      if (!res.ok || !res.body) {
        const text = await res.text().catch(() => "");
        setState({
          kind: "error",
          message: text || "We couldn't place the call. Try again in a minute.",
        });
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let stages: Stage[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop() ?? "";
        for (const evt of events) {
          const lines = evt.split("\n");
          const type = lines.find((l) => l.startsWith("event: "))?.slice(7);
          const dataLine = lines.find((l) => l.startsWith("data: "))?.slice(6);
          if (!type || !dataLine) continue;
          try {
            const data = JSON.parse(dataLine);
            if (type === "stage" && data.id && data.label) {
              stages = [...stages, { id: data.id, label: data.label, detail: data.detail ?? "" }];
              setState({ kind: "running", stages });
            } else if (type === "done") {
              setState({ kind: "done", stages });
            } else if (type === "error") {
              setState({ kind: "error", message: data.message ?? "Call failed." });
            }
          } catch {
            // ignore malformed event
          }
        }
      }
    } catch {
      setState({ kind: "error", message: "Network error. Please try again." });
    }
  };

  const reset = () => {
    setPhone("");
    setConsent(false);
    setState({ kind: "idle" });
  };

  return (
    <div className="border border-border rounded-lg bg-white shadow-[0_20px_40px_-24px_rgba(0,18,46,0.18)] overflow-hidden">
      {/* Header strip */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-soft/60">
        <div className="flex items-center gap-2">
          <span className="live-dot" aria-hidden="true" />
          <span className="text-xs font-mono uppercase tracking-wider text-navy-900/70">
            Call dispatch
          </span>
        </div>
        <span className="text-xs font-mono text-navy-900/50">stackconsultingai.com</span>
      </div>

      <div className="px-6 py-6 md:px-8 md:py-8">
        {state.kind !== "running" && state.kind !== "done" && (
          <form onSubmit={submit} className="space-y-5">
            <div>
              <label htmlFor="callme-phone" className="block text-sm font-medium text-navy-900 mb-2">
                Your US phone number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-900/50" aria-hidden="true" />
                <input
                  id="callme-phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(formatPhone(e.target.value))}
                  placeholder="(555) 123-4567"
                  className="w-full pl-10 pr-4 py-3 rounded-md border border-border bg-white text-navy-900 placeholder:text-navy-900/40 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition"
                  required
                />
              </div>
            </div>

            <label className="flex items-start gap-3 cursor-pointer text-sm text-navy-900/80">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-border text-brand focus:ring-brand"
              />
              <span>
                I consent to a one-time AI demo call to this number. No marketing follow-up
                without my permission.
              </span>
            </label>

            {state.kind === "error" && (
              <p className="flex items-start gap-2 text-sm text-[#c2410c]">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
                {state.message}
              </p>
            )}

            <button type="submit" className="btn-cta-call w-full sm:w-auto inline-flex items-center justify-center gap-2 text-base">
              <PhoneOutgoing className="w-4 h-4" aria-hidden="true" />
              Call me now
            </button>

            <p className="text-xs text-navy-900/50">
              Demo only. We log the number for rate-limit + fraud detection. Not sold.
            </p>
          </form>
        )}

        {(state.kind === "running" || state.kind === "done") && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-mono uppercase tracking-wider text-brand">
                  {state.kind === "done" ? "Call placed" : "Placing call"}
                </p>
                <p className="text-navy-900 font-medium mt-1">{phone}</p>
              </div>
              {state.kind === "done" && (
                <button onClick={reset} className="text-sm text-brand hover:underline font-medium">
                  Run again
                </button>
              )}
            </div>

            <ol className="space-y-2">
              {state.stages.map((s, i) => (
                <li
                  key={s.id}
                  className="ops-row ops-row-done flex items-start gap-3 px-3 py-2.5 rounded-md"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <CheckCircle2 className="w-4 h-4 text-brand mt-0.5 shrink-0" aria-hidden="true" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-navy-900">{s.label}</p>
                    {s.detail && <p className="text-xs text-navy-900/60 mt-0.5">{s.detail}</p>}
                  </div>
                </li>
              ))}
              {state.kind === "running" && (
                <li className="ops-row ops-row-active flex items-center gap-3 px-3 py-2.5 rounded-md">
                  <span className="ops-dot ops-dot-live" aria-hidden="true" />
                  <span className="text-sm text-navy-900/80">Working…</span>
                </li>
              )}
            </ol>

            {state.kind === "done" && (
              <p className="text-sm text-navy-900/70 pt-2 border-t border-border">
                Your phone should ring shortly. If it doesn&rsquo;t, check your number and try again.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
