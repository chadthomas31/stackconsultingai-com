"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import { Search, FileText, Quote, AlertCircle, BookOpen } from "lucide-react";

type Citation = {
  source: string;
  snippet: string;
  score: number;
};

type Turn =
  | { role: "user"; text: string }
  | { role: "assistant"; text: string; citations: Citation[]; pending?: boolean };

const SUGGESTED = [
  "What are the AI Receptionist Pilot and Production tiers?",
  "What's included in the Workflow Audit vs the Full AI Readiness Audit?",
  "How does Stack Consulting handle customer data privacy?",
  "How does the AI Receptionist compare to Smith.ai or Ruby?",
  "What's included in the free 30-minute assessment?",
];

export default function KbDemo() {
  const [question, setQuestion] = useState("");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, [turns]);

  const ask = async (text: string) => {
    if (!text.trim() || busy) return;
    setError(null);
    setBusy(true);
    setQuestion("");

    const userTurn: Turn = { role: "user", text };
    const assistantTurn: Turn = { role: "assistant", text: "", citations: [], pending: true };
    setTurns((prev) => [...prev, userTurn, assistantTurn]);

    try {
      const res = await fetch("/api/demos/kb", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ question: text }),
      });
      if (!res.ok || !res.body) {
        setError("Couldn't reach the retriever. Try again.");
        setBusy(false);
        setTurns((prev) => prev.slice(0, -1));
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let answer = "";
      let citations: Citation[] = [];

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
            if (data.kind === "citations") {
              citations = data.items as Citation[];
            } else if (data.kind === "token") {
              answer += data.text as string;
            } else if (data.kind === "done") {
              // finalize below
            } else if (data.kind === "error") {
              setError(data.message ?? "Retriever failed.");
            }
            setTurns((prev) => {
              const next = [...prev];
              next[next.length - 1] = {
                role: "assistant",
                text: answer,
                citations,
                pending: !(data.kind === "done"),
              };
              return next;
            });
          } catch {
            // ignore
          }
        }
      }

      setTurns((prev) => {
        const next = [...prev];
        const last = next[next.length - 1];
        if (last && last.role === "assistant") {
          next[next.length - 1] = { ...last, pending: false };
        }
        return next;
      });
    } catch {
      setError("Network error. Try again.");
      setTurns((prev) => prev.slice(0, -1));
    } finally {
      setBusy(false);
    }
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    ask(question);
  };

  return (
    <div className="border border-border rounded-lg bg-white shadow-[0_20px_40px_-24px_rgba(0,18,46,0.18)] overflow-hidden flex flex-col h-[560px]">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-soft/60">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-brand" aria-hidden="true" />
          <span className="text-xs font-mono uppercase tracking-wider text-navy-900/70">
            Sample SMB FAQ corpus
          </span>
        </div>
        <span className="text-xs font-mono text-navy-900/50">10 topics · real embeddings</span>
      </div>

      {/* Transcript */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
        {turns.length === 0 && (
          <div className="space-y-4">
            <p className="text-sm text-navy-900/60 leading-relaxed">
              Ask anything about Stack Consulting&rsquo;s services. Answers cite the
              chunk they came from. If the corpus doesn&rsquo;t cover it, the agent says so.
            </p>
            <ul className="space-y-2">
              {SUGGESTED.map((q) => (
                <li key={q}>
                  <button
                    type="button"
                    onClick={() => ask(q)}
                    className="group w-full text-left flex items-start gap-2 px-3 py-2 rounded-md border border-border hover:border-navy-900 hover:bg-soft transition"
                  >
                    <Search className="w-3.5 h-3.5 text-navy-900/40 mt-1 shrink-0 group-hover:text-brand transition" aria-hidden="true" />
                    <span className="text-sm text-navy-900">{q}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {turns.map((t, i) =>
          t.role === "user" ? (
            <div key={i} className="flex justify-end">
              <p className="bg-navy-900 text-white text-sm px-4 py-2.5 rounded-md max-w-[85%] leading-relaxed">
                {t.text}
              </p>
            </div>
          ) : (
            <div key={i} className="space-y-3">
              <div className="text-sm text-navy-900 leading-relaxed whitespace-pre-wrap">
                {t.text || (
                  <span className="text-navy-900/50 italic">Retrieving…</span>
                )}
                {t.pending && t.text && (
                  <span className="inline-block ml-1 w-2 h-4 bg-brand align-middle animate-pulse motion-reduce:animate-none" aria-hidden="true" />
                )}
              </div>

              {t.citations.length > 0 && (
                <ul className="space-y-1.5">
                  {t.citations.map((c, j) => (
                    <li
                      key={j}
                      className="flex items-start gap-2 text-xs text-navy-900/70 px-3 py-2 rounded-md bg-soft border border-border"
                    >
                      <Quote className="w-3 h-3 text-brand mt-0.5 shrink-0" aria-hidden="true" />
                      <div className="flex-1 min-w-0">
                        <p className="font-mono text-[10px] uppercase tracking-wider text-brand mb-0.5">
                          {c.source} · {(c.score * 100).toFixed(0)}% match
                        </p>
                        <p className="leading-relaxed">{c.snippet}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ),
        )}

        {error && (
          <p className="flex items-start gap-2 text-sm text-[#c2410c]">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
            {error}
          </p>
        )}
      </div>

      {/* Composer */}
      <form
        onSubmit={submit}
        className="flex items-center gap-2 px-4 py-3 border-t border-border bg-white"
      >
        <FileText className="w-4 h-4 text-navy-900/40" aria-hidden="true" />
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask the corpus…"
          disabled={busy}
          className="flex-1 px-2 py-2 bg-transparent text-sm text-navy-900 placeholder:text-navy-900/40 focus:outline-none disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={busy || !question.trim()}
          className="btn-cta-call text-sm py-2 px-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Ask
        </button>
      </form>
    </div>
  );
}
