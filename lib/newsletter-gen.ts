import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import type { YouTubeVideoMeta } from "./youtube-transcript";
import type { VideoAnalysis } from "./gemini-video-extract";
import { formatAnalysisForClaude } from "./gemini-video-extract";

export const NewsletterDraftSchema = z.object({
  subject: z.string().max(70),
  preheader: z.string().max(140),
  markdown_body: z.string(),
});

export type NewsletterDraft = z.infer<typeof NewsletterDraftSchema>;

import type Anthropic_ from "@anthropic-ai/sdk";

const TOOL_SCHEMA: Anthropic_.Tool = {
  name: "emit_newsletter_draft",
  description:
    "Emit the final newsletter draft with subject, preheader, and markdown body.",
  input_schema: {
    type: "object",
    properties: {
      subject: {
        type: "string",
        maxLength: 70,
        description: "Email subject line, ≤ 65 chars, punchy and specific.",
      },
      preheader: {
        type: "string",
        maxLength: 140,
        description:
          "Preheader shown after subject in the inbox, ≤ 120 chars. One compelling sentence.",
      },
      markdown_body: {
        type: "string",
        description:
          "Full newsletter body in markdown. Uses H1/H2/H3. Includes sections, featured items, a 'Quick hits' list, and a sign-off. Must cite the source video at the end.",
      },
    },
    required: ["subject", "preheader", "markdown_body"],
  },
};

const SYSTEM_PROMPT = `You are the curator of "The Stack Report" — the biweekly newsletter for Stack Consulting AI (stackconsultingai.com). Stack is run by Chad McCluskey, a builder-turned-consultant in Southern California who helps small businesses implement practical AI. Audience is SMB owners + dev-curious folks who want useful tools, not hype.

VOICE RULES (non-negotiable):
- Builder voice: concrete, specific, slightly opinionated. Name the tool, name what it actually does, name the alternative it replaces.
- NEVER use: "unlock", "transform", "synergize", "leverage", "empower", "in today's world", "cutting-edge", "revolutionary", "game-changing".
- Keep items punchy — 2-3 sentences each. No marketing fluff.
- It's fine to be skeptical when something deserves it.
- When a repo replaces an expensive SaaS or home-rolled infra, say so directly ("replaces ElasticSearch / Buffer / HashiCorp Vault / etc.").

STRUCTURE:
- Subject line: ≤ 65 chars, punchy, specific. Try formats like "N trending repos, M you'll actually use" or lead with the single most interesting thing.
- Preheader: one additional sentence that teases 2-3 specifics from the body.
- Markdown body (~500-900 words):
  - Short intro (1-2 sentences) — don't over-explain
  - 3-4 thematic sections, each with 2-3 featured items (H3 item names bolded, then 2-3 sentences)
  - A "Quick hits" section with 5-8 short one-liners
  - Sign-off (1-2 sentences) with an ask (e.g., "reply if any of these would actually help")
  - Cite the source YouTube video at the end

PICK WHAT MATTERS:
- Audience cares most about: AI agent tooling, dev productivity, self-hostable alternatives to expensive SaaS, concrete automations, cost-savers. Less about: deep systems plumbing, very niche crypto, academic novelties (unless wildly clever).
- From any transcript, pick 8-12 items worth featuring and 5-8 quick hits. Skip items that wouldn't land for the audience.

OUTPUT:
- JSON matching the provided schema. No commentary outside the JSON.`;

export async function generateNewsletter(opts: {
  transcript?: string;
  analysis?: VideoAnalysis;
  videoMeta: YouTubeVideoMeta;
  videoUrl: string;
  customInstructions?: string;
  apiKey?: string;
  model?: string;
}): Promise<NewsletterDraft> {
  if (!opts.transcript && !opts.analysis) {
    throw new Error(
      "generateNewsletter needs either a transcript or a Gemini analysis.",
    );
  }

  const client = new Anthropic({
    apiKey: opts.apiKey ?? process.env.ANTHROPIC_API_KEY,
  });

  const contextBlock = [
    `Source video: ${opts.videoUrl}`,
    opts.videoMeta.title ? `Title: ${opts.videoMeta.title}` : null,
    opts.videoMeta.channel ? `Channel: ${opts.videoMeta.channel}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const sourceBlock = opts.analysis
    ? [
        "Gemini watched the video (both audio and on-screen visuals) and extracted the following structured data. Prefer this over the raw transcript when they conflict — it includes repo names shown on screen that the host may not have said aloud.",
        "",
        formatAnalysisForClaude(opts.analysis),
        opts.transcript
          ? "\nRaw transcript (supplementary, may fill in host commentary or quotes):\n" +
            opts.transcript
          : "",
      ]
        .filter(Boolean)
        .join("\n")
    : `TRANSCRIPT:\n${opts.transcript}`;

  const userMessage = [
    contextBlock,
    "",
    opts.customInstructions
      ? `Additional guidance: ${opts.customInstructions}`
      : "",
    "",
    sourceBlock,
    "",
    "Return the newsletter draft as JSON matching the schema.",
  ]
    .filter(Boolean)
    .join("\n");

  const response = await client.messages.create({
    model: opts.model ?? "claude-sonnet-4-6",
    max_tokens: 4096,
    system: [
      {
        type: "text",
        text: SYSTEM_PROMPT,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [{ role: "user", content: userMessage }],
    tools: [TOOL_SCHEMA],
    tool_choice: { type: "tool", name: "emit_newsletter_draft" },
  });

  const toolUse = response.content.find((b) => b.type === "tool_use");
  if (!toolUse || toolUse.type !== "tool_use") {
    throw new Error("Claude did not call the newsletter tool.");
  }
  return NewsletterDraftSchema.parse(toolUse.input);
}
