/**
 * Keyword + on-page SEO audit. Lighthouse only checks technical SEO
 * (meta tags, robots, viewport). It says nothing about KEYWORDS — the
 * actual signal Google uses to rank a local business site.
 *
 * This stage extracts the visible content from the page HTML and asks
 * Claude Haiku to evaluate keyword usage, density, missing local terms,
 * H1/title alignment, and local SEO signals (NAP, schema, geo-meta).
 *
 * Output is industry-aware: a dental site gets evaluated against dental
 * keyword expectations; a plumber gets evaluated against plumbing terms.
 */

import Anthropic from "@anthropic-ai/sdk";
import type Anthropic_ from "@anthropic-ai/sdk";

export type ExtractedContent = {
  title: string | null;
  metaDescription: string | null;
  h1s: string[];
  h2s: string[];
  h3s: string[];
  bodyExcerpt: string;
  imageAlts: string[];
  hasNapBlock: boolean;
  hasSchemaOrg: boolean;
  hasGeoMeta: boolean;
};

export type KeywordReport = {
  primary_keyword_detected: string;
  primary_keyword_strength: "strong" | "moderate" | "weak" | "missing";
  keywords_present: Array<{
    term: string;
    location: "title" | "h1" | "h2" | "body" | "alt" | "meta";
    density: "high" | "medium" | "low";
  }>;
  keywords_missing: Array<{
    term: string;
    why_important: string;
    estimated_monthly_searches: string;
  }>;
  headline_alignment: {
    score: "good" | "fair" | "poor";
    note: string;
  };
  local_seo: {
    has_nap: boolean;
    has_schema: boolean;
    has_geo_meta: boolean;
    has_city_in_title: boolean;
    note: string;
  };
  recommendations: string[];
};

const TOOL_SCHEMA: Anthropic_.Tool = {
  name: "emit_keyword_report",
  description: "Emit the structured keyword and on-page SEO audit.",
  input_schema: {
    type: "object",
    properties: {
      primary_keyword_detected: {
        type: "string",
        description:
          "The single most-targeted keyword phrase the page appears to be optimizing for. e.g. 'orange county dental implants', 'plumber san clemente'.",
      },
      primary_keyword_strength: {
        type: "string",
        enum: ["strong", "moderate", "weak", "missing"],
        description:
          "How well the primary keyword appears in title + H1 + body. 'strong' = all three. 'missing' = page has no clear keyword target.",
      },
      keywords_present: {
        type: "array",
        minItems: 3,
        maxItems: 8,
        items: {
          type: "object",
          properties: {
            term: { type: "string" },
            location: {
              type: "string",
              enum: ["title", "h1", "h2", "body", "alt", "meta"],
            },
            density: { type: "string", enum: ["high", "medium", "low"] },
          },
          required: ["term", "location", "density"],
        },
      },
      keywords_missing: {
        type: "array",
        minItems: 3,
        maxItems: 6,
        items: {
          type: "object",
          properties: {
            term: { type: "string" },
            why_important: {
              type: "string",
              description:
                "1 sentence on why this keyword matters for THIS industry/location.",
            },
            estimated_monthly_searches: {
              type: "string",
              description:
                "Rough volume estimate as a range string, e.g. '500-1K', '1K-5K', '5K+'. Use SoCal local volume.",
            },
          },
          required: ["term", "why_important", "estimated_monthly_searches"],
        },
      },
      headline_alignment: {
        type: "object",
        properties: {
          score: { type: "string", enum: ["good", "fair", "poor"] },
          note: {
            type: "string",
            description:
              "1-2 sentences. Does the H1 match what someone would search to find this business? If not, what should it be?",
          },
        },
        required: ["score", "note"],
      },
      local_seo: {
        type: "object",
        properties: {
          has_nap: { type: "boolean" },
          has_schema: { type: "boolean" },
          has_geo_meta: { type: "boolean" },
          has_city_in_title: { type: "boolean" },
          note: {
            type: "string",
            description:
              "1 sentence summary. e.g. 'NAP and schema present but city not in title — adding it would lift local rankings'.",
          },
        },
        required: [
          "has_nap",
          "has_schema",
          "has_geo_meta",
          "has_city_in_title",
          "note",
        ],
      },
      recommendations: {
        type: "array",
        minItems: 3,
        maxItems: 5,
        items: { type: "string" },
        description:
          "Concrete, do-this-on-Monday actions. e.g. 'Add \"Orange County\" to the homepage H1', 'Write a service page targeting \"dental implants Newport Beach\"'.",
      },
    },
    required: [
      "primary_keyword_detected",
      "primary_keyword_strength",
      "keywords_present",
      "keywords_missing",
      "headline_alignment",
      "local_seo",
      "recommendations",
    ],
  },
};

