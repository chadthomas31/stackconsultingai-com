"use client";

import { useState } from "react";
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  Copy,
  Download,
  ExternalLink,
  Wand2,
  Send,
  RefreshCw,
} from "lucide-react";

interface DraftResponse {
  ok: boolean;
  error?: string;
  videoUrl?: string;
  meta?: {
    title: string | null;
    channel: string | null;
    publishedAt?: string | null;
    durationSeconds?: number | null;
  };
  transcriptWordCount?: number;
  source?: "gemini+transcript" | "transcript-only";
  reposExtracted?: number | null;
  mode?: "auto" | "transcript-only" | "always-gemini";
  auditReason?: string;
  estimatedGeminiCost?: number | null;
  resolvedFrom?: "video-url" | "bare-id" | "channel-latest";
  channelHandle?: string | null;
  channelTitle?: string | null;
  latestVideoTitle?: string | null;
  draft?: {
    subject: string;
    preheader: string;
    markdown_body: string;
  };
}

export default function NewsletterGeneratorPage() {
  const [secret, setSecret] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [customInstructions, setCustomInstructions] = useState("");
  const [mode, setMode] = useState<
    "auto" | "transcript-only" | "always-gemini"
  >("auto");
  const [auditPreview, setAuditPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );
  const [error, setError] = useState<string>("");
  const [result, setResult] = useState<DraftResponse | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [progressStage, setProgressStage] = useState<string>("");
  const [publishStatus, setPublishStatus] = useState<
    "idle" | "publishing" | "published" | "error"
  >("idle");
  const [publishError, setPublishError] = useState<string>("");
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);
  const [publishedIssueNumber, setPublishedIssueNumber] = useState<
    number | null
  >(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    setResult(null);
    setProgressStage("starting");
    setAuditPreview(null);
    setPublishStatus("idle");
    setPublishError("");
    setPublishedUrl(null);
    setPublishedIssueNumber(null);

    try {
      const res = await fetch("/api/newsletter/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": secret,
          Accept: "text/event-stream",
        },
        body: JSON.stringify({
          videoUrl: videoUrl.trim(),
          customInstructions: customInstructions.trim() || undefined,
          mode,
        }),
        signal: AbortSignal.timeout(360000),
      });

      if (!res.ok || !res.body) {
        const preview = (await res.text())
          .replace(/<[^>]+>/g, " ")
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 220);
        setError(
          `Server returned ${res.status} ${res.statusText}. ${preview || "(empty body)"}`,
        );
        setStatus("error");
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let final: DraftResponse | null = null;
      let streamError: string | null = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const frames = buffer.split("\n\n");
        buffer = frames.pop() ?? "";
        for (const frame of frames) {
          if (!frame.startsWith("data: ")) continue;
          const payload = frame.slice(6);
          let event: Record<string, unknown>;
          try {
            event = JSON.parse(payload);
          } catch {
            continue;
          }
          if (event.type === "progress") {
            setProgressStage(String(event.stage ?? ""));
            if (event.stage === "audit-complete" && event.reason) {
              setAuditPreview(String(event.reason));
            }
          } else if (event.type === "error") {
            streamError = String(event.error ?? "Generation failed");
          } else if (event.type === "done") {
            final = event as unknown as DraftResponse;
          }
        }
      }

      if (streamError) {
        setError(streamError);
        setStatus("error");
        return;
      }
      if (!final) {
        setError(
          "Stream ended without a final draft. Check the Vercel function log.",
        );
        setStatus("error");
        return;
      }
      setResult(final);
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
      setStatus("error");
    }
  }

  const progressLabels: Record<string, string> = {
    starting: "Starting…",
    "resolving-url": "Resolving YouTube URL…",
    resolved: "Video resolved",
    "fetching-metadata-and-captions": "Fetching captions + duration…",
    "audit-complete": "Audit complete — deciding whether to run Gemini…",
    "running-gemini": "Gemini is watching the video (this is the long step)…",
    "analysis-done": "Video analyzed — writing newsletter with Claude…",
    "writing-newsletter": "Claude is drafting the newsletter…",
  };

  async function handlePublish() {
    if (!result?.draft) return;
    setPublishStatus("publishing");
    setPublishError("");
    try {
      const res = await fetch("/api/newsletter/publish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": secret,
        },
        body: JSON.stringify({
          subject: result.draft.subject,
          preheader: result.draft.preheader,
          markdown_body: result.draft.markdown_body,
          source_video_id: result.videoUrl
            ? new URL(result.videoUrl).searchParams.get("v")
            : null,
          source_video_url: result.videoUrl,
          source_video_title: result.meta?.title,
          source_channel: result.meta?.channel,
          source_published_at: result.meta?.publishedAt ?? null,
        }),
        signal: AbortSignal.timeout(30000),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setPublishError(data.error || "Publish failed.");
        setPublishStatus("error");
        return;
      }
      setPublishedUrl(data.url);
      setPublishedIssueNumber(data.issue_number);
      setPublishStatus("published");
    } catch (err) {
      setPublishError(err instanceof Error ? err.message : "Network error");
      setPublishStatus("error");
    }
  }

  function resetForNextRun() {
    setStatus("idle");
    setError("");
    setResult(null);
    setVideoUrl("");
    setCustomInstructions("");
    setPublishStatus("idle");
    setPublishError("");
    setPublishedUrl(null);
    setPublishedIssueNumber(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function copyToClipboard(text: string, field: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 1800);
    });
  }

  function downloadMarkdown() {
    if (!result?.draft) return;
    const date = new Date().toISOString().slice(0, 10);
    const safeTitle = result.meta?.title
      ? result.meta.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase().slice(0, 40)
      : "newsletter";
    const frontmatter = `---
subject: ${result.draft.subject.replace(/"/g, "'")}
preheader: ${result.draft.preheader.replace(/"/g, "'")}
source_url: ${result.videoUrl}
generated: ${new Date().toISOString()}
---

`;
    const blob = new Blob([frontmatter + result.draft.markdown_body], {
      type: "text/markdown",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${date}-${safeTitle}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="min-h-screen bg-white text-navy-900 pb-24">
      <div className="max-w-3xl mx-auto px-4 pt-16">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand/10 border border-brand/25 text-brand text-xs font-semibold tracking-[0.16em] uppercase mb-5">
          <Wand2 className="w-3 h-3" />
          Admin Tool
        </div>
        <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Newsletter Generator
        </h1>
        <p className="text-lg text-muted-foreground mb-10 max-w-2xl">
          Paste a YouTube URL. We pull the captions, send them through Claude
          with The Stack Report&apos;s voice guide, and hand you back a
          ready-to-paste newsletter draft.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5 mb-12">
          <div>
            <label className="block text-sm font-semibold mb-2">
              Admin secret
            </label>
            <input
              type="password"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder="NEWSLETTER_ADMIN_SECRET value"
              required
              className="w-full px-4 py-3 rounded-md border border-border bg-white focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">
              YouTube URL
            </label>
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="Video URL or channel (e.g., https://youtube.com/@GithubAwesome)"
              required
              className="w-full px-4 py-3 rounded-md border border-border bg-white focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none"
            />
            <p className="text-xs text-muted-foreground mt-1.5">
              Paste a single video URL, or a channel URL — we&apos;ll grab the
              channel&apos;s latest upload automatically.
            </p>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">
              Custom instructions{" "}
              <span className="text-muted-foreground font-normal">
                (optional)
              </span>
            </label>
            <textarea
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
              placeholder="e.g., 'Highlight tools that save marketing teams time.' Leave blank for default."
              rows={3}
              className="w-full px-4 py-3 rounded-md border border-border bg-white focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none resize-y"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Generation mode
            </label>
            <div className="grid gap-2 md:grid-cols-3">
              {[
                {
                  value: "auto",
                  label: "Auto (recommended)",
                  hint: "Audit decides. Skips Gemini when captions are enough.",
                },
                {
                  value: "transcript-only",
                  label: "Transcript only",
                  hint: "Free + fast. Good for talking-head videos.",
                },
                {
                  value: "always-gemini",
                  label: "Always Gemini",
                  hint: "~$0.10 / video. Best for demo-heavy visual content.",
                },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className={`cursor-pointer rounded-md border p-3 transition-colors ${
                    mode === opt.value
                      ? "border-brand bg-brand/5"
                      : "border-border hover:border-brand/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="mode"
                    value={opt.value}
                    checked={mode === opt.value}
                    onChange={(e) =>
                      setMode(e.target.value as typeof mode)
                    }
                    className="sr-only"
                  />
                  <div className="text-sm font-semibold mb-1">{opt.label}</div>
                  <div className="text-xs text-muted-foreground leading-snug">
                    {opt.hint}
                  </div>
                </label>
              ))}
            </div>
          </div>
          <button
            type="submit"
            disabled={status === "loading"}
            className="btn-accent inline-flex items-center gap-2 disabled:opacity-50"
          >
            {status === "loading" ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {progressLabels[progressStage] ||
                  "Generating (1–3 min — Gemini watches the video)…"}
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                Generate draft
              </>
            )}
          </button>
        </form>

        {status === "loading" && auditPreview && (
          <div className="mb-6 rounded-md border border-brand/25 bg-brand/5 p-3 text-sm text-navy-900">
            <span className="font-semibold">Audit:</span> {auditPreview}
          </div>
        )}

        {status === "error" && (
          <div
            role="alert"
            className="mb-10 rounded-md border border-red-200 bg-red-50 p-4 flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-red-800 mb-1">
                Generation failed
              </div>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {status === "done" && result?.draft && (
          <div className="space-y-6">
            <div className="rounded-md border border-emerald-200 bg-emerald-50 p-4 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-emerald-900">
                <div className="font-semibold mb-1">
                  Draft generated
                  {result.source === "gemini+transcript" && (
                    <>
                      {" "}
                      — Gemini watched the video and found{" "}
                      {result.reposExtracted ?? 0} repos
                    </>
                  )}
                  {result.source === "transcript-only" && (
                    <>
                      {" "}
                      from {result.transcriptWordCount} words of transcript
                      (Gemini unavailable)
                    </>
                  )}
                </div>
                {result.auditReason && (
                  <div className="mb-1.5 text-xs text-emerald-800">
                    {result.auditReason}
                  </div>
                )}
                {result.resolvedFrom === "channel-latest" && (
                  <div className="mb-1.5 text-xs italic text-emerald-800">
                    Resolved channel{" "}
                    {result.channelHandle
                      ? `@${result.channelHandle}`
                      : result.channelTitle || "URL"}{" "}
                    → latest video:{" "}
                    <span className="font-semibold not-italic">
                      {result.latestVideoTitle || result.meta?.title}
                    </span>
                  </div>
                )}
                <div>
                  Source: {result.meta?.title || "(untitled)"}
                  {result.meta?.channel ? ` · ${result.meta.channel}` : ""}{" "}
                  <a
                    href={result.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-900 underline"
                  >
                    open <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            <FieldBlock
              label="Subject line"
              value={result.draft.subject}
              onCopy={() => copyToClipboard(result.draft!.subject, "subject")}
              copied={copiedField === "subject"}
            />
            <FieldBlock
              label="Preheader"
              value={result.draft.preheader}
              onCopy={() =>
                copyToClipboard(result.draft!.preheader, "preheader")
              }
              copied={copiedField === "preheader"}
            />

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold">
                  Markdown body
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={downloadMarkdown}
                    className="inline-flex items-center gap-1.5 text-xs text-brand hover:text-brand-hover font-semibold"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download .md
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard(result.draft!.markdown_body, "body")
                    }
                    className="inline-flex items-center gap-1.5 text-xs text-brand hover:text-brand-hover font-semibold"
                  >
                    {copiedField === "body" ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>
              <textarea
                readOnly
                value={result.draft.markdown_body}
                rows={24}
                className="w-full px-4 py-3 rounded-md border border-border bg-soft font-mono text-xs leading-relaxed resize-y"
              />
            </div>

            <div className="pt-6 mt-2 border-t border-border">
              {publishStatus !== "published" ? (
                <>
                  <h2 className="font-heading text-xl font-bold mb-2">
                    Ready to ship?
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4 max-w-xl">
                    Publishing sends this draft live at{" "}
                    <code className="text-xs px-1 py-0.5 rounded bg-soft">
                      /stack-report/[slug]
                    </code>{" "}
                    and adds it to the issue index. You can still copy/download
                    for Beehiiv separately.
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={handlePublish}
                      disabled={publishStatus === "publishing"}
                      className="btn-accent inline-flex items-center gap-2 disabled:opacity-50"
                    >
                      {publishStatus === "publishing" ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Publishing…
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Publish to Stack Report
                        </>
                      )}
                    </button>
                    {publishStatus === "error" && (
                      <span className="text-sm text-red-700">
                        {publishError}
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <div className="rounded-md border border-emerald-200 bg-emerald-50 p-5">
                  <div className="flex items-start gap-3 mb-4">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-emerald-900 mb-1">
                        Published as Issue #{publishedIssueNumber}
                      </div>
                      <a
                        href={publishedUrl ?? "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-emerald-800 hover:text-emerald-900 underline"
                      >
                        {publishedUrl}
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={resetForNextRun}
                    className="btn-accent inline-flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Generate another
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function FieldBlock({
  label,
  value,
  onCopy,
  copied,
}: {
  label: string;
  value: string;
  onCopy: () => void;
  copied: boolean;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-semibold">{label}</label>
        <button
          type="button"
          onClick={onCopy}
          className="inline-flex items-center gap-1.5 text-xs text-brand hover:text-brand-hover font-semibold"
        >
          {copied ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              Copy
            </>
          )}
        </button>
      </div>
      <div className="px-4 py-3 rounded-md border border-border bg-soft text-sm text-navy-900 font-medium">
        {value}
      </div>
    </div>
  );
}
