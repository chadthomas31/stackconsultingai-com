"use client";

import { useState, useEffect, type FormEvent } from "react";
import { ArrowRight, Phone, MessageSquare, Check } from "lucide-react";
import type { Vertical } from "@/lib/voice-agents";

interface Props {
  vertical: Vertical;
  displayName: string;
}

type Stage = "form" | "verify" | "revealed";

interface RevealPayload {
  did: string;
  dialString: string;
}

export default function VerticalDemoFunnel({ vertical, displayName }: Props) {
  const [stage, setStage] = useState<Stage>("form");
  const [leadId, setLeadId] = useState<string | null>(null);
  const [reveal, setReveal] = useState<RevealPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [firstName, setFirstName] = useState("");
  const [bizName, setBizName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");

  // Verify state
  const [code, setCode] = useState("");

  async function onSubmitForm(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email || !mobile) {
      setError("Email and mobile are required");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/demos/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vertical,
          firstName,
          bizName,
          email,
          mobile,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.leadId) {
        setError(json.error ?? `Submit failed (${res.status})`);
        setSubmitting(false);
        return;
      }
      setLeadId(json.leadId);
      setStage("verify");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setSubmitting(false);
    }
  }

  async function onSubmitVerify(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!leadId) {
      setError("Missing lead — refresh and try again");
      return;
    }
    if (!/^\d{6}$/.test(code)) {
      setError("Code must be 6 digits");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/demos/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId, code }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.did) {
        setError(json.error ?? `Verify failed (${res.status})`);
        setSubmitting(false);
        return;
      }
      setReveal({ did: json.did, dialString: json.dialString });
      setStage("revealed");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-md border border-border bg-white p-6 md:p-8 shadow-sm">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xs uppercase tracking-wide text-brand font-semibold">
          Live demo
        </span>
        <span className="text-xs text-navy-900/40">·</span>
        <span className="text-xs text-navy-900/60">{displayName}</span>
      </div>
      <h3 className="font-heading text-2xl md:text-3xl font-bold text-navy-900 mb-4">
        {stage === "form" && "Try the live agent"}
        {stage === "verify" && "Check your phone"}
        {stage === "revealed" && "Call the number now"}
      </h3>

      {/* FORM */}
      {stage === "form" && (
        <form onSubmit={onSubmitForm} className="space-y-4">
          <p className="text-navy-900/70 text-sm leading-relaxed mb-2">
            We&rsquo;ll text you a 6-digit code, then reveal the demo number. The
            call is recorded for your follow-up report. About 3 minutes.
          </p>

          <Field
            label="First name"
            id="vd-first-name"
            value={firstName}
            onChange={setFirstName}
            placeholder="Chad"
          />
          <Field
            label="Business name"
            id="vd-biz-name"
            value={bizName}
            onChange={setBizName}
            placeholder="Acme HVAC"
          />
          <Field
            label="Email"
            id="vd-email"
            type="email"
            required
            value={email}
            onChange={setEmail}
            placeholder="you@yourshop.com"
          />
          <Field
            label="Mobile (for SMS code)"
            id="vd-mobile"
            type="tel"
            required
            value={mobile}
            onChange={setMobile}
            placeholder="(949) 555-0123"
            hint="US numbers only. We&rsquo;ll text a one-time code."
          />

          {error && <ErrorBox text={error} />}

          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md bg-brand text-white font-medium hover:bg-brand-hover transition-colors disabled:opacity-60"
          >
            {submitting ? "Sending…" : "Text me the code"}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>

          <p className="text-xs text-navy-900/50 pt-2 leading-relaxed">
            By submitting you agree to receive a one-time SMS code + a call-report
            email after your demo. We&rsquo;ll never sell your info. Calls are
            recorded for the report (California two-party consent).
          </p>
        </form>
      )}

      {/* VERIFY */}
      {stage === "verify" && (
        <form onSubmit={onSubmitVerify} className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-navy-900/75 mb-2">
            <MessageSquare className="w-4 h-4 text-brand" aria-hidden="true" />
            <span>
              Code sent to <span className="font-medium">{mobile}</span>. Check
              your messages.
            </span>
          </div>

          <Field
            label="6-digit code"
            id="vd-code"
            value={code}
            onChange={(v) => setCode(v.replace(/[^\d]/g, "").slice(0, 6))}
            placeholder="000000"
            inputMode="numeric"
            autoComplete="one-time-code"
          />

          {error && <ErrorBox text={error} />}

          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md bg-brand text-white font-medium hover:bg-brand-hover transition-colors disabled:opacity-60"
          >
            {submitting ? "Verifying…" : "Reveal the demo number"}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => setStage("form")}
            className="block text-xs text-navy-900/60 hover:text-navy-900 underline-offset-2 hover:underline"
          >
            Wrong number? Go back.
          </button>
        </form>
      )}

      {/* REVEALED */}
      {stage === "revealed" && reveal && (
        <RevealPanel
          did={reveal.did}
          dialString={reveal.dialString}
          displayName={displayName}
        />
      )}
    </div>
  );
}

