import { GoogleGenAI, Type } from "@google/genai";

export interface RepoItem {
  name: string;
  github_url: string | null;
  one_line: string;
  category:
    | "agent-tooling"
    | "infra"
    | "devtools"
    | "db-search"
    | "self-host-alt"
    | "other";
  replaces: string | null;
  why_it_matters: string;
  timestamp: string | null;
}

export interface VideoAnalysis {
  video_summary: string;
  total_repos_mentioned: number;
  repos: RepoItem[];
}

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    video_summary: {
      type: Type.STRING,
      description:
        "2-3 sentence summary of what this video covers and why it matters to a builder audience.",
    },
    total_repos_mentioned: {
      type: Type.INTEGER,
      description: "Total count of distinct GitHub repos discussed in the video.",
    },
    repos: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: {
            type: Type.STRING,
            description:
              "The repo name as mentioned (e.g., 'hippo-memory', 'PGEx Search'). Use the name shown on screen if visible.",
          },
          github_url: {
            type: Type.STRING,
            nullable: true,
            description:
              "Full github.com URL if visible on screen, otherwise null.",
          },
          one_line: {
            type: Type.STRING,
            description:
              "One concrete sentence stating what the repo does. No marketing fluff.",
          },
          category: {
            type: Type.STRING,
            enum: [
              "agent-tooling",
              "infra",
              "devtools",
              "db-search",
              "self-host-alt",
              "other",
            ],
            description:
              "Primary category. 'self-host-alt' = replaces a paid SaaS or expensive infra.",
          },
          replaces: {
            type: Type.STRING,
            nullable: true,
            description:
              "Paid service or common tool this replaces (ElasticSearch, Buffer, Algolia, HashiCorp Vault, Gmail, etc.). Null if nothing specific.",
          },
          why_it_matters: {
            type: Type.STRING,
            description:
              "2-3 sentence explanation of why a small business / developer would care. Concrete, not abstract.",
          },
          timestamp: {
            type: Type.STRING,
            nullable: true,
            description:
              "Timestamp in the video where this repo is discussed, format 'mm:ss' or 'hh:mm:ss'. Null if unknown.",
          },
        },
        required: [
          "name",
          "github_url",
          "one_line",
          "category",
          "replaces",
          "why_it_matters",
          "timestamp",
        ],
      },
    },
  },
  required: ["video_summary", "total_repos_mentioned", "repos"],
};

const EXTRACTION_PROMPT = `You are analyzing a video from a GitHub trending / tech news channel. Your job is to watch the video (both audio AND on-screen visuals) and extract every GitHub repo discussed.

CRITICAL:
- Catch repo names shown on screen even if the host doesn't say them clearly.
- Extract the GitHub URL when it's visible in the video (on screen, in the URL bar, etc.).
- For each repo, write a CONCRETE one-liner. Say what the tool actually does, not what it claims.
- Identify when a repo replaces a paid SaaS (ElasticSearch → PGEx Search, Buffer → Bright Bean, Algolia → Meili, Vault → Infisical, Gmail → BareMail, etc.).
- Note the approximate timestamp for each repo discussion.
- Audience = small business owners and builders. They care about: agent tooling, self-hostable SaaS replacements, concrete dev productivity wins, cost-savers. They skip: academic research, esoteric crypto, shell utility rewrites.
- If a repo is clearly low-signal or hype-only, still include it but flag it via a muted why_it_matters.

Return JSON matching the provided schema. Nothing else.`;

export async function analyzeYouTubeVideo(opts: {
  videoUrl: string;
  apiKey?: string;
  model?: string;
}): Promise<VideoAnalysis> {
  const apiKey = opts.apiKey ?? process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  const ai = new GoogleGenAI({ apiKey });

  const result = await ai.models.generateContent({
    model: opts.model ?? "gemini-2.5-flash",
    contents: [
      {
        role: "user",
        parts: [
          {
            fileData: {
              fileUri: opts.videoUrl,
              mimeType: "video/mp4",
            },
          },
          { text: EXTRACTION_PROMPT },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: RESPONSE_SCHEMA,
      temperature: 0.2,
    },
  });

  const text = result.text;
  if (!text) {
    throw new Error("Gemini returned empty response");
  }

  const parsed = JSON.parse(text) as VideoAnalysis;
  if (!parsed.repos || !Array.isArray(parsed.repos)) {
    throw new Error("Gemini response missing 'repos' array");
  }
  return parsed;
}

export function formatAnalysisForClaude(analysis: VideoAnalysis): string {
  const lines: string[] = [
    `VIDEO SUMMARY: ${analysis.video_summary}`,
    `TOTAL REPOS DISCUSSED: ${analysis.total_repos_mentioned}`,
    "",
    "REPOS EXTRACTED FROM VIDEO (audio + on-screen visuals):",
    "",
  ];
  analysis.repos.forEach((r, i) => {
    lines.push(`${i + 1}. ${r.name}`);
    if (r.github_url) lines.push(`   URL: ${r.github_url}`);
    lines.push(`   What it does: ${r.one_line}`);
    lines.push(`   Category: ${r.category}`);
    if (r.replaces) lines.push(`   Replaces: ${r.replaces}`);
    lines.push(`   Why it matters: ${r.why_it_matters}`);
    if (r.timestamp) lines.push(`   Timestamp: ${r.timestamp}`);
    lines.push("");
  });
  return lines.join("\n");
}
