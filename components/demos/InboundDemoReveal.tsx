"use client";

import { useRef, useState, type FormEvent } from "react";
import { Phone, PhoneCall, CheckCircle2, AlertCircle, Lock } from "lucide-react";

type State =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "revealed"; number: string; tel: string }
  | { kind: "error"; message: string };

const formatPhone = (raw: string) => {
  const d = raw.replace(/\D/g, "").slice(0, 10);
  if (d.length < 4) return d;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
};

export default function InboundDemoReveal() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [business, setBusiness] = useState("");
  const [state, setState] = useState<State>({ kind: "idle" });
  const inFlight = useRef(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (inFlight.current || state.kind === "submitting") return;
    inFlight.current = true;
    setState({ kind: "submitting" });
    try {
      const res = await fetch("/api/demos/reveal", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone: phone.replace(/\D/g, ""),
          businessName: business,
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.success) {
        setState({
          kind: "error",
          message: data?.error ?? "Something went wrong. Please try again.",
        });
        return;
      }
      setState({ kind: "revealed", number: data.number, tel: data.tel });
    } catch {
      setState({ kind: "error", message: "Network error. Please try again." });
    } finally {
      inFlight.current = false;
    }
  };

  const submitting = state.kind === "submitting";

  return (
    <div className="border border-border rounded-lg bg-white shadow-[0_20px_40px_-24px_rgba(0,18,46,0.18)] overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-soft/60">
        <div className="flex items-center gap-2">
          <span className="live-dot" aria-hidden="true" />
          <span className="text-xs font-mono uppercase tracking-wider text-navy-900/70">
            Live demo line
          </span>
        </div>
        <span className="text-xs font-mono text-navy-900/50">stackconsultingai.com</span>
      </div>

      <div className="px-6 py-6 md:px-8 md:py-8">
        {state.kind === "revealed" ? (
          <div className="space-y-5">
            <p className="flex items-center gap-2 text-sm font-mono uppercase tracking-wider text-brand">
              <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
              Your demo line is ready
            </p>
            <a
              href={`tel:${state.tel}`}
              className="btn-cta-call w-full inline-flex items-center justify-center gap-3 text-xl py-4"
            >
              <PhoneCall className="w-5 h-5" aria-hidden="true" />
              Call {state.number}
            </a>
            <p className="text-sm text-navy-900/70">
              Tap to call from your phone, or dial{" "}
              <strong className="text-navy-900">{state.number}</strong> on any line. You&rsquo;ll
              reach our AI receptionist — ask about services, pricing, or booking, and try talking
              over it. Best on a real cell, not speakerphone in a noisy room.
            </p>
            <p className="text-xs text-navy-900/50">
              Thanks, {name.split(" ")[0] || "there"} — we&rsquo;ll follow up at {email}.
            </p>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <p className="flex items-start gap-2 text-sm text-navy-900/70">
              <Lock className="w-4 h-4 mt-0.5 shrink-0 text-navy-900/40" aria-hidden="true" />
              Tell us who you are and we&rsquo;ll reveal the live demo number — call it and talk to
              the AI agent yourself.
            </p>

            <div>
              <label htmlFor="reveal-name" className="block text-sm font-medium text-navy-900 mb-1.5">
                Your name
              </label>
              <input
                id="reveal-name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Smith"
                className="w-full px-4 py-3 rounded-md border border-border bg-white text-navy-900 placeholder:text-navy-900/40 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition"
                disabled={submitting}
                required
              />
            </div>

            <div>
              <label htmlFor="reveal-email" className="block text-sm font-medium text-navy-900 mb-1.5">
                Work email
              </label>
              <input
                id="reveal-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@yourbusiness.com"
                className="w-full px-4 py-3 rounded-md border border-border bg-white text-navy-900 placeholder:text-navy-900/40 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition"
                disabled={submitting}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="reveal-business" className="block text-sm font-medium text-navy-900 mb-1.5">
                  Business <span className="text-navy-900/40 font-normal">(optional)</span>
                </label>
                <input
                  id="reveal-business"
                  type="text"
                  autoComplete="organization"
                  value={business}
                  onChange={(e) => setBusiness(e.target.value)}
                  placeholder="Acme HVAC"
                  className="w-full px-4 py-3 rounded-md border border-border bg-white text-navy-900 placeholder:text-navy-900/40 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition"
                  disabled={submitting}
                />
              </div>
              <div>
                <label htmlFor="reveal-phone" className="block text-sm font-medium text-navy-900 mb-1.5">
                  Phone <span className="text-navy-900/40 font-normal">(optional)</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-900/50" aria-hidden="true" />
                  <input
                    id="reveal-phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setPhone(formatPhone(e.target.value))}
                    placeholder="(555) 123-4567"
                    className="w-full pl-10 pr-4 py-3 rounded-md border border-border bg-white text-navy-900 placeholder:text-navy-900/40 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition"
                    disabled={submitting}
                  />
                </div>
              </div>
            </div>

            {state.kind === "error" && (
              <p className="flex items-start gap-2 text-sm text-[#c2410c]">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
                {state.message}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="btn-cta-call w-full sm:w-auto inline-flex items-center justify-center gap-2 text-base disabled:cursor-not-allowed disabled:opacity-60"
            >
              <PhoneCall className="w-4 h-4" aria-hidden="true" />
              {submitting ? "Revealing…" : "Reveal the demo number"}
            </button>

            <p className="text-xs text-navy-900/50">
              We use your info to follow up about your AI project. No spam, no resale.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
