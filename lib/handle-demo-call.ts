/**
 * Handles a hangup webhook that matched a demo_leads row.
 *
 * Steps:
 *   1. Use Claude Haiku to extract a structured "what the agent did" payload
 *      + a one-paragraph natural-language summary.
 *   2. Persist to demo_leads (transcript, summary, actions, duration).
 *   3. Email the prospect the demo report.
 *
 * Kept separate from /api/call-ended so the route stays small and we can unit-
 * test this pipeline independently when we add tests later.
 */

import Anthropic from "@anthropic-ai/sdk";

import { markCallFinished, markReportEmailed } from "./demo-leads-db";
import type { DemoLeadRow } from "./demo-leads-db";
import {
  sendDemoReportEmail,
  type DemoCallActions,
} from "./demo-report-email";
import { VERTICAL_AGENTS } from "./voice-agents";

const MODEL = "claude-haiku-4-5-20251001";

interface ExtractedResult {
  summary: string;
  actions: DemoCallActions;
}

/** Ask Claude to summarize the demo call + extract structured intake fields. */
async function extractDemoCall(input: {
  vertical: keyof typeof VERTICAL_AGENTS;
  transcript: string;
}): Promise<ExtractedResult> {
  const agent = VERTICAL_AGENTS[input.vertical];
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    // Degrade gracefully — caller still gets *some* report so the funnel works locally.
    return {
      summary:
        "Demo call completed. Anthropic API key not configured; summary unavailable.",
      actions: {
        captured_fields: {},
      },
    };
  }
  const client = new Anthropic({ apiKey });
  const fieldList = (agent.intakeFields as readonly string[]).join(", ");

  const system =
    `You are a transcript analyst for Stack Consulting AI's vertical voice-demo product. ` +
    `Given the transcript of a ${input.vertical} AI receptionist demo call, return ONLY valid JSON matching this schema:\n` +
    `{\n` +
    `  "summary": string,           // 2-3 sentence natural-language summary of the call\n` +
    `  "actions": {\n` +
    `    "captured_fields": object, // {${fieldList}} — only include fields actually captured\n` +
    `    "emergency_flagged": boolean,\n` +
    `    "booked_slot": string|null,         // ISO timestamp the agent confirmed, or null\n` +
    `    "alternate_slot_offered": string|null, // ISO of the +1h fallback if the first was busy, or null\n` +
    `    "service_type": string|null,\n` +
    `    "zip_code": string|null,\n` +
    `    "notes": string\n` +
    `  }\n` +
    `}\n` +
    `Be conservative: if a field wasn't captured, set it to null or omit it. ` +
    `Never fabricate.`;

  const resp = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    system,
    messages: [
      {
        role: "user",
        content: `Transcript:\n\n${input.transcript}\n\nReturn JSON only.`,
      },
    ],
  });

  const text =
    resp.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim() || "";

  // Pull the first JSON object from the response.
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) {
    return {
      summary: "Demo call completed. (Could not parse structured fields.)",
      actions: { captured_fields: {}, notes: text.slice(0, 500) },
    };
  }
  try {
    const parsed = JSON.parse(match[0]) as ExtractedResult;
    return {
      summary: parsed.summary ?? "(no summary)",
      actions: parsed.actions ?? { captured_fields: {} },
    };
  } catch {
    return {
      summary: "Demo call completed. (JSON parse failed.)",
      actions: { captured_fields: {}, notes: text.slice(0, 500) },
    };
  }
}

interface HandlerInput {
  lead: DemoLeadRow;
  transcript: string;
  durationSeconds?: number;
  callUuid?: string;
}

export async function handleDemoCallEnded(
  input: HandlerInput,
): Promise<{ ok: true; emailed: boolean } | { ok: false; error: string }> {
  const vertical = input.lead.vertical;
  const agent = VERTICAL_AGENTS[vertical];
  if (!agent) {
    return { ok: false, error: `Unknown vertical: ${vertical}` };
  }

  const extracted = await extractDemoCall({
    vertical,
    transcript: input.transcript,
  });

  await markCallFinished({
    leadId: input.lead.id,
    callUuid: input.callUuid,
    durationS: input.durationSeconds,
    summary: extracted.summary,
    actions: extracted.actions as Record<string, unknown>,
    transcript: input.transcript,
  });

  const email = await sendDemoReportEmail({
    to: input.lead.email,
    firstName: input.lead.first_name,
    bizName: input.lead.biz_name,
    vertical,
    verticalDisplay: agent.displayName,
    durationSeconds: input.durationSeconds ?? null,
    summary: extracted.summary,
    actions: extracted.actions,
    transcript: input.transcript,
  });

  if (email.id) {
    await markReportEmailed(input.lead.id);
    return { ok: true, emailed: true };
  }
  return { ok: true, emailed: false };
}
