import { NextRequest } from "next/server";
import { enforceRateLimit, rateLimitErrorPayload } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TOOL_SLUG = "demo-call";
const ORIGINATE_TIMEOUT_MS = 8000;
const MAX_WEBHOOK_RESPONSE_BYTES = 1024;

const enc = new TextEncoder();
const sse = (event: string, data: unknown) =>
  enc.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);

const jsonError = (message: string, status: number, extra?: Record<string, unknown>) =>
  new Response(JSON.stringify({ error: message, ...extra }), {
    status,
    headers: { "content-type": "application/json" },
  });

function normalizeUsPhone(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isLocalHttpWebhook(url: URL): boolean {
  return (
    url.protocol === "http:" &&
    (url.hostname === "localhost" || url.hostname === "127.0.0.1" || url.hostname === "[::1]")
  );
}

function configuredWebhook(): { url: URL; token: string } | null {
  const rawUrl = process.env.DEMO_CALL_ORIGINATE_URL?.trim();
  const token = process.env.DEMO_CALL_ORIGINATE_TOKEN?.trim();

  if (!rawUrl || !token) return null;

  try {
    const url = new URL(rawUrl);
    if (url.protocol !== "https:" && !isLocalHttpWebhook(url)) return null;
    if (process.env.NODE_ENV === "production" && url.protocol !== "https:") return null;
    return { url, token };
  } catch {
    return null;
  }
}

async function acceptedWebhookContract(res: Response): Promise<boolean> {
  if (!res.ok || !res.headers.get("content-type")?.toLowerCase().includes("application/json")) {
    return false;
  }

  const reader = res.body?.getReader();
  if (!reader) return false;

  const chunks: Uint8Array[] = [];
  let total = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > MAX_WEBHOOK_RESPONSE_BYTES) {
        await reader.cancel();
        return false;
      }
      chunks.push(value);
    }

    const text = new TextDecoder().decode(Buffer.concat(chunks));
    const data: unknown = JSON.parse(text);
    if (!isRecord(data)) return false;
    return data.ok === true || data.success === true;
  } catch {
    return false;
  }
}

async function originateCall(req: NextRequest, phoneE164: string) {
  const webhook = configuredWebhook();
  if (!webhook) {
    return {
      ok: false,
      status: 503,
      message:
        "The voice demo is temporarily offline. Please call or book Chad and we will walk you through it live.",
    };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ORIGINATE_TIMEOUT_MS);

  try {
    const res = await fetch(webhook.url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${webhook.token}`,
      },
      body: JSON.stringify({
        phone: phoneE164,
        source: {
          tool: TOOL_SLUG,
          page: "/demos",
          site: "stackconsultingai.com",
          requested_at: new Date().toISOString(),
          user_agent: (req.headers.get("user-agent") ?? "").slice(0, 180),
        },
      }),
      signal: controller.signal,
    });

    if (!(await acceptedWebhookContract(res))) {
      return {
        ok: false,
        status: 502,
        message:
          "The voice demo could not start right now. Please call or book Chad and we will walk you through it live.",
      };
    }

    return { ok: true, status: 200, message: "Call request accepted." };
  } catch {
    return {
      ok: false,
      status: 504,
      message:
        "The voice demo did not respond in time. Please call or book Chad and we will walk you through it live.",
    };
  } finally {
    clearTimeout(timeout);
  }
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError("Invalid request.", 400);
  }

  if (!isRecord(body) || (body.phone !== undefined && typeof body.phone !== "string")) {
    return jsonError("Invalid request.", 400);
  }

  if (body.consent !== true) {
    return jsonError("Consent is required to start the call.", 400);
  }

  const phoneE164 = normalizeUsPhone(body.phone);
  if (!phoneE164) {
    return jsonError("Enter a valid US phone number.", 400);
  }

  const rate = await enforceRateLimit(req, TOOL_SLUG);
  if (rate.fail_open) {
    return jsonError(
      "The voice demo is temporarily offline. Please call or book Chad and we will walk you through it live.",
      503,
      { offline: true },
    );
  }
  if (!rate.allowed) {
    return new Response(JSON.stringify(rateLimitErrorPayload(rate, TOOL_SLUG)), {
      status: 429,
      headers: { "content-type": "application/json" },
    });
  }

  const originate = await originateCall(req, phoneE164);
  if (!originate.ok) {
    return jsonError(originate.message, originate.status, { offline: true });
  }

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(sse("start", { phone: phoneE164 }));
      controller.enqueue(
        sse("stage", {
          id: "validated",
          label: "Number validated",
          detail: "E.164 format accepted.",
        }),
      );
      controller.enqueue(
        sse("stage", {
          id: "originated",
          label: "Call request accepted",
          detail: "The outbound call bridge accepted the server-side request.",
        }),
      );
      controller.enqueue(sse("done", { ok: true }));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "text/event-stream; charset=utf-8",
      "cache-control": "no-cache, no-transform",
      "x-accel-buffering": "no",
      connection: "keep-alive",
    },
  });
}
