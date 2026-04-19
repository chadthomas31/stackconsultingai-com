/**
 * Claude extraction pipeline for the AI Tools Assessment.
 *
 * Input: call transcript + industry id (known post-call from Stacks' branching).
 * Output: structured Assessment JSON matching /lib/assessment-schema.ts.
 *
 * Uses Claude Sonnet 4.6 (cheaper than Opus for this structured-output task,
 * and still strong on JSON adherence). Adaptive thinking. Prompt caching on
 * the tool catalog + extraction rubric — the stable prefix saves ~90% on
 * repeated extractions.
 */

import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { INDUSTRY_SCRIPTS, buildFullScript } from "./interview-scripts";
import { TOOLS, compactCatalogForPrompt } from "./tool-catalog";
import type { Assessment } from "./assessment-schema";

/* ============================================================
   Zod schema — mirrors /lib/assessment-schema.ts
   ============================================================ */

const tierEnum = z.enum(["quick-win", "major-project", "fill-in", "ignore"]);

const PainPointSchema = z.object({
  sourceQuestionId: z.string(),
  area: z.string(),
  currentState: z.string(),
  estimatedHoursPerWeek: z.number(),
  impactScore: z.number().int().min(1).max(5),
  effortScore: z.number().int().min(1).max(5),
  quadrant: tierEnum,
});

const ToolRecommendationSchema = z.object({
  toolId: z.string(),
  solvesPainAreas: z.array(z.string()),
  whyThisToolForYou: z.string(),
  priority: z.number().int().min(1),
});

const FourDayStepSchema = z.object({
  day: z.number().int().min(1).max(4),
  toolId: z.string(),
  title: z.string(),
  actionSteps: z.array(z.string()),
  estimatedMinutes: z.number().int(),
});

const MajorProjectSchema = z.object({
  toolId: z.string(),
  why: z.string(),
  estimatedSetupCost: z.string(),
});

const AssessmentOutputSchema = z.object({
  business: z.object({
    callerName: z.string(),
    businessName: z.string(),
    industryId: z.string(),
    industryLabel: z.string(),
    yearsInBusiness: z.number().nullable(),
    teamSize: z.number().nullable(),
    email: z.string().nullable(),
  }),
  executiveSummary: z.object({
    pain: z.string(),
    outcome: z.string(),
    focus: z.enum(["efficiency", "revenue", "cost", "quality"]),
  }),
  painPoints: z.array(PainPointSchema),
  quickWins: z.array(ToolRecommendationSchema),
  fourDayPlan: z.array(FourDayStepSchema),
  financialImpact: z.object({
    weeklyHoursReclaimed: z.number(),
    monthlyToolCost: z.number(),
    hourlyRateAssumed: z.number(),
    monthlyValueReclaimed: z.number(),
    monthlyNetRoi: z.number(),
  }),
  majorProjects: z.array(MajorProjectSchema),
});

type AssessmentOutput = z.infer<typeof AssessmentOutputSchema>;

/* ============================================================
   Extraction
   ============================================================ */

export interface ExtractInput {
  transcript: string;
  industryId: string;
  callerPhoneNumber?: string;
  callDurationSeconds?: number;
}

