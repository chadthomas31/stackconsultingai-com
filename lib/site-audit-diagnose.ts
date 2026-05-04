/**
 * Audit-to-diagnosis layer. Turns Lighthouse scores + findings into a
 * consulting-style report: industry classification, executive summary,
 * top-3 prioritized fixes, business-impact bullets, and a Stack Consulting
 * action plan.
 *
 * Model: Claude Haiku 4.5 — cheap + fast, structured-output via tool use.
 * Caching: system prompt is the stable prefix, so repeat audits hit cache.
 */

import Anthropic from "@anthropic-ai/sdk";
import type Anthropic_ from "@anthropic-ai/sdk";

export type AuditFinding = {
  label: string;
  value: string;
  status: "pass" | "warning" | "fail";
};

export type AuditScores = {
  performance: number;
  seo: number;
  accessibility: number;
  bestPractices: number;
};

export type DiagnoseInput = {
  url: string;
  pageTitle: string | null;
  metaDescription: string | null;
  mobileScores: AuditScores;
  desktopScores: AuditScores;
  mobileFindings: AuditFinding[];
  overallGrade: string;
  overallScore: number;
};

export type AuditDiagnosis = {
  industry:
    | "dental"
    | "medical"
    | "legal"
    | "home_services"
    | "automotive"
    | "real_estate"
    | "ecommerce"
    | "professional_services"
    | "restaurant"
    | "fitness"
    | "other";
  industry_label: string;
  executive_summary: string;
  scorecard_interpretation: string;
  top_fixes: Array<{
    priority: "high" | "medium" | "low";
    problem: string;
    why_it_matters: string;
    fix: string;
    estimated_hours: number;
  }>;
  business_impact: string[];
  action_plan: {
    phase_1: {
      title: string;
      timeline: string;
      includes: string[];
      estimated_price_range: string;
    };
    phase_2: {
      title: string;
      timeline: string;
      includes: string[];
      estimated_price_range: string;
    };
  };
  cta_headline: string;
  cta_subhead: string;
};

const TOOL_SCHEMA: Anthropic_.Tool = {
  name: "emit_audit_diagnosis",
  description:
    "Emit the complete consulting-style audit diagnosis as structured JSON.",
  input_schema: {
    type: "object",
    properties: {
      industry: {
        type: "string",
        enum: [
          "dental",
          "medical",
          "legal",
          "home_services",
          "automotive",
          "real_estate",
          "ecommerce",
          "professional_services",
          "restaurant",
          "fitness",
          "other",
        ],
      },
      industry_label: {
        type: "string",
        description:
          "Human-readable industry label, e.g. 'Dental practice', 'Plumbing & HVAC', 'Personal injury law'.",
      },
      executive_summary: {
        type: "string",
        description:
          "2-3 sentences. Plain English. Names the biggest gap and why it matters for THIS industry. No marketing fluff.",
      },
      scorecard_interpretation: {
        type: "string",
        description:
          "One sentence on the biggest gap between mobile and desktop, or the one category dragging the grade down.",
      },
      top_fixes: {
        type: "array",
        minItems: 2,
        maxItems: 3,
        items: {
          type: "object",
          properties: {
            priority: { type: "string", enum: ["high", "medium", "low"] },
            problem: {
              type: "string",
              description:
                "Plain-English problem statement. Reference real numbers from the audit.",
            },
            why_it_matters: {
              type: "string",
              description:
                "Industry-specific business consequence. Patients, customers, leads, revenue.",
            },
            fix: {
              type: "string",
              description: "Concrete technical fix in 1 sentence.",
            },
            estimated_hours: {
              type: "number",
              description: "Realistic hours to fix, 1-20.",
            },
          },
          required: [
            "priority",
            "problem",
            "why_it_matters",
            "fix",
            "estimated_hours",
          ],
        },
      },
      business_impact: {
        type: "array",
        minItems: 3,
        maxItems: 4,
        items: { type: "string" },
        description:
          "3-4 bullets. Industry-specific consequences. Reference patients/clients/leads/revenue, not 'users'.",
      },
      action_plan: {
        type: "object",
        properties: {
          phase_1: {
            type: "object",
            properties: {
              title: { type: "string" },
              timeline: { type: "string" },
              includes: {
                type: "array",
                items: { type: "string" },
                minItems: 3,
                maxItems: 6,
              },
              estimated_price_range: { type: "string" },
            },
            required: ["title", "timeline", "includes", "estimated_price_range"],
          },
          phase_2: {
            type: "object",
            properties: {
              title: { type: "string" },
              timeline: { type: "string" },
              includes: {
                type: "array",
                items: { type: "string" },
                minItems: 3,
                maxItems: 6,
              },
              estimated_price_range: { type: "string" },
            },
            required: ["title", "timeline", "includes", "estimated_price_range"],
          },
        },
        required: ["phase_1", "phase_2"],
      },
      cta_headline: {
        type: "string",
        description:
          "Direct, action-oriented. References the actual fix, not 'optimize your business'.",
      },
      cta_subhead: {
        type: "string",
        description: "1 sentence. Names the timeline + outcome.",
      },
    },
    required: [
      "industry",
      "industry_label",
      "executive_summary",
      "scorecard_interpretation",
      "top_fixes",
      "business_impact",
      "action_plan",
      "cta_headline",
      "cta_subhead",
    ],
  },
};