const SYSTEM_PROMPT = `You are the local SEO analyst for Stack Consulting AI, a Southern California consulting firm.

You receive the visible content of a small business website. Your job: evaluate KEYWORD usage and local SEO signals — not technical SEO. The audience is a non-technical small business owner deciding whether to hire Stack Consulting AI for SEO work.

Most local businesses make the same mistakes:
1. Their H1 is "Welcome" or their business name instead of what people actually search for ("Dental implants in Orange County").
2. They never name the city/region they serve in title tags or H1.
3. They have no service-specific landing pages (one homepage trying to rank for everything).
4. They have NAP (Name/Address/Phone) buried in the footer instead of marked up in schema.org.

YOUR FOCUS
- Identify the primary keyword they appear to target (or note that none is clear).
- Spot keywords PRESENT in title/H1/H2/body/alts/meta.
- Spot industry-critical keywords MISSING. For local SoCal businesses, "missing" almost always includes city + service combinations like "[service] [city]" or "[service] near [neighborhood]".
- Judge whether their H1 matches search intent.
- Check local SEO: NAP, schema.org markup, geo meta tags, city in title.
- Recommend 3-5 concrete actions.

INDUSTRY-SPECIFIC HIGH-VALUE KEYWORDS TO LOOK FOR
- Dental: "implants", "cosmetic dentist", "emergency dentist", "[city] dentist", "Invisalign", "veneers", "full mouth reconstruction"
- Medical: "[specialty] doctor", "telehealth", "[condition] treatment", "[city] [specialty]"
- Legal: "personal injury lawyer", "DUI attorney", "free consultation", "[city] lawyer", "no fee unless we win"
- Plumbing/HVAC: "emergency plumber", "24 hour", "water heater", "AC repair", "[city] plumber"
- Auto: "auto repair", "[make] mechanic", "smog check", "brake service", "[city] auto"
- Real estate: "[city] homes for sale", "luxury", "[neighborhood]", "agent", "buyer", "seller"
- Restaurant: "[cuisine] [city]", "delivery", "catering", "happy hour", "private dining"
- Fitness: "personal training", "[modality] [city]", "membership", "boot camp"

VOICE RULES (Stack Consulting AI brand voice — mandatory)
- Builder voice. Direct. Concrete. Slight opinion.
- NEVER use: "leverage", "synergize", "unlock", "transform", "empower", "cutting-edge", "robust", "seamless".
- Always concrete: name the keyword, name the location, name the action.
- No exclamation marks. No emoji. No hype.

OUTPUT
Call the emit_keyword_report tool exactly once with the full JSON. No prose before or after.`;

