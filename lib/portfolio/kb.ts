/**
 * Pre-baked knowledgebase for the portfolio RAG demo.
 *
 * Real Stack Consulting AI service docs — used as the corpus so the demo
 * shows a working RAG pipeline over actual content the hiring manager can
 * verify by reading the rest of the site.
 *
 * Pipeline at request time:
 *   1. Embed user question via text-embedding-3-small
 *   2. Cosine similarity against pre-computed chunk embeddings (cached
 *      in-memory across requests within the same lambda invocation)
 *   3. Top-3 chunks become context for chat.completions.create
 *   4. Response cites which chunks were retrieved
 */

import OpenAI from "openai";

export type KbChunk = {
  id: string;
  source: string;
  text: string;
};

export const KB_CHUNKS: KbChunk[] = [
  {
    id: "ai-receptionist-stack",
    source: "AI Receptionist · Stack",
    text: "The AI Receptionist product is built on FreeSWITCH for telephony, OpenAI Realtime API (gpt-realtime model) for the voice agent, Telnyx as the SIP trunk provider, and integrates with Google Calendar, Microsoft 365, Cal.com, GoHighLevel, HubSpot, and Supabase for booking and CRM logging. The system is hosted on the client's infrastructure (or ours), so customer data never sits in a vendor environment. There is no per-minute markup.",
  },
  {
    id: "ai-receptionist-pricing",
    source: "AI Receptionist · Pricing",
    text: "The AI Receptionist comes in two tiers. The Pilot tier is $4,997 one-time setup with approximately $300/month infrastructure cost. It includes a single phone line, one calendar integration, one CRM webhook, email transcripts, and warm transfer to a single destination, plus 30 days of post-launch tuning. The Production tier is $9,997 one-time setup with approximately $500/month infrastructure cost. It includes multiple lines and personas, IVR routing, after-hours rules, English plus Spanish, multiple integrations, analytics dashboard, custom escalation paths, 60 days of tuning, and an uptime SLA.",
  },
  {
    id: "ai-receptionist-timeline",
    source: "AI Receptionist · Timeline",
    text: "Pilot deployments go live in approximately 10 business days from contract signed. Production deployments take 3–4 weeks. The bottleneck is usually the calendar/CRM integration on the client side, not the voice agent. Voice agent answer time is sub-1-second.",
  },
  {
    id: "readiness-audit-tiers",
    source: "AI Readiness Audit · Tiers",
    text: "There are two AI Readiness Audit tiers, both flat-fee with no retainer. The Workflow Audit is $497 with 7-day delivery — one workflow mapped end-to-end, top 3 automation opportunities ranked by ROI, specific tool recommendations, fixed-price implementation quote, and a 1-page PDF deliverable plus 30-minute walkthrough. The Full AI Readiness Audit is $1,497 with 14-day delivery — two discovery calls, stack inventory, an 8-dimension readiness scorecard, top 5 use cases ranked by impact × feasibility, risk and compliance flags, a 12-page PDF report, and fixed-price implementation quotes. The Full Audit fee is credited toward any project shipped within 90 days.",
  },
  {
    id: "readiness-audit-method",
    source: "AI Readiness Audit · Method",
    text: "Audits are delivered by Chad McCluskey personally — no junior consultants, no offshore contractors. The audit can recommend not adopting AI yet if data hygiene, CRM completeness, or workflow documentation aren't ready. About 1 in 4 audits conclude with 'fix the foundation first, revisit AI in 6 months.' All recommendations name specific tools (Claude, GPT, Gemini, n8n, custom Node) without vendor kickbacks.",
  },
  {
    id: "geography",
    source: "Geography",
    text: "Stack Consulting AI is based in South Orange County, California (San Clemente area). Direct in-person meetings are available across Orange County including Irvine, Newport Beach, Costa Mesa, Mission Viejo, Aliso Viejo, Laguna Niguel, Dana Point, Lake Forest, Santa Ana, Anaheim, and Huntington Beach. AI Readiness Audits and remote-deployable systems are delivered to clients across the United States via video calls and shared docs. Mutual NDAs signed by default before any sensitive data moves.",
  },
  {
    id: "data-privacy",
    source: "Data Privacy",
    text: "Customer data is hosted on the client's own infrastructure — their Supabase, their Vercel, their Twilio or Telnyx, their FreeSWITCH instance. Stack Consulting does not retain copies of operational data. OpenAI processing runs under commercial no-train terms. For HIPAA workloads, a BAA is signed and PHI is kept out of conversation logs. PCI workloads are not processed via AI lines — calls are warm-transferred to existing PCI-compliant flows.",
  },
  {
    id: "comparison-vs-answering-services",
    source: "Comparison · Answering Services",
    text: "Goodcall, Smith.ai, and Ruby are subscription answering services that charge per minute or per call indefinitely. PolyAI sells to enterprise only. The AI Receptionist by Stack Consulting AI is a one-time build on FreeSWITCH that the client owns — lower long-term cost, no per-minute markup, full control over voice persona and script.",
  },
  {
    id: "what-not-built",
    source: "What we don't do",
    text: "Stack Consulting does not run paid ad campaigns, manage social media accounts, or write marketing copy as a service. The deliverable is always working software that runs the business: voice agents answering calls, automations processing leads, chatbots handling support questions. We build the systems behind the scenes, not the front-of-house marketing.",
  },
  {
    id: "free-assessment",
    source: "Free Assessment",
    text: "Before any paid engagement, Stack Consulting offers a free 30-minute AI assessment. We map current workflows, identify the highest-ROI opportunity, and give an honest answer — including 'not yet' if that's the right call. There is no pitch deck and no sales pressure. The assessment can be booked from the homepage at /#assessment or by calling (949) 749-0001.",
  },
];

const cosineSim = (a: number[], b: number[]) => {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
};

let cachedEmbeddings: number[][] | null = null;
let cachedAt: number | null = null;

export async function getKbEmbeddings(client: OpenAI): Promise<number[][]> {
  if (cachedEmbeddings) return cachedEmbeddings;
  const resp = await client.embeddings.create({
    model: "text-embedding-3-small",
    input: KB_CHUNKS.map((c) => c.text),
  });
  cachedEmbeddings = resp.data.map((d) => d.embedding);
  cachedAt = Date.now();
  return cachedEmbeddings;
}

export async function retrieveTopK(
  client: OpenAI,
  query: string,
  k = 3,
): Promise<{
  chunks: (KbChunk & { score: number })[];
  query_embed_tokens: number;
  cache_hit: boolean;
}> {
  const cacheHit = cachedEmbeddings !== null;
  const kbEmbeddings = await getKbEmbeddings(client);

  const queryResp = await client.embeddings.create({
    model: "text-embedding-3-small",
    input: query,
  });
  const queryEmbedding = queryResp.data[0].embedding;

  const scored = KB_CHUNKS.map((chunk, i) => ({
    ...chunk,
    score: cosineSim(queryEmbedding, kbEmbeddings[i]),
  })).sort((a, b) => b.score - a.score);

  return {
    chunks: scored.slice(0, k),
    query_embed_tokens: queryResp.usage.total_tokens,
    cache_hit: cacheHit,
  };
}

export function getCacheInfo() {
  return {
    cached: cachedEmbeddings !== null,
    chunk_count: KB_CHUNKS.length,
    cached_at_ms: cachedAt,
  };
}