function Field(props: {
  label: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  hint?: string;
  inputMode?: "numeric" | "text" | "email" | "tel";
  autoComplete?: string;
}) {
  return (
    <label htmlFor={props.id} className="block">
      <span className="block text-sm font-medium text-navy-900 mb-1.5">
        {props.label}
        {props.required && <span className="text-brand">{" "}*</span>}
      </span>
      <input
        id={props.id}
        type={props.type ?? "text"}
        required={props.required}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        placeholder={props.placeholder}
        inputMode={props.inputMode}
        autoComplete={props.autoComplete}
        className="w-full px-3 py-2.5 rounded-md border border-border bg-white text-navy-900 placeholder:text-navy-900/40 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
      />
      {props.hint && (
        <span
          className="block text-xs text-navy-900/55 mt-1.5"
          dangerouslySetInnerHTML={{ __html: props.hint }}
        />
      )}
    </label>
  );
}

function ErrorBox({ text }: { text: string }) {
  return (
    <div className="px-3 py-2 rounded-md border border-red-200 bg-red-50 text-sm text-red-700">
      {text}
    </div>
  );
}

function RevealPanel({
  did,
  dialString,
  displayName,
}: {
  did: string;
  dialString: string;
  displayName: string;
}) {
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  useEffect(() => {
    // Visual nudge: 5-minute window before the page tells them to refresh
    setSecondsLeft(300);
    const id = setInterval(() => {
      setSecondsLeft((s) => (s === null ? null : Math.max(0, s - 1)));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="space-y-5">
      <div className="rounded-md border border-border bg-soft p-5">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-navy-900/60 font-semibold mb-2">
          <Check className="w-4 h-4 text-brand" aria-hidden="true" />
          Verified — {displayName} demo line ready
        </div>
        <a
          href={`tel:${dialString}`}
          className="block font-heading text-3xl md:text-4xl font-bold tracking-tight text-navy-900 hover:text-brand transition-colors"
        >
          {did}
        </a>
        <div className="text-sm text-navy-900/65 mt-2">
          Tap to dial · or punch it into your phone now
        </div>
      </div>

      <a
        href={`tel:${dialString}`}
        className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md bg-brand text-white font-medium hover:bg-brand-hover transition-colors"
      >
        <Phone className="w-4 h-4" aria-hidden="true" />
        Call the demo now
      </a>

      <div className="rounded-md border border-border bg-white p-4 text-sm text-navy-900/75 leading-relaxed">
        <p className="font-medium text-navy-900 mb-1">What happens next:</p>
        <ol className="space-y-1.5 pl-4 list-decimal">
          <li>Agent answers, starts with the recording disclosure.</li>
          <li>You play the role of a customer for ~2&ndash;3 minutes.</li>
          <li>You hang up.</li>
          <li>~90 seconds later, your call-report email lands.</li>
        </ol>
      </div>

      {secondsLeft !== null && secondsLeft > 0 && (
        <div className="text-xs text-navy-900/45">
          Demo line active for the next{" "}
          {Math.floor(secondsLeft / 60)}m {secondsLeft % 60}s.
        </div>
      )}
      {secondsLeft === 0 && (
        <div className="text-xs text-amber-700">
          Window closed — refresh and request a new code if you still want to demo.
        </div>
      )}
    </div>
  );
}
