"use client";

import { useState } from "react";
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Activity,
} from "lucide-react";

interface QuotaResponse {
  ok: boolean;
  error?: string;
  errorCode?: string;
  rawPreview?: string;
  fingerprint: string;
  source: "env" | "form";
  modelsAvailable: number | null;
  videoModels: string[];
  testCall: {
    ok: boolean;
    status: number | null;
    errorCode?: string;
    errorMessage?: string;
    latencyMs?: number;
  };
  hint?: string;
}

export default function GeminiQuotaPage() {
  const [secret, setSecret] = useState("");
  const [customKey, setCustomKey] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );
  const [error, setError] = useState("");
  const [result, setResult] = useState<QuotaResponse | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/gemini-quota", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": secret,
        },
        body: JSON.stringify({
          key: customKey.trim() || undefined,
        }),
        signal: AbortSignal.timeout(30000),
      });
      const data = (await res.json()) as QuotaResponse;
      if (!res.ok) {
        setError(data.error || `HTTP ${res.status}`);
        setStatus("error");
        return;
      }
      setResult(data);
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
      setStatus("error");
    }
  }

  return (
    <main className="min-h-screen bg-white text-navy-900 pb-24">
      <div className="max-w-2xl mx-auto px-4 pt-16">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand/10 border border-brand/25 text-brand text-xs font-semibold tracking-[0.16em] uppercase mb-5">
          <Activity className="w-3 h-3" />
          Admin Tool
        </div>
        <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Gemini Key Check
        </h1>
        <p className="text-lg text-muted-foreground mb-10">
          Verify a Gemini API key works, see which models it can access, and
          catch billing/quota errors with clear hints. Leave the key field blank
          to test the one configured in Vercel env.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5 mb-8">
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
              Gemini API key{" "}
              <span className="text-muted-foreground font-normal">
                (optional — leave blank to test the configured env key)
              </span>
            </label>
            <input
              type="password"
              value={customKey}
              onChange={(e) => setCustomKey(e.target.value)}
              placeholder="AIza... (paste a key to test either Google account)"
              className="w-full px-4 py-3 rounded-md border border-border bg-white focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground mt-1.5">
              Grab keys from{" "}
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand hover:underline"
              >
                aistudio.google.com/app/apikey
              </a>
              {" "}under each of your Google accounts to compare.
            </p>
          </div>
          <button
            type="submit"
            disabled={status === "loading"}
            className="btn-cta-call inline-flex items-center gap-2 disabled:opacity-50"
          >
            {status === "loading" ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Testing key…
              </>
            ) : (
              <>
                <KeyRound className="w-4 h-4" />
                Check key
              </>
            )}
          </button>
        </form>

        {status === "error" && (
          <div
            role="alert"
            className="mb-10 rounded-md border border-red-200 bg-red-50 p-4 flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-red-800 mb-1">
                Check failed
              </div>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {status === "done" && result && (
          <div
            className={`rounded-md border p-5 ${
              result.ok
                ? "border-emerald-200 bg-emerald-50"
                : "border-amber-200 bg-amber-50"
            }`}
          >
            <div className="flex items-start gap-3 mb-4">
              {result.ok ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <div
                  className={`font-semibold mb-1 ${result.ok ? "text-emerald-900" : "text-amber-900"}`}
                >
                  {result.ok
                    ? "Key is healthy — billing + quota working."
                    : "Key has an issue — see details below."}
                </div>
                <div className="text-sm opacity-80">
                  Source: {result.source === "env" ? "Vercel env var" : "form input"}
                  {" · "}Fingerprint: <code>{result.fingerprint}</code>
                </div>
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-4">
              <dt className="font-semibold">Models accessible</dt>
              <dd>{result.modelsAvailable ?? "unknown"}</dd>
              <dt className="font-semibold">Test call status</dt>
              <dd>
                {result.testCall.status ?? "—"}{" "}
                {result.testCall.ok ? "(success)" : "(failed)"}
                {result.testCall.latencyMs
                  ? ` · ${result.testCall.latencyMs}ms`
                  : ""}
              </dd>
              {result.testCall.errorCode && (
                <>
                  <dt className="font-semibold">Error code</dt>
                  <dd>
                    <code>{result.testCall.errorCode}</code>
                  </dd>
                </>
              )}
              {result.testCall.errorMessage && (
                <>
                  <dt className="font-semibold">Error message</dt>
                  <dd className="text-xs">{result.testCall.errorMessage}</dd>
                </>
              )}
            </dl>

            {result.hint && (
              <div className="text-sm p-3 rounded bg-white/60 border border-black/5 mb-3">
                <span className="font-semibold">Hint:</span> {result.hint}
              </div>
            )}

            {result.videoModels.length > 0 && (
              <details className="text-xs">
                <summary className="cursor-pointer font-semibold">
                  Gemini models this key can call ({result.videoModels.length})
                </summary>
                <ul className="mt-2 font-mono space-y-0.5 text-muted-foreground">
                  {result.videoModels.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
              </details>
            )}
          </div>
        )}

        <div className="mt-10 text-sm text-muted-foreground border-t border-border pt-6">
          <p className="mb-2">
            <strong>To compare your two Google accounts:</strong>
          </p>
          <ol className="list-decimal list-inside space-y-1.5">
            <li>
              Open{" "}
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand hover:underline"
              >
                aistudio.google.com/app/apikey
              </a>{" "}
              in an incognito window as <code>chad.mccluskey@gmail.com</code>
            </li>
            <li>Copy an API key, paste it above, click Check</li>
            <li>
              Close incognito. Open a fresh incognito as{" "}
              <code>admin@2105.io</code>. Repeat.
            </li>
            <li>
              Whichever account reports the faster/cleaner response (and
              ideally has free-tier credits remaining) — put that key into
              Vercel as <code>AI_STUDIO_GEMINI_KEY</code>.
            </li>
          </ol>
        </div>
      </div>
    </main>
  );
}