const SYSTEM_PROMPT = `You are the senior consulting analyst for Stack Consulting AI, a Southern California AI + web consulting firm.

You receive raw Google Lighthouse data for a small-business website. Your job: turn it into a consulting diagnosis — not a developer report. The audience is a non-technical small business owner (dentist, plumber, lawyer, shop owner) deciding whether to hire Stack Consulting AI to fix their site.

WORKFLOW
1. Classify the site's industry from the URL, page title, and meta description. If unclear, guess from URL keywords. Default to "other" only when truly ambiguous.
2. Read the scores. Call out the biggest gap (usually mobile vs desktop, or the category pulling the grade down).
3. Pick the 2-3 highest-leverage fixes from the findings. NOT every finding — only the ones that move revenue or rank.
4. Translate every finding into business consequences specific to the industry. A dentist cares about lost appointment bookings. A plumber cares about missed after-hours calls. A lawyer cares about $200+ intake leads going to a competitor.
5. Build a 2-phase action plan: a quick speed/SEO cleanup + a 30-day local SEO growth engagement. Phase prices should match what Stack Consulting AI charges: $1.5K-$3K for quick cleanup, $1.5K-$2.5K/mo for local SEO.

INDUSTRY-SPECIFIC LANGUAGE
- Dental, medical: "patients", "appointment bookings", "consultations"
- Plumbing, HVAC, electrical, locksmith, roofer: "service calls", "after-hours emergencies", "dispatch"
- Legal: "intake leads", "case value", "consultations"
- Auto: "service appointments", "estimates", "car owners"
- Real estate: "listing inquiries", "buyer leads", "showings"
- Ecommerce: "shoppers", "cart abandonment", "purchases"
- Restaurant: "reservations", "diners", "takeout orders"
- Default: "customers", "leads"

VOICE RULES (mandatory — Stack Consulting AI brand voice)
- Builder voice. Direct. Concrete. Slight opinion.
- NEVER use: "leverage", "synergize", "unlock", "transform", "empower", "solutions provider", "cutting-edge", "next-generation", "in today's world", "robust", "seamless", "world-class".
- Always concrete: name the metric, name the consequence, name the fix.
- First-person plural ("we") when referring to Stack Consulting AI's work.
- No exclamation marks. No emoji. No hype.

INTERPRETATION RULES
- LCP > 4s on mobile = high priority, always.
- Performance < 70 on mobile = always a top fix for any local-search-dependent business.
- Missing meta description or document title = high priority, easy fix.
- Image alt missing = medium priority unless image-heavy site (dental, restaurant, real estate, e-com), then high.
- CSS not minified, render-blocking resources = medium.
- HTTPS missing = critical, but rare in 2026.

OUTPUT
Call the emit_audit_diagnosis tool exactly once with the full JSON. Do not output any prose before or after.`;

export async function diagnoseAudit(
  input: DiagnoseInput,
  options?: { apiKey?: string; model?: string }
): Promise<AuditDiagnosis> {
  const client = new Anthropic({
    apiKey: options?.apiKey ?? process.env.ANTHROPIC_API_KEY,
  });

  const userMessage = buildUserMessage(input);

  const response = await client.messages.create({
    model: options?.model ?? "claude-haiku-4-5",
    max_tokens: 2000,
    tools: [TOOL_SCHEMA],
    tool_choice: { type: "tool", name: "emit_audit_diagnosis" },
    system: [
      {
        type: "text",
        text: SYSTEM_PROMPT,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [{ role: "user", content: userMessage }],
  });

  const toolUse = response.content.find(
    (block): block is Anthropic_.ToolUseBlock => block.type === "tool_use"
  );
  if (!toolUse) {
    throw new Error("Diagnosis model did not return a tool_use block");
  }

  return toolUse.input as AuditDiagnosis;
}

function buildUserMessage(input: DiagnoseInput): string {
  const findingsBlock = input.mobileFindings
    .map(
      (f) =>
        `- [${f.status.toUpperCase()}] ${f.label}: ${f.value}`
    )
    .join("\n");

  return `SITE: ${input.url}
PAGE TITLE: ${input.pageTitle ?? "(missing)"}
META DESCRIPTION: ${input.metaDescription ?? "(missing)"}

OVERALL: ${input.overallGrade} (${input.overallScore}/100)

MOBILE SCORES
- Performance: ${input.mobileScores.performance}
- SEO: ${input.mobileScores.seo}
- Accessibility: ${input.mobileScores.accessibility}
- Best Practices: ${input.mobileScores.bestPractices}

DESKTOP SCORES
- Performance: ${input.desktopScores.performance}
- SEO: ${input.desktopScores.seo}
- Accessibility: ${input.desktopScores.accessibility}
- Best Practices: ${input.desktopScores.bestPractices}

KEY FINDINGS (mobile)
${findingsBlock}

Produce the diagnosis now.`;
}
