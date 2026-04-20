import { NextRequest, NextResponse } from "next/server";
import { getGeminiApiKey } from "@/lib/gemini-video-extract";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface QuotaRequest {
  key?: string;
  secret?: string;
}

function authorize(req: NextRequest, body: QuotaRequest) {
  const required = process.env.NEWSLETTER_ADMIN_SECRET;
  if (!required) return true;
  const headerSecret = req.headers.get("x-admin-secret");
  return headerSecret === required || body.secret === required;
}

function fingerprint(key: string): string {
  if (key.length < 12) return "***";
  return `${key.slice(0, 6)}…${key.slice(-4)}`;
}

export async function POST(req: NextRequest) {
  let body: QuotaRequest = {};
  try {
    body = await req.json();
  } catch {
    /* optional body */
  }

  if (!authorize(req, body)) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  const key = body.key?.trim() || getGeminiApiKey();
  if (!key) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "No key supplied and no configured key in env (GEMINI_API_KEY / AI_STUDIO_GEMINI_KEY).",
      },
      { status: 400 },
    );
  }

  const result: {
    ok: boolean;
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
  } = {
    ok: false,
    fingerprint: fingerprint(key),
    source: body.key ? "form" : "env",
    modelsAvailable: null,
    videoModels: [],
    testCall: { ok: false, status: null },
  };

  // 1. models.list — confirms key is valid + lists accessible models
  try {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(key)}`,
      { signal: AbortSignal.timeout(10000) },
    );
    if (r.ok) {
      const data = (await r.json()) as {
        models?: Array<{ name: string; supportedGenerationMethods?: string[] }>;
      };
      const models = data.models ?? [];
      result.modelsAvailable = models.length;
      result.videoModels = models
        .filter(
          (m) =>
            m.name.includes("gemini") &&
            m.supportedGenerationMethods?.includes("generateContent"),
        )
        .map((m) => m.name.replace(/^models\//, ""))
        .slice(0, 10);
    } else {
      const body = await r.text();
      const match = body.match(/"status":\s*"([^"]+)"/);
      return NextResponse.json({
        ...result,
        error: `models.list failed (HTTP ${r.status})`,
        errorCode: match?.[1] ?? null,
        rawPreview: body.slice(0, 300),
      });
    }
  } catch (err) {
    return NextResponse.json({
      ...result,
      error: err instanceof Error ? err.message : String(err),
    });
  }

  // 2. Tiny generateContent call — proves billing + quota actually work
  const testStart = Date.now();
  try {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(key)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: "ping" }] }],
          generationConfig: { maxOutputTokens: 5 },
        }),
        signal: AbortSignal.timeout(15000),
      },
    );
    result.testCall.latencyMs = Date.now() - testStart;
    result.testCall.status = r.status;
    if (r.ok) {
      result.testCall.ok = true;
      result.ok = true;
    } else {
      const errBody = await r.text();
      const codeMatch = errBody.match(/"status":\s*"([^"]+)"/);
      const msgMatch = errBody.match(/"message":\s*"([^"]+)"/);
      result.testCall.errorCode = codeMatch?.[1];
      result.testCall.errorMessage = msgMatch?.[1];
      if (r.status === 429) {
        result.hint =
          "Rate limit or quota exceeded on this project. Check aistudio.google.com for free-tier usage or console.cloud.google.com/billing for the paid project.";
      } else if (r.status === 403) {
        result.hint =
          "Permission/billing issue. Usually means billing isn't enabled on the Cloud project that owns this key, or the API isn't enabled.";
      } else if (r.status === 400) {
        result.hint =
          "Bad request — often means the key is malformed or revoked.";
      }
    }
  } catch (err) {
    result.testCall.errorMessage =
      err instanceof Error ? err.message : String(err);
  }

  return NextResponse.json(result);
}
