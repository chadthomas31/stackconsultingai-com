"use client";

import { useState, type FormEvent } from "react";
import { Send, Sparkles, CheckCircle2, AlertCircle, MessageSquare, Mail } from "lucide-react";

type AgentEvent =
  | { kind: "thought"; text: string }
  | { kind: "field"; key: string; value: string }
  | { kind: "summary"; text: string }
  | { kind: "notify"; channel: "discord" | "email"; ok: boolean; reason?: string };

type State =
  | { kind: "idle" }
  | { kind: "running"; events: AgentEvent[] }
  | { kind: "done"; events: AgentEvent[] }
  | { kind: "error"; message: string };

const SAMPLE_PROMPTS = [
  {
    label: "Plumbing emergency at 11pm",
    business: "Sunset Plumbing",
    name: "Maria Lopez",
    email: "maria@example.com",
    phone: "(949) 555-0142",
    problem:
      "Water is pouring from the ceiling in my master bath. I shut off the main but I need someone tonight. I'm in San Clemente.",
  },
  {
    label: "Slow website + AI questions",
    business: "Coastal Wellness Studio",
    name: "Devon K.",
    email: "devon@coastalwellness.example",
    phone: "",
    problem:
      "My Squarespace site is slow and Google says I have a Core Web Vitals problem. Also wondering if AI can answer client intake questions before they book.",
  },
  {
    label: "Vague tire-kicker",
    business: "",
    name: "Anonymous",
    email: "curious@example.com",
    phone: "",
    problem: "How much does it cost?",
  },
];

