import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";

import { ReceptionistConfigSchema } from "@/lib/receptionist-config-schema";
import { enforceRateLimit, rateLimitErrorPayload } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TOOL_SLUG = "demo-generate-receptionist";
const MODEL = "claude-haiku-4-5-20251001";
const MAX_DESCRIPTION_LEN = 600;
const ALLOWED_INDUSTRIES = ["auto", "plumbing", "hvac", "medspa"] as const;

interface Body {
  companyName?: string;
  industry?: string;
  description?: string;
  city?: string;
}

export async function POST(req: NextRequest) {
  let body: Body = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const companyName = String(body.companyName ?? "").trim();
  const industry = String(body.industry ?? "").trim();
  const description = String(body.description ?? "").trim();
  const city = String(body.city ?? "").trim();

  if (!companyName || !description) {
    return NextResponse.json(
      { error: "Company name and description required" },
      { status: 400 },
    );
  }
  if (!ALLOWED_INDUSTRIES.includes(industry as (typeof ALLOWED_INDUSTRIES)[number])) {
    return NextResponse.json({ error: "Unknown industry" }, { status: 400 });
  }
  if (description.length > MAX_DESCRIPTION_LEN) {
    return NextResponse.json(
      { error: `Description too long. Limit ${MAX_DESCRIPTION_LEN} characters.` },
      { status: 400 },
    );
  }

  // LLM call is paid — rate-limit before we ever touch Anthropic.
  const rate = await enforceRateLimit(req, TOOL_SLUG);
  if (!rate.allowed) {
    return NextResponse.json(rateLimitErrorPayload(rate, TOOL_SLUG), {
      status: 429,
    });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "AI temporarily unavailable" },
      { status: 503 },
    );
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const systemPrompt = `You are drafting a phone receptionist config for a live AI demo. Builder voice: direct, concrete, specific to the description given. Do NOT invent prices, medical/legal claims, or specifics not implied by the description — for unknowns say the team will confirm. Keep services realistic for a ${industry} business.`;

  const userMessage =
    `Business: ${companyName}\n` +
    `Industry: ${industry}\n` +
    `City: ${city || "unspecified"}\n` +
    `Description: ${description}`;

  try {
    const response = await client.messages.parse({
      model: MODEL,
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
      output_config: {
        format: zodOutputFormat(ReceptionistConfigSchema),
      },
    });

    if (!response.parsed_output) {
      return NextResponse.json(
        { error: "Could not draft config" },
        { status: 502 },
      );
    }

    const config = response.parsed_output;
    return NextResponse.json({ config });
  } catch (err) {
    console.error(
      "[generate-receptionist]",
      err instanceof Error ? err.message : String(err),
    );
    return NextResponse.json(
      { error: "Could not draft config — try again" },
      { status: 502 },
    );
  }
}
