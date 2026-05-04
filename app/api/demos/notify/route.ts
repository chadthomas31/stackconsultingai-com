import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import type Anthropic_ from "@anthropic-ai/sdk";
import { Resend } from "resend";
import { enforceRateLimit, rateLimitErrorPayload } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TOOL_SLUG = "demo-lead";
const MODEL = "claude-haiku-4-5-20251001";
const RESEND_TO = process.env.LEAD_NOTIFY_EMAIL ?? "chad@stackconsultingai.com";
const RESEND_FROM = "Stack Demo <demo@stackconsultingai.com>";

type Intent = "booking" | "pricing" | "ai_inquiry" | "service_request" | "support" | "other";
type Urgency = "high" | "medium" | "low";

type LeadExtraction = {
  intent: Intent;
  urgency: Urgency;
  reasoning: string;
  summary: string;
  recommended_action: string;
};

const TOOL_SCHEMA: Anthropic_.Tool = {
  name: "classify_lead",
  description:
    "Classify the inbound lead. Decide intent, urgency, the one-sentence reasoning the agent used, " +
    "a one-sentence owner-facing summary, and the recommended next action.",
  input_schema: {
    type: "object",
    properties: {
      intent: {
        type: "string",
        enum: ["booking", "pricing", "ai_inquiry", "service_request", "support", "other"],
        description: "What does the lead want?",
      },
      urgency: {
        type: "string",
        enum: ["high", "medium", "low"],
        description:
          "high = needs response in minutes (emergency, active outage, water/leak/fire). " +
          "medium = same business day. low = no time pressure (price shopping).",
      },
      reasoning: {
        type: "string",
        description:
          "One sentence explaining the urgency call. Concrete signal from the lead text. ≤ 140 chars.",
      },
      summary: {
        type: "string",
        description:
          "One-sentence owner-facing summary of the lead and what they need. ≤ 180 chars.",
      },
      recommended_action: {
        type: "string",
        description:
          "What the owner should do next, in plain language. e.g. 'Call back within 30 min — water damage in progress.' ≤ 140 chars.",
      },
    },
    required: ["intent", "urgency", "reasoning", "summary", "recommended_action"],
    additionalProperties: false,
  },
};

const SYSTEM_PROMPT = `You are a lead-qualification agent for a small-business owner.

Your job:
1. Read the inbound lead (name, business, problem description).
2. Decide intent, urgency, and what the owner should do next.

Urgency rules:
- "high" = active emergency, outage, leak, fire, locked out, customer waiting, "tonight/now/asap"
- "medium" = real service request with no immediate time pressure
- "low" = price-shopping, vague questions, "just curious"

Be terse. Be concrete. Cite the specific words that drove your urgency call.
Never invent details that aren't in the lead.`;

