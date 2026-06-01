"use client";

import { useState } from "react";

const DEMO_NUMBER = "(949) 239-7925";

const VERTICALS = [
  { id: "auto", label: "Auto Repair" },
  { id: "plumbing", label: "Plumbing" },
  { id: "hvac", label: "HVAC" },
  { id: "medspa", label: "Med Spa" },
];

export default function TryPage() {
  const [form, setForm] = useState({ business_name: "", mobile: "", email: "", vertical: "auto" });
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [error, setError] = useState("");

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

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

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-5 py-12">
      <div className="w-full max-w-md">
        {status === "done" ? (
          <div className="text-center space-y-6">
            <div className="text-5xl">📞</div>
            <h1 className="text-2xl font-bold">You&apos;re set, {form.business_name}!</h1>
            <p className="text-slate-300">
              Now call{" "}
              <a href={`tel:+19492397925`} className="font-bold text-emerald-400 whitespace-nowrap">
                {DEMO_NUMBER}
              </a>{" "}
              from <span className="font-semibold text-white">this phone</span>.
            </p>
            <p className="text-slate-400 text-sm">
              Your AI receptionist will answer as <span className="text-white">{form.business_name}</span>, book the
              appointment, and email you a full summary of the call.
            </p>
            <a
              href="tel:+19492397925"
              className="inline-block w-full rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-4 text-lg transition"
            >
              Call {DEMO_NUMBER}
            </a>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold leading-tight">Hear your AI receptionist</h1>
              <p className="text-slate-400 mt-2">
                30 seconds to set up. Then call our demo line and it answers as your business.
              </p>
            </div>
            <form onSubmit={submit} className="space-y-4">
              <Field label="Business name">
                <input
                  required
                  value={form.business_name}
                  onChange={set("business_name")}
                  placeholder="Mike's Auto Repair"
                  className="input"
                />
              </Field>
              <Field label="Your industry">
                <select value={form.vertical} onChange={set("vertical")} className="input">
                  {VERTICALS.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Your mobile number">
                <input
                  required
                  type="tel"
                  value={form.mobile}
                  onChange={set("mobile")}
                  placeholder="(949) 555-0123"
                  className="input"
                />
              </Field>
              <Field label="Your email (for the call summary)">
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={set("email")}
                  placeholder="you@yourshop.com"
                  className="input"
                />
              </Field>
              {status === "error" && <p className="text-rose-400 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={status === "saving"}
                className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-slate-950 font-bold py-4 text-lg transition"
              >
                {status === "saving" ? "Setting up…" : "Set up my demo"}
              </button>
              <p className="text-center text-xs text-slate-500">
                Stack Consulting AI · We only use this to run your demo. Calls are recorded for quality.
              </p>
            </form>
          </>
        )}
      </div>
      <style>{`
        .input {
          width: 100%;
          border-radius: 0.75rem;
          background: rgb(15 23 42);
          border: 1px solid rgb(51 65 85);
          padding: 0.75rem 1rem;
          color: white;
          outline: none;
        }
        .input:focus { border-color: rgb(16 185 129); }
      `}</style>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-slate-300 mb-1.5">{label}</span>
      {children}
    </label>
  );
}