export async function extractAssessment(
  input: ExtractInput,
  options?: { apiKey?: string; model?: string }
): Promise<Assessment> {
  const client = new Anthropic({
    apiKey: options?.apiKey ?? process.env.ANTHROPIC_API_KEY,
  });

  const industry =
    INDUSTRY_SCRIPTS[input.industryId] ?? INDUSTRY_SCRIPTS.other;
  const questionList = buildFullScript(input.industryId)
    .map((q) => `- ${q.id}: ${q.text} (extracts: ${q.extractsField})`)
    .join("\n");

  const toolCatalog = compactCatalogForPrompt();

  // Stable prefix — cache this. Only the transcript at the end is volatile.
  const systemPrompt = `You are the post-call analyst for Stack Consulting AI's free AI Tools Assessment.

Stacks, our voice agent, just completed a ~20-minute inbound phone interview with a small business owner. You're given the raw transcript and the industry of the business. Your job: produce a structured JSON assessment that our Next.js page at /assessment/[uuid] will render as a Gamma-style report.

CONTEXT — the interview script Stacks followed:
${questionList}

CONTEXT — the tools you can recommend (do NOT invent new ones):
${toolCatalog}

EXTRACTION RULES:
1. For every question in the script Stacks covered, extract the caller's answer into the matching extractsField. If the caller didn't answer a question, skip it silently.
2. For each pain point, estimate impactScore (1-5) and effortScore (1-5), then place in the matrix:
   - Low effort (1-2) + high impact (3-5)  → "quick-win"
   - High effort (3-5) + high impact (3-5) → "major-project"
   - Low effort (1-2) + low impact (1-2)   → "fill-in"
   - High effort (3-5) + low impact (1-2)  → "ignore"
3. Quick-win tool recommendations:
   - Pick exactly 4 tools from the catalog with tier="quick-win".
   - Prefer tools whose categories match the caller's stated pain points.
   - If the caller is in "healthcare" industry, prefer tools with compliance:[hipaa]. NEVER recommend non-HIPAA tools for healthcare.
   - Prioritize by time-saved per dollar of monthly cost.
4. 4-day plan: Day 1 gets the highest-priority quick win (fastest setup first), one tool per day.
5. Financial impact:
   - weeklyHoursReclaimed = sum of weeklyHoursSaved for the 4 quick-wins
   - monthlyToolCost = sum of monthlyCost for the 4 quick-wins
   - hourlyRateAssumed = 150 (default effective rate for an SMB owner) unless the caller mentioned a specific rate
   - monthlyValueReclaimed = weeklyHoursReclaimed * 4.33 * hourlyRateAssumed
   - monthlyNetRoi = monthlyValueReclaimed - monthlyToolCost
6. Major projects: pick 2-3 tools with tier="major-project" that would be natural upsells after the quick wins land. Include a short "why" and "estimatedSetupCost" ($3-5K for process optimization, $1-3K for simple automations, etc.).
7. Executive summary:
   - pain: one-sentence description of the caller's top pain
   - outcome: one sentence of the promised outcome ("8+ hours/week back by removing X, Y, Z")
   - focus: "efficiency" if time-savings dominate, "revenue" if speed-to-lead / conversion dominate, "cost" if dollar savings dominate, "quality" if reputation / retention dominate

TONE RULES (voice of the report):
- Builder-first. Direct. No marketing fluff.
- Name specific tools, specific numbers, specific hours.
- Never say "leverage," "synergize," "unlock," "transform," "empower," "cutting-edge."
- If a data point is missing from the transcript, use null or omit — never invent.

INDUSTRY: ${industry.label} (id: ${industry.id})

Now analyze the transcript and produce the JSON.`;

  const userMessage = `TRANSCRIPT:

${input.transcript}`;

  const model = options?.model ?? "claude-sonnet-4-6";

  const response = await client.messages.parse({
    model,
    max_tokens: 16000,
    thinking: { type: "adaptive" },
    system: [
      {
        type: "text",
        text: systemPrompt,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [{ role: "user", content: userMessage }],
    output_config: {
      format: zodOutputFormat(AssessmentOutputSchema),
    },
  });

  if (!response.parsed_output) {
    throw new Error(
      `Claude did not return valid JSON. Stop reason: ${response.stop_reason}`
    );
  }

  const parsed = response.parsed_output as AssessmentOutput;

  const assessment: Assessment = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    business: parsed.business,
    executiveSummary: parsed.executiveSummary,
    painPoints: parsed.painPoints,
    quickWins: parsed.quickWins,
    fourDayPlan: parsed.fourDayPlan,
    financialImpact: parsed.financialImpact,
    majorProjects: parsed.majorProjects,
    rawTranscript: input.transcript,
    callDurationSeconds: input.callDurationSeconds,
    callerPhoneNumber: input.callerPhoneNumber,
    modelUsed: model,
  };

  return assessment;
}

/**
 * Sample transcript for testing without a real call.
 * Represents a boutique hotel owner in Palm Springs doing the interview.
 */
export const SAMPLE_BOUTIQUE_HOTEL_TRANSCRIPT = `
Stacks: Hi, this is Stacks from Stack Consulting AI. Thanks for calling for your free AI Tools Assessment. First — what's your name and the name of your business?

Caller: Hey Stacks, I'm Maria Rivera. I run The Desert Flower, a 12-room boutique hotel in downtown Palm Springs.

Stacks: Nice, Maria. How long have you been running The Desert Flower?

Caller: Going on four years now. Bought the property in early 2022.

Stacks: And how many people on the team, including you?

Caller: Six. Me, my husband who handles maintenance and the bar, a housekeeper who's full-time, two part-time housekeepers, and a front-desk person who covers afternoons.

Stacks: Got it. Which of these best describes your business? I've got boutique hotel on my list — does that fit?

Caller: Yeah, boutique hotel. That's us.

Stacks: Perfect. What's the split between direct bookings on your own website versus OTA bookings through Booking, Expedia, or Airbnb?

Caller: Way too much OTA. Probably 75 percent OTA, 25 percent direct. Airbnb is our biggest channel which kills me because their cut is brutal.

Stacks: And roughly what are you paying in OTA commissions each month?

Caller: I just ran those numbers last week. About $6,800 a month in commissions across all the OTAs. More in season.

Stacks: Ouch. Walk me through the guest journey from the minute they book to the minute they check out. Which parts are you proud of, which parts feel manual?

Caller: The in-person stuff I love. My husband greets everyone, the rooms are beautiful, we leave little notes. But everything before check-in is a mess. When a booking comes in, we manually send a welcome email with directions and the wifi. When the housekeepers finish a room I text them to confirm it's ready. When a guest asks about a restaurant at 9 PM my phone rings and I answer from home. After checkout I try to remember to ask for a review but half the time I forget.

Stacks: How are you handling guest messaging — pre-arrival info, questions during their stay, and the post-checkout follow-up?

Caller: Pre-arrival is me sitting at my laptop for 20 minutes copy-pasting a template and personalizing it. During the stay it's text messages to my personal phone. Post-checkout — like I said — sometimes I remember, sometimes I don't.

Stacks: When a guest wants a dinner recommendation, a tour, or a late checkout at 10 PM, how does that get handled?

Caller: They call the front desk line which rings my cell phone after 6 PM. I try to answer but honestly if I'm at dinner or asleep I miss them. I had a Google review last month complaining that nobody picked up when they needed wine glasses.

Stacks: Does someone always catch those, or do some slip through?

Caller: Some slip through. Probably 20 percent.

Stacks: What's your review process across Google, Tripadvisor, Yelp, and the OTA review streams — responding, asking for them?

Caller: I respond to the bad ones within a day or two. The good ones I read but often forget to reply. Asking for reviews — I do it in person at checkout when I remember. Probably 30 percent of happy guests actually leave one.

Stacks: How are you doing upsells — late checkout, breakfast, room upgrades, local experiences?

Caller: Basically nothing systematic. If a guest asks we accommodate. We have a little breakfast cart for $15 a person but I'd guess only 10 percent of guests know about it.

Stacks: How are you coordinating housekeeping and turnover between stays — who gets the signal, who confirms rooms are ready?

Caller: Text threads. My full-time housekeeper gets the daily list in the morning from our PMS, which is Cloudbeds. When rooms are ready she texts me and I mark it ready in the system. When we're short-staffed or a guest wants early check-in it gets chaotic.

Stacks: What's the single biggest thing keeping you from getting more direct bookings instead of paying those OTA commissions?

Caller: Honestly? Speed of response. When someone fills out our contact form asking about availability, we get back to them 6 or 8 hours later. Meanwhile they've already booked through Booking.com. If we could just respond instantly we'd convert way more of them directly.

Stacks: That makes sense. Of everything we just talked about, which of these pain points stings the most day-to-day?

Caller: The after-hours concierge stuff. Missing guest requests. That's the reputation risk. The OTA commissions bleed slower but both kill me.

Stacks: If I told you a tool could give you back five hours a week for around fifty dollars a month, what's the first thing you'd want to know about it?

Caller: Whether it plays nice with Cloudbeds and whether I actually have to learn something new. I don't have time to onboard a new tool every week.

Stacks: Fair. Anything I didn't ask about that you think matters?

Caller: We're fully booked for Coachella weekend and I'm already dreading the guest message volume. Any solution needs to handle spikes.

Stacks: Got it. Last one — what's the best email to send your assessment to?

Caller: maria@thedesertflower.com

Stacks: Can you spell that out for me, letter by letter?

Caller: M-A-R-I-A at T-H-E-D-E-S-E-R-T-F-L-O-W-E-R dot com.

Stacks: Perfect. Thanks Maria, this was great. Your assessment will land in your inbox within 24 hours, watch for a message from Stack Consulting AI. If you want to talk after reading it there's a link to book a 20-minute review call. Have a good one.

Caller: Thanks Stacks.
`;
