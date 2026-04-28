import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ReqBody = {
  name?: string;
  email?: string;
  message?: string;
};

const LEAD_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: [
    "priority",
    "intent_category",
    "summary",
    "suggested_next_step",
    "best_contact_method",
    "estimated_deal_size_usd",
    "tags",
  ],
  properties: {
    priority: {
      type: "string",
      enum: ["high", "medium", "low"],
      description:
        "high = clear buying signal + urgency. medium = qualified interest. low = exploratory or unqualified.",
    },
    intent_category: {
      type: "string",
      enum: [
        "ai_receptionist",
        "ai_readiness_audit",
        "automation",
        "web_development",
        "managed_it",
        "support_question",
        "other",
      ],
    },
    summary: {
      type: "string",
      description:
        "One sentence (≤160 chars) summarizing what the lead wants and why it matters.",
    },
    suggested_next_step: {
      type: "string",
      description:
        "Concrete action Chad should take next, ≤80 chars. Examples: 'Send Receptionist pricing PDF', 'Book 30-min discovery call', 'Reply with workflow audit explainer'.",
    },
    best_contact_method: {
      type: "string",
      enum: ["email", "phone", "slack", "calendar_invite"],
    },
    estimated_deal_size_usd: {
      type: "integer",
      minimum: 0,
      maximum: 100000,
      description:
        "Rough estimate of one-time deal value if closed. Use 0 if support/info request, not a buying lead.",
    },
    tags: {
      type: "array",
      items: { type: "string" },
      description: "1–4 short keywords for downstream routing/filtering.",
      minItems: 1,
      maxItems: 4,
    },
  },
} as const;

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY not configured on the server." },
      { status: 503 },
    );
  }

  let body: ReqBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400 },
    );
  }

  const name = body.name?.trim();
  const email = body.email?.trim();
  const message = body.message?.trim();

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Fields `name`, `email`, and `message` are all required." },
      { status: 400 },
    );
  }
  if (message.length > 1000) {
    return NextResponse.json(
      { error: "Message too long. Limit 1000 characters." },
      { status: 400 },
    );
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const t0 = Date.now();

  let completion;
  try {
    completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You triage inbound leads for Stack Consulting AI (AI consulting / web dev / automation, based in Orange County CA). Extract structured triage data from the message. Be conservative — if the lead doesn't look serious, mark priority 'low' and estimated_deal_size_usd 0.",
        },
        {
          role: "user",
          content: `From: ${name} <${email}>\n\nMessage:\n${message}`,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "lead_triage",
          schema: LEAD_SCHEMA,
          strict: true,
        },
      },
      temperature: 0.1,
      max_tokens: 400,
    });
  } catch (err) {
    return NextResponse.json(
      {
        error: "Structured-output completion failed.",
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 502 },
    );
  }
  const t_total = Date.now() - t0;

  const raw = completion.choices[0]?.message?.content;
  if (!raw) {
    return NextResponse.json(
      { error: "Empty completion." },
      { status: 502 },
    );
  }

  let extracted;
  try {
    extracted = JSON.parse(raw);
  } catch {
    return NextResponse.json(
      { error: "Model returned non-JSON despite strict schema.", raw },
      { status: 502 },
    );
  }

  // Simulated routing — what WOULD happen in production. No actual sends.
  const routing = buildRoutingPlan(extracted, email);

  return NextResponse.json({
    extracted,
    routing,
    usage: {
      prompt_tokens: completion.usage?.prompt_tokens ?? 0,
      completion_tokens: completion.usage?.completion_tokens ?? 0,
      total_tokens: completion.usage?.total_tokens ?? 0,
    },
    timing_ms: { total: t_total },
    model: completion.model,
    note: "Routing is simulated. No emails, Slack messages, or CRM contacts were actually created.",
  });
}

type Extracted = {
  priority: "high" | "medium" | "low";
  intent_category: string;
  best_contact_method: string;
  estimated_deal_size_usd: number;
  suggested_next_step: string;
  tags: string[];
};

function buildRoutingPlan(extracted: Extracted, email: string) {
  const steps: { channel: string; action: string }[] = [];

  if (extracted.priority === "high") {
    steps.push({
      channel: "Slack #leads-hot",
      action: `Post lead summary + tagging @chad for sub-15-min response.`,
    });
    steps.push({
      channel: "Email",
      action: `Send personal reply from chad@stackconsultingai.com to ${email} within 15 min.`,
    });
  } else if (extracted.priority === "medium") {
    steps.push({
      channel: "Slack #leads-warm",
      action: `Post for end-of-day batch reply.`,
    });
    steps.push({
      channel: "Email",
      action: `Send templated nurture sequence to ${email}.`,
    });
  } else {
    steps.push({
      channel: "Email",
      action: `Auto-reply with FAQ + free assessment link to ${email}.`,
    });
  }

  steps.push({
    channel: "GoHighLevel",
    action: `Create contact (${email}), tag with: ${extracted.tags.join(", ")}, pipeline: ${extracted.intent_category}.`,
  });

  if (extracted.best_contact_method === "calendar_invite") {
    steps.push({
      channel: "Cal.com",
      action: `Auto-suggest 3 booking slots; if accepted, route to discovery call template.`,
    });
  }

  return {
    priority: extracted.priority,
    estimated_deal_size_usd: extracted.estimated_deal_size_usd,
    next_step: extracted.suggested_next_step,
    fanout: steps,
  };
}
