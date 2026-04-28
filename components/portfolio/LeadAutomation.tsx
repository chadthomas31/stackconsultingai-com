"use client";

import { useState } from "react";
import { Send, Loader2, Mail, Hash, Database, CalendarCheck } from "lucide-react";

type Extracted = {
  priority: "high" | "medium" | "low";
  intent_category: string;
  summary: string;
  suggested_next_step: string;
  best_contact_method: string;
  estimated_deal_size_usd: number;
  tags: string[];
};

type Routing = {
  priority: string;
  estimated_deal_size_usd: number;
  next_step: string;
  fanout: { channel: string; action: string }[];
};

type ApiResponse = {
  extracted: Extracted;
  routing: Routing;
  usage: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
  timing_ms: { total: number };
  model: string;
};

const SAMPLES = [
  {
    label: "Hot inbound",
    name: "Sarah Chen",
    email: "sarah@dentalbright.com",
    message:
      "We're a 3-doctor dental practice in Irvine and we're missing 5-10 calls a day after hours. Need a real solution by end of month. What does an AI receptionist cost and can we be live before October 1st?",
  },
  {
    label: "Tire-kicker",
    name: "Random Person",
    email: "info@example.com",
    message: "How much does AI cost?",
  },
  {
    label: "Support question",
    name: "Mike",
    email: "mike@otherclient.com",
    message:
      "Hi Chad — my receptionist agent transferred a caller to voicemail this morning instead of my cell. Was that a config issue?",
  },
];

export default function LeadAutomation() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit(n: string, e: string, m: string) {
    if (!n.trim() || !e.trim() || !m.trim()) return;
    setLoading(true);
    setError(null);
    setResponse(null);
    try {
      const res = await fetch("/api/portfolio/lead-automation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: n, email: e, message: m }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Request failed.");
      } else {
        setResponse(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error.");
    } finally {
      setLoading(false);
    }
  }

  function loadSample(s: (typeof SAMPLES)[number]) {
    setName(s.name);
    setEmail(s.email);
    setMessage(s.message);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Form side */}
      <div className="rounded-md border border-border bg-white p-5">
        <div className="flex flex-wrap gap-2 mb-4">
          {SAMPLES.map((s) => (
            <button
              key={s.label}
              type="button"
              onClick={() => loadSample(s)}
              disabled={loading}
              className="text-xs px-2.5 py-1 rounded-md bg-soft border border-border text-navy-900 hover:border-navy-900/30 disabled:opacity-50 transition-colors"
            >
              Load: {s.label}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit(name, email, message);
          }}
          className="space-y-3"
        >
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground mb-1 block">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
              className="w-full px-3 py-2 rounded-md border border-border focus:outline-none focus:border-navy-900 text-sm"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground mb-1 block">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="w-full px-3 py-2 rounded-md border border-border focus:outline-none focus:border-navy-900 text-sm"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground mb-1 block">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              disabled={loading}
              rows={5}
              maxLength={1000}
              className="w-full px-3 py-2 rounded-md border border-border focus:outline-none focus:border-navy-900 text-sm resize-y"
            />
            <div className="text-[10px] text-muted-foreground mt-1 text-right">
              {message.length}/1000
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-accent w-full inline-flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            {loading ? (
              <Loader2 aria-hidden="true" className="w-4 h-4 animate-spin" />
            ) : (
              <Send aria-hidden="true" className="w-4 h-4" />
            )}
            Triage with GPT-4o-mini
          </button>
        </form>
      </div>

      {/* Output side */}
      <div className="rounded-md border border-border bg-white p-5 min-h-[24rem]">
        {!response && !error && !loading ? (
          <div className="h-full flex items-center justify-center text-center text-sm text-muted-foreground">
            Submit a lead to see the structured output + routing plan.
          </div>
        ) : null}

        {loading ? (
          <div className="h-full flex items-center justify-center">
            <Loader2 aria-hidden="true" className="w-6 h-6 animate-spin text-brand" />
          </div>
        ) : null}

        {error ? (
          <div className="p-4 rounded-md bg-red-50 border border-red-200 text-sm text-red-900">
            <strong>Error:</strong> {error}
          </div>
        ) : null}

        {response ? (
          <div className="space-y-5">
            {/* Priority badge + summary */}
            <div className="flex items-start gap-3">
              <PriorityBadge priority={response.extracted.priority} />
              <div className="flex-1">
                <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                  Summary
                </div>
                <p className="text-sm text-navy-900 leading-relaxed">
                  {response.extracted.summary}
                </p>
              </div>
            </div>

            {/* Extracted fields */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <Field
                label="Intent category"
                value={response.extracted.intent_category}
                mono
              />
              <Field
                label="Best contact method"
                value={response.extracted.best_contact_method}
              />
              <Field
                label="Est. deal size"
                value={`$${response.extracted.estimated_deal_size_usd.toLocaleString()}`}
              />
              <Field label="Tags" value={response.extracted.tags.join(", ")} />
            </div>

            {/* Suggested next step */}
            <div className="p-3 rounded-md bg-brand-soft border border-brand/20">
              <div className="text-[10px] uppercase tracking-wider text-brand-hover font-semibold mb-1">
                Suggested next step
              </div>
              <div className="text-sm text-navy-900">
                {response.extracted.suggested_next_step}
              </div>
            </div>

            {/* Routing fanout */}
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                Routing plan (simulated)
              </div>
              <ol className="space-y-2">
                {response.routing.fanout.map((step, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-xs"
                  >
                    <ChannelIcon channel={step.channel} />
                    <div>
                      <div className="font-mono text-navy-900 font-semibold">
                        {step.channel}
                      </div>
                      <div className="text-muted-foreground leading-relaxed">
                        {step.action}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* Telemetry */}
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-border">
              <Field label="Model" value={response.model} mono />
              <Field
                label="Total tokens"
                value={response.usage.total_tokens.toString()}
              />
              <Field
                label="Latency"
                value={`${response.timing_ms.total} ms`}
              />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const styles: Record<string, string> = {
    high: "bg-red-100 text-red-900 border-red-300",
    medium: "bg-amber-100 text-amber-900 border-amber-300",
    low: "bg-slate-100 text-slate-700 border-slate-300",
  };
  return (
    <span
      className={`shrink-0 inline-flex items-center px-2.5 py-1 rounded-md border text-[11px] font-semibold uppercase tracking-wider ${styles[priority] ?? styles.low}`}
    >
      {priority}
    </span>
  );
}

function Field({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">
        {label}
      </div>
      <div
        className={
          mono
            ? "font-mono text-navy-900 text-xs truncate"
            : "text-navy-900 text-xs"
        }
      >
        {value}
      </div>
    </div>
  );
}

function ChannelIcon({ channel }: { channel: string }) {
  const Icon = channel.startsWith("Slack")
    ? Hash
    : channel.startsWith("Email")
      ? Mail
      : channel.startsWith("Cal.com")
        ? CalendarCheck
        : Database;
  return (
    <div className="w-7 h-7 shrink-0 rounded-md bg-soft flex items-center justify-center text-navy-900">
      <Icon aria-hidden="true" className="w-3.5 h-3.5" />
    </div>
  );
}