const enc = new TextEncoder();
const sse = (data: unknown) => enc.encode(`data: ${JSON.stringify(data)}\n\n`);
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function POST(req: NextRequest) {
  let body: {
    name?: string;
    business?: string;
    email?: string;
    phone?: string;
    problem?: string;
  } = {};
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const problem = (body.problem ?? "").trim();
  if (problem.length < 10) {
    return new Response(JSON.stringify({ error: "Problem too short" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const email = (body.email ?? "").trim().slice(0, 120);
  if (!email || !/.+@.+\..+/.test(email)) {
    return new Response(JSON.stringify({ error: "Valid email required" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const name = (body.name ?? "Anonymous").slice(0, 60).trim() || "Anonymous";
  const biz = (body.business ?? "").slice(0, 80).trim();
  const phone = (body.phone ?? "").trim().slice(0, 30);

  const rate = await enforceRateLimit(req, TOOL_SLUG);
  if (!rate.allowed) {
    return new Response(JSON.stringify(rateLimitErrorPayload(rate, TOOL_SLUG)), {
      status: 429,
      headers: { "content-type": "application/json" },
    });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(JSON.stringify({ error: "Lead agent not configured" }), {
      status: 503,
      headers: { "content-type": "application/json" },
    });
  }

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const safeEnqueue = (chunk: Uint8Array) => {
        try {
          controller.enqueue(chunk);
        } catch {
          // controller already closed; abort silently
        }
      };

      try {
        safeEnqueue(sse({ kind: "thought", text: "Reading lead. Looking for urgency markers…" }));

        const userMessage = [
          `Name: ${name}`,
          biz ? `Business: ${biz}` : null,
          `Email: ${email}`,
          phone ? `Phone: ${phone}` : null,
          `Problem (verbatim): ${problem}`,
        ]
          .filter(Boolean)
          .join("\n");

        const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
        const result = await anthropic.messages.create({
          model: MODEL,
          max_tokens: 600,
          system: SYSTEM_PROMPT,
          tools: [TOOL_SCHEMA],
          tool_choice: { type: "tool", name: "classify_lead" },
          messages: [{ role: "user", content: userMessage }],
        });

        const toolUse = result.content.find(
          (b): b is Extract<Anthropic_.ContentBlock, { type: "tool_use" }> => b.type === "tool_use",
        );
        if (!toolUse) {
          safeEnqueue(sse({ kind: "error", message: "Agent returned no classification." }));
          controller.close();
          return;
        }

        const extraction = toolUse.input as LeadExtraction;

        // Stream extracted fields with small delays so the UI shows progressive reveal.
        safeEnqueue(sse({ kind: "field", key: "name", value: name }));
        if (biz) {
          await wait(120);
          safeEnqueue(sse({ kind: "field", key: "business", value: biz }));
        }
        await wait(180);
        safeEnqueue(sse({ kind: "field", key: "intent", value: extraction.intent }));
        await wait(150);
        safeEnqueue(sse({ kind: "field", key: "urgency", value: extraction.urgency }));
        await wait(280);
        safeEnqueue(sse({ kind: "thought", text: extraction.reasoning }));
        await wait(380);
        safeEnqueue(sse({ kind: "summary", text: extraction.summary }));
        await wait(200);
        safeEnqueue(sse({ kind: "field", key: "next_action", value: extraction.recommended_action }));

        // Discord webhook
        await wait(300);
        const discordResult = await postDiscord({
          name,
          biz,
          email,
          phone,
          problem,
          extraction,
        });
        safeEnqueue(sse({ kind: "notify", channel: "discord", ...discordResult }));

        // Resend email
        await wait(200);
        const emailResult = await sendLeadEmail({
          name,
          biz,
          email,
          phone,
          problem,
          extraction,
        });
        safeEnqueue(sse({ kind: "notify", channel: "email", ...emailResult }));

        await wait(150);
        safeEnqueue(sse({ kind: "done", ok: true }));
        controller.close();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Agent failed.";
        safeEnqueue(sse({ kind: "error", message }));
        try {
          controller.close();
        } catch {
          // already closed
        }
      }
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

type LeadCtx = {
  name: string;
  biz: string;
  email: string;
  phone: string;
  problem: string;
  extraction: LeadExtraction;
};

async function postDiscord(ctx: LeadCtx): Promise<{ ok: boolean; reason?: string }> {
  const url = process.env.DISCORD_WEBHOOK_URL;
  if (!url) return { ok: false, reason: "no webhook configured" };

  const color =
    ctx.extraction.urgency === "high"
      ? 0xef4444 // red
      : ctx.extraction.urgency === "medium"
        ? 0xf59e0b // amber
        : 0x3e6aef; // brand blue

  const payload = {
    username: "Stack Lead Agent",
    embeds: [
      {
        title: `${urgencyLabel(ctx.extraction.urgency)} · ${intentLabel(ctx.extraction.intent)}`,
        description: ctx.extraction.summary,
        color,
        fields: [
          { name: "Name", value: ctx.name || "—", inline: true },
          { name: "Business", value: ctx.biz || "—", inline: true },
          { name: "Email", value: ctx.email, inline: true },
          ...(ctx.phone ? [{ name: "Phone", value: ctx.phone, inline: true }] : []),
          { name: "Next action", value: ctx.extraction.recommended_action },
          { name: "Reasoning", value: ctx.extraction.reasoning },
          { name: "Verbatim problem", value: truncate(ctx.problem, 1000) },
        ],
        footer: { text: "stackconsultingai.com /demos" },
        timestamp: new Date().toISOString(),
      },
    ],
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      return { ok: false, reason: `discord ${res.status}` };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, reason: err instanceof Error ? err.message : "fetch failed" };
  }
}

async function sendLeadEmail(ctx: LeadCtx): Promise<{ ok: boolean; reason?: string }> {
  if (!process.env.RESEND_API_KEY) return { ok: false, reason: "no Resend key" };

  const subject = `[${urgencyLabel(ctx.extraction.urgency)}] Demo lead: ${ctx.name}${ctx.biz ? ` · ${ctx.biz}` : ""}`;

  const html = `<!doctype html>
<html><body style="margin:0;padding:0;background:#f5f5fa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,Arial,sans-serif;color:#00122e;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5fa;padding:32px 16px;">
  <tr><td align="center">
    <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#fff;border:1px solid #e2e2e2;border-radius:8px;overflow:hidden;">
      <tr><td style="padding:24px 28px;">
        <div style="font-size:11px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;color:#3e6aef;margin-bottom:6px;">Demo lead · /demos</div>
        <h1 style="margin:0 0 14px 0;font-size:22px;line-height:1.2;color:#00122e;">${escapeHtml(ctx.extraction.summary)}</h1>
        <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;font-size:14px;color:#00122e;border-collapse:collapse;">
          <tr><td style="padding:6px 0;width:120px;color:#6b7280;">Name</td><td style="padding:6px 0;">${escapeHtml(ctx.name)}</td></tr>
          ${ctx.biz ? `<tr><td style="padding:6px 0;color:#6b7280;">Business</td><td style="padding:6px 0;">${escapeHtml(ctx.biz)}</td></tr>` : ""}
          <tr><td style="padding:6px 0;color:#6b7280;">Email</td><td style="padding:6px 0;"><a href="mailto:${escapeHtml(ctx.email)}" style="color:#3e6aef;text-decoration:none;">${escapeHtml(ctx.email)}</a></td></tr>
          ${ctx.phone ? `<tr><td style="padding:6px 0;color:#6b7280;">Phone</td><td style="padding:6px 0;"><a href="tel:${escapeHtml(ctx.phone)}" style="color:#3e6aef;text-decoration:none;">${escapeHtml(ctx.phone)}</a></td></tr>` : ""}
          <tr><td style="padding:6px 0;color:#6b7280;">Intent</td><td style="padding:6px 0;">${escapeHtml(intentLabel(ctx.extraction.intent))}</td></tr>
          <tr><td style="padding:6px 0;color:#6b7280;">Urgency</td><td style="padding:6px 0;"><strong>${escapeHtml(urgencyLabel(ctx.extraction.urgency))}</strong></td></tr>
          <tr><td style="padding:6px 0;color:#6b7280;vertical-align:top;">Next action</td><td style="padding:6px 0;">${escapeHtml(ctx.extraction.recommended_action)}</td></tr>
          <tr><td style="padding:6px 0;color:#6b7280;vertical-align:top;">Reasoning</td><td style="padding:6px 0;color:#4b5563;">${escapeHtml(ctx.extraction.reasoning)}</td></tr>
        </table>
        <div style="margin-top:18px;padding:14px 16px;background:#f5f5fa;border:1px solid #e2e2e2;border-radius:6px;">
          <div style="font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#6b7280;margin-bottom:6px;">Verbatim problem</div>
          <div style="font-size:14px;line-height:1.5;color:#00122e;white-space:pre-wrap;">${escapeHtml(ctx.problem)}</div>
        </div>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;

  const text = `${ctx.extraction.summary}

Name: ${ctx.name}
${ctx.biz ? `Business: ${ctx.biz}\n` : ""}Email: ${ctx.email}
${ctx.phone ? `Phone: ${ctx.phone}\n` : ""}Intent: ${intentLabel(ctx.extraction.intent)}
Urgency: ${urgencyLabel(ctx.extraction.urgency)}
Next action: ${ctx.extraction.recommended_action}
Reasoning: ${ctx.extraction.reasoning}

Verbatim problem:
${ctx.problem}`;

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const result = await resend.emails.send({
      from: RESEND_FROM,
      to: RESEND_TO,
      replyTo: ctx.email,
      subject,
      html,
      text,
    });
    if (result.error) {
      return { ok: false, reason: result.error.message ?? "Resend error" };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, reason: err instanceof Error ? err.message : "Resend exception" };
  }
}

function urgencyLabel(u: Urgency): string {
  return u === "high" ? "HIGH" : u === "medium" ? "MEDIUM" : "LOW";
}

function intentLabel(i: Intent): string {
  switch (i) {
    case "booking":
      return "Booking";
    case "pricing":
      return "Pricing";
    case "ai_inquiry":
      return "AI inquiry";
    case "service_request":
      return "Service request";
    case "support":
      return "Support";
    default:
      return "Other";
  }
}

function truncate(s: string, n: number): string {
  return s.length <= n ? s : s.slice(0, n - 1) + "…";
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
