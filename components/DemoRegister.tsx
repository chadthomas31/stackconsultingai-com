"use client";

import { useState } from "react";
import type { VerticalCopy } from "@/lib/verticals";

const DEMO_NUMBER_DISPLAY = "(949) 239-7925";
const DEMO_NUMBER_TEL = "+19492397925";

const VOICES = [
  { id: "cedar", label: "Cedar", note: "Warm, natural — recommended" },
  { id: "marin", label: "Marin", note: "Friendly, natural — recommended" },
  { id: "coral", label: "Coral", note: "Bright, upbeat" },
  { id: "sage", label: "Sage", note: "Calm, reassuring" },
  { id: "ash", label: "Ash", note: "Steady, professional" },
  { id: "ballad", label: "Ballad", note: "Smooth, easygoing" },
  { id: "verse", label: "Verse", note: "Expressive" },
  { id: "shimmer", label: "Shimmer", note: "Light, energetic" },
  { id: "alloy", label: "Alloy", note: "Neutral" },
  { id: "echo", label: "Echo", note: "Classic" },
];

export default function DemoRegister({ copy }: { copy: VerticalCopy }) {
  const [form, setForm] = useState({
    business_name: "",
    mobile: "",
    email: "",
    vertical: copy.id,
    voice: "cedar",
  });
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [playing, setPlaying] = useState<string | null>(null);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  function playVoice(id: string) {
    const a = new Audio(`/voice-samples/${id}.mp3`);
    setPlaying(id);
    a.onended = () => setPlaying(null);
    a.play().catch(() => setPlaying(null));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setError("");
    try {
      const res = await fetch("/api/try", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "Something went wrong.");
        setStatus("error");
        return;
      }
      setStatus("done");
    } catch {
      setError("Network error. Please try again.");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="text-center space-y-5">
        <div className="text-5xl">📞</div>
        <h2 className="text-2xl font-bold text-navy-900">You&apos;re set, {form.business_name}!</h2>
        <p className="text-slate-600">Your AI demo line is ready. Call it from this phone:</p>
        <a
          href={`tel:${DEMO_NUMBER_TEL}`}
          className="block text-3xl font-extrabold text-brand tracking-tight"
        >
          {DEMO_NUMBER_DISPLAY}
        </a>
        <p className="text-slate-500 text-sm">
          It answers as <span className="font-semibold text-navy-900">{form.business_name}</span>, books the
          appointment, and emails you a full summary of the call.
        </p>
        <a
          href={`tel:${DEMO_NUMBER_TEL}`}
          className="inline-block w-full rounded-md bg-brand hover:bg-brand-hover text-white font-bold py-4 text-lg transition"
        >
          Call {DEMO_NUMBER_DISPLAY}
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <Field label="Business name">
        <input required value={form.business_name} onChange={set("business_name")} placeholder={copy.bizPlaceholder} className="dr-input" />
      </Field>
      <Field label="Your mobile number">
        <input required type="tel" value={form.mobile} onChange={set("mobile")} placeholder="(949) 555-0123" className="dr-input" />
      </Field>
      <Field label="Your email (for the call summary)">
        <input required type="email" value={form.email} onChange={set("email")} placeholder="you@yourbusiness.com" className="dr-input" />
      </Field>
      <div>
        <span className="block text-sm font-medium text-slate-700 mb-1.5">Choose your receptionist&apos;s voice</span>
        <div className="grid grid-cols-1 gap-2 max-h-56 overflow-y-auto pr-1">
          {VOICES.map((v) => {
            const selected = form.voice === v.id;
            return (
              <div
                key={v.id}
                onClick={() => setForm((f) => ({ ...f, voice: v.id }))}
                className={`flex items-center gap-3 rounded-md border px-3 py-2.5 cursor-pointer transition ${
                  selected ? "border-brand bg-brand-soft" : "border-slate-200 bg-white"
                }`}
              >
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); playVoice(v.id); }}
                  className="shrink-0 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-brand"
                  aria-label={`Play ${v.label}`}
                >
                  {playing === v.id ? "♪" : "▶"}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-navy-900">{v.label}</div>
                  <div className="text-xs text-slate-500 truncate">{v.note}</div>
                </div>
                <div className={`shrink-0 w-4 h-4 rounded-full border-2 ${selected ? "border-brand bg-brand" : "border-slate-300"}`} />
              </div>
            );
          })}
        </div>
        <p className="text-xs text-slate-400 mt-1.5">Tap ▶ to hear each. Change it anytime.</p>
      </div>
      {status === "error" && <p className="text-rose-600 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={status === "saving"}
        className="w-full rounded-md bg-brand hover:bg-brand-hover disabled:opacity-60 text-white font-bold py-4 text-lg transition"
      >
        {status === "saving" ? "Setting up…" : "Get my AI demo line"}
      </button>
      <p className="text-center text-xs text-slate-400">
        Stack Consulting AI · Used only to run your demo. Calls are recorded for quality.
      </p>
      <style>{`.dr-input{width:100%;border-radius:0.375rem;background:#fff;border:1px solid #e2e2e2;padding:0.75rem 1rem;color:#00122e;outline:none}.dr-input:focus{border-color:#3e6aef}`}</style>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-slate-700 mb-1.5">{label}</span>
      {children}
    </label>
  );
}