export async function auditKeywords(input: {
  url: string;
  industryLabel: string;
  content: ExtractedContent;
  apiKey?: string;
  model?: string;
}): Promise<KeywordReport> {
  const client = new Anthropic({
    apiKey: input.apiKey ?? process.env.ANTHROPIC_API_KEY,
  });

  const userMessage = buildUserMessage(input.url, input.industryLabel, input.content);

  const response = await client.messages.create({
    model: input.model ?? "claude-haiku-4-5",
    max_tokens: 1800,
    tools: [TOOL_SCHEMA],
    tool_choice: { type: "tool", name: "emit_keyword_report" },
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
    throw new Error("Keyword model did not return a tool_use block");
  }

  return toolUse.input as KeywordReport;
}

function buildUserMessage(url: string, industryLabel: string, c: ExtractedContent): string {
  return `SITE: ${url}
INDUSTRY: ${industryLabel}

TITLE: ${c.title ?? "(missing)"}
META DESCRIPTION: ${c.metaDescription ?? "(missing)"}

H1 TAGS (${c.h1s.length}):
${c.h1s.map((h) => `- ${h}`).join("\n") || "(none)"}

H2 TAGS (${c.h2s.length}):
${c.h2s.slice(0, 12).map((h) => `- ${h}`).join("\n") || "(none)"}

H3 TAGS (${c.h3s.length}):
${c.h3s.slice(0, 8).map((h) => `- ${h}`).join("\n") || "(none)"}

IMAGE ALT TEXTS (sample of ${Math.min(c.imageAlts.length, 10)} of ${c.imageAlts.length}):
${c.imageAlts.slice(0, 10).map((a) => `- ${a}`).join("\n") || "(none)"}

LOCAL SEO MARKERS DETECTED IN HTML:
- NAP block visible: ${c.hasNapBlock}
- Schema.org markup: ${c.hasSchemaOrg}
- Geo meta tags: ${c.hasGeoMeta}

VISIBLE BODY CONTENT EXCERPT (first 2000 chars):
${c.bodyExcerpt}

Produce the keyword audit now.`;
}

/**
 * Extract the structured content needed for keyword analysis from a raw
 * HTML string. Pure regex / string ops — no DOM parser dependency, since
 * we just need the obvious things (title, headings, alts, body text).
 */
export function extractContent(html: string): ExtractedContent {
  const stripTags = (s: string) =>
    s
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/\s+/g, " ")
      .trim();

  const titleMatch = html.match(/<title[^>]*>([^<]{1,300})<\/title>/i);
  const metaMatch =
    html.match(
      /<meta[^>]+name=["']description["'][^>]+content=["']([^"']{0,400})["']/i,
    ) ??
    html.match(
      /<meta[^>]+content=["']([^"']{0,400})["'][^>]+name=["']description["']/i,
    );

  const matchAll = (re: RegExp): string[] => {
    const out: string[] = [];
    let m: RegExpExecArray | null;
    while ((m = re.exec(html)) !== null) {
      const text = stripTags(m[1] ?? "");
      if (text && text.length < 300) out.push(text);
      if (out.length > 30) break;
    }
    return out;
  };

  const h1s = matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi);
  const h2s = matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi);
  const h3s = matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>/gi);

  const altRe = /<img[^>]+alt=["']([^"']{1,200})["']/gi;
  const imageAlts: string[] = [];
  let altMatch: RegExpExecArray | null;
  while ((altMatch = altRe.exec(html)) !== null) {
    if (altMatch[1].trim()) imageAlts.push(altMatch[1].trim());
    if (imageAlts.length > 30) break;
  }

  const bodyMatch = html.match(/<body[\s\S]*?<\/body>/i);
  const bodyText = bodyMatch ? stripTags(bodyMatch[0]) : stripTags(html);
  const bodyExcerpt = bodyText.slice(0, 2000);

  const hasNapBlock =
    /\b\d{3}[-.)\s]?\d{3}[-.\s]?\d{4}\b/.test(bodyText) &&
    /\b(suite|ste|ave|avenue|st|street|blvd|boulevard|rd|road|dr|drive|hwy|highway|ln|lane|ct|court)\b/i.test(
      bodyText,
    );
  const hasSchemaOrg = /schema\.org|application\/ld\+json/i.test(html);
  const hasGeoMeta =
    /<meta[^>]+(name|property)=["'](geo\.|og:locality|og:region|place:location)/i.test(
      html,
    );

  return {
    title: titleMatch?.[1]?.trim() || null,
    metaDescription: metaMatch?.[1]?.trim() || null,
    h1s,
    h2s,
    h3s,
    bodyExcerpt,
    imageAlts,
    hasNapBlock,
    hasSchemaOrg,
    hasGeoMeta,
  };
}