export default function LeadAgentDemo() {
  const [name, setName] = useState("");
  const [business, setBusiness] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [problem, setProblem] = useState("");
  const [state, setState] = useState<State>({ kind: "idle" });

  const loadSample = (i: number) => {
    const s = SAMPLE_PROMPTS[i];
    setName(s.name);
    setBusiness(s.business);
    setEmail(s.email);
    setPhone(s.phone);
    setProblem(s.problem);
    setState({ kind: "idle" });
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (state.kind === "running") return;
    if (problem.trim().length < 10) {
      setState({ kind: "error", message: "Add a sentence or two about the problem." });
      return;
    }
    if (!email.trim() || !/.+@.+\..+/.test(email)) {
      setState({ kind: "error", message: "Add an email so the owner can reply." });
      return;
    }
    setState({ kind: "running", events: [] });

    try {
      const res = await fetch("/api/demos/notify", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, business, email, phone, problem }),
      });
      if (!res.ok || !res.body) {
        setState({ kind: "error", message: "Couldn't reach the agent. Try again." });
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let events: AgentEvent[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const chunks = buffer.split("\n\n");
        buffer = chunks.pop() ?? "";
        for (const chunk of chunks) {
          const dataLine = chunk
            .split("\n")
            .find((l) => l.startsWith("data: "))
            ?.slice(6);
          if (!dataLine) continue;
          try {
            const data = JSON.parse(dataLine);
            if (data.kind === "done") {
              setState({ kind: "done", events });
            } else if (data.kind === "error") {
              setState({ kind: "error", message: data.message ?? "Agent failed." });
            } else {
              events = [...events, data as AgentEvent];
              setState({ kind: "running", events });
            }
          } catch {
            // ignore
          }
        }
      }

      // If we exited the read loop without an explicit done, finalize.
      setState((prev) => (prev.kind === "running" ? { kind: "done", events: prev.events } : prev));
    } catch {
      setState({ kind: "error", message: "Network error. Try again." });
    }
  };

  const reset = () => {
    setName("");
    setBusiness("");
    setEmail("");
    setPhone("");
    setProblem("");
    setState({ kind: "idle" });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border rounded-lg overflow-hidden border border-border shadow-[0_20px_40px_-24px_rgba(0,18,46,0.18)]">
      {/* Form pane */}
      <div className="bg-white p-6 md:p-8">
        <div className="flex items-center justify-between mb-5">
          <span className="text-xs font-mono uppercase tracking-wider text-navy-900/70">
            Inbound form
          </span>
          <button
            type="button"
            onClick={reset}
            className="text-xs text-navy-900/50 hover:text-navy-900 transition"
          >
            Clear
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label htmlFor="lead-name" className="block text-xs font-medium text-navy-900/70 mb-1.5">
              Name
            </label>
            <input
              id="lead-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Maria Lopez"
              className="w-full px-3 py-2.5 rounded-md border border-border bg-white text-navy-900 placeholder:text-navy-900/40 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition text-sm"
            />
          </div>
          <div>
            <label htmlFor="lead-biz" className="block text-xs font-medium text-navy-900/70 mb-1.5">
              Business (optional)
            </label>
            <input
              id="lead-biz"
              value={business}
              onChange={(e) => setBusiness(e.target.value)}
              placeholder="Sunset Plumbing"
              className="w-full px-3 py-2.5 rounded-md border border-border bg-white text-navy-900 placeholder:text-navy-900/40 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition text-sm"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="lead-email" className="block text-xs font-medium text-navy-900/70 mb-1.5">
                Email
              </label>
              <input
                id="lead-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-3 py-2.5 rounded-md border border-border bg-white text-navy-900 placeholder:text-navy-900/40 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition text-sm"
              />
            </div>
            <div>
              <label htmlFor="lead-phone" className="block text-xs font-medium text-navy-900/70 mb-1.5">
                Phone (optional)
              </label>
              <input
                id="lead-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(949) 555-0100"
                className="w-full px-3 py-2.5 rounded-md border border-border bg-white text-navy-900 placeholder:text-navy-900/40 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition text-sm"
              />
            </div>
          </div>
          <div>
            <label htmlFor="lead-problem" className="block text-xs font-medium text-navy-900/70 mb-1.5">
              What&rsquo;s the problem?
            </label>
            <textarea
              id="lead-problem"
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              rows={4}
              placeholder="Describe the situation in your own words…"
              className="w-full px-3 py-2.5 rounded-md border border-border bg-white text-navy-900 placeholder:text-navy-900/40 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition text-sm resize-none"
              required
            />
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {SAMPLE_PROMPTS.map((s, i) => (
              <button
                key={s.label}
                type="button"
                onClick={() => loadSample(i)}
                className="text-xs px-2.5 py-1 rounded-full border border-border bg-white hover:border-navy-900 hover:bg-soft text-navy-900/70 hover:text-navy-900 transition"
              >
                {s.label}
              </button>
            ))}
          </div>

          {state.kind === "error" && (
            <p className="flex items-start gap-2 text-sm text-[#c2410c]">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
              {state.message}
            </p>
          )}

          <button
            type="submit"
            disabled={state.kind === "running"}
            className="btn-cta-call w-full inline-flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" aria-hidden="true" />
            {state.kind === "running" ? "Routing…" : "Submit lead"}
          </button>
        </form>
      </div>

      {/* Agent trace pane */}
      <div className="bg-soft p-6 md:p-8">
        <div className="flex items-center gap-2 mb-5">
          <Sparkles className="w-4 h-4 text-brand" aria-hidden="true" />
          <span className="text-xs font-mono uppercase tracking-wider text-navy-900/70">
            Agent trace
          </span>
        </div>

        {state.kind === "idle" && (
          <p className="text-sm text-navy-900/60 leading-relaxed">
            Submit a lead — or click a sample tag — and the agent&rsquo;s
            reasoning, extracted fields, and downstream notifications will appear here in
            real time.
          </p>
        )}

        {(state.kind === "running" || state.kind === "done") && (
          <ol className="space-y-2">
            {state.events.map((evt, i) => (
              <li
                key={i}
                className="ops-row ops-row-done px-3 py-2 rounded-md text-sm"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {evt.kind === "thought" && (
                  <p className="text-navy-900/80 italic">&ldquo;{evt.text}&rdquo;</p>
                )}
                {evt.kind === "field" && (
                  <p className="font-mono text-xs">
                    <span className="text-brand">{evt.key}</span>
                    <span className="text-navy-900/40"> = </span>
                    <span className="text-navy-900">{evt.value}</span>
                  </p>
                )}
                {evt.kind === "summary" && (
                  <div>
                    <p className="text-xs uppercase tracking-wider text-navy-900/50 mb-1">
                      Summary
                    </p>
                    <p className="text-navy-900">{evt.text}</p>
                  </div>
                )}
                {evt.kind === "notify" && (
                  <p className="flex items-center gap-2">
                    {evt.channel === "discord" ? (
                      <MessageSquare className="w-4 h-4 text-brand" aria-hidden="true" />
                    ) : (
                      <Mail className="w-4 h-4 text-brand" aria-hidden="true" />
                    )}
                    <span className="text-navy-900">
                      {evt.ok ? `Posted to ${evt.channel}` : `${evt.channel} skipped${evt.reason ? ` — ${evt.reason}` : ""}`}
                    </span>
                    {evt.ok ? (
                      <CheckCircle2 className="w-4 h-4 text-brand" aria-hidden="true" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-navy-900/40" aria-hidden="true" />
                    )}
                  </p>
                )}
              </li>
            ))}
            {state.kind === "running" && (
              <li className="ops-row ops-row-active flex items-center gap-2 px-3 py-2 rounded-md">
                <span className="ops-dot ops-dot-live" aria-hidden="true" />
                <span className="text-sm text-navy-900/70">Thinking…</span>
              </li>
            )}
          </ol>
        )}

        {state.kind === "error" && (
          <p className="text-sm text-[#c2410c]">{state.message}</p>
        )}
      </div>
    </div>
  );
}
