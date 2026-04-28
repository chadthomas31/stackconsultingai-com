"use client";

import { useState } from "react";
import { Send, Loader2 } from "lucide-react";

type Source = { ref: number; id: string; source: string; score: number };

type ApiResponse = {
  answer: string;
  sources: Source[];
  usage: {
    embed_tokens: number;
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  timing_ms: { embed: number; chat: number; total: number };
  embeddings_cache_hit: boolean;
  model: string;
};

const SAMPLE_QUESTIONS = [
  "How much does the AI Receptionist cost?",
  "What's the timeline for a Pilot deployment?",
  "What if my data needs to stay HIPAA-compliant?",
  "Do you serve clients outside Orange County?",
];

export default function KbChat() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function ask(q: string) {
    if (!q.trim()) return;
    setLoading(true);
    setError(null);
    setResponse(null);
    try {
      const res = await fetch("/api/portfolio/kb-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Request failed.");
      } else {
        setResponse(data);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-md border border-border bg-white">
      {/* Sample question chips */}
      <div className="flex flex-wrap gap-2 px-5 pt-5">
        {SAMPLE_QUESTIONS.map((q) => (
          <button
            key={q}
            type="button"
            disabled={loading}
            onClick={() => {
              setQuestion(q);
              ask(q);
            }}
            className="text-xs px-2.5 py-1 rounded-md bg-soft border border-border text-navy-900 hover:border-navy-900/30 disabled:opacity-50 transition-colors"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(question);
        }}
        className="flex gap-2 p-5 border-t border-border mt-5"
      >
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask anything about Stack Consulting AI's services..."
          className="flex-1 px-3 py-2 rounded-md border border-border focus:outline-none focus:border-navy-900 text-sm"
          maxLength={500}
          disabled={loading}
          aria-label="Question"
        />
        <button
          type="submit"
          disabled={loading || !question.trim()}
          className="btn-accent inline-flex items-center gap-2 text-sm disabled:opacity-50"
        >
          {loading ? (
            <Loader2 aria-hidden="true" className="w-4 h-4 animate-spin" />
          ) : (
            <Send aria-hidden="true" className="w-4 h-4" />
          )}
          Ask
        </button>
      </form>

      {/* Response */}
      {error ? (
        <div className="px-5 pb-5">
          <div className="p-4 rounded-md bg-red-50 border border-red-200 text-sm text-red-900">
            <strong>Error:</strong> {error}
          </div>
        </div>
      ) : null}

      {response ? (
        <div className="px-5 pb-5 space-y-4">
          {/* Answer */}
          <div className="p-4 rounded-md bg-soft border border-border">
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
              Answer
            </div>
            <div className="text-sm text-navy-900 leading-relaxed whitespace-pre-wrap">
              {response.answer}
            </div>
          </div>

          {/* Sources */}
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
              Retrieved sources (top {response.sources.length})
            </div>
            <ol className="space-y-1.5">
              {response.sources.map((s) => (
                <li
                  key={s.id}
                  className="flex items-baseline gap-3 text-xs font-mono"
                >
                  <span className="text-brand-hover font-semibold">
                    [{s.ref}]
                  </span>
                  <span className="text-navy-900">{s.source}</span>
                  <span className="text-muted-foreground tabular-nums ml-auto">
                    score {s.score.toFixed(4)}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          {/* Telemetry */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-border">
            <Telemetry label="Model" value={response.model} mono />
            <Telemetry
              label="Total tokens"
              value={response.usage.total_tokens.toString()}
            />
            <Telemetry
              label="Total latency"
              value={`${response.timing_ms.total} ms`}
            />
            <Telemetry
              label="Embed cache"
              value={response.embeddings_cache_hit ? "hit" : "cold"}
            />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Telemetry
              label="Embed tokens"
              value={response.usage.embed_tokens.toString()}
            />
            <Telemetry
              label="Prompt tokens"
              value={response.usage.prompt_tokens.toString()}
            />
            <Telemetry
              label="Completion tokens"
              value={response.usage.completion_tokens.toString()}
            />
            <Telemetry
              label="Embed/chat split"
              value={`${response.timing_ms.embed}/${response.timing_ms.chat} ms`}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Telemetry({
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
            ? "text-xs font-mono text-navy-900 truncate"
            : "text-sm text-navy-900 tabular-nums"
        }
      >
        {value}
      </div>
    </div>
  );
}
