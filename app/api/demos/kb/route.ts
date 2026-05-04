import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Demo 03 — KB Q&A. Mock streamed answer + citations until task #4 wires
// real pgvector retrieval over a seeded corpus + Claude Haiku generation.

const enc = new TextEncoder();
const send = (data: unknown) => enc.encode(`data: ${JSON.stringify(data)}\n\n`);

type KbAnswer = {
  match: RegExp;
  answer: string;
  citations: { source: string; snippet: string; score: number }[];
};

const ANSWERS: KbAnswer[] = [
  {
    match: /receptionist|starter|plan/i,
    answer:
      "The AI Receptionist Starter includes 24/7 inbound answering, caller qualification with up to 5 custom questions, calendar booking on one calendar (Google or Microsoft), warm transfer to one human destination, and a transcript emailed after every call. Setup is $4,997 with a $499/mo platform fee. Larger deployments use the Pro tier (multi-line, multi-calendar, CRM logging).",
    citations: [
      {
        source: "ai-receptionist.md",
        snippet:
          "Starter — $4,997 setup, $499/mo. 24/7 answer, single calendar, warm transfer to one destination, post-call transcript email.",
        score: 0.92,
      },
      {
        source: "pricing-faq.md",
        snippet:
          "All plans include the FreeSWITCH + OpenAI Realtime stack. Setup fee is one-time. Monthly covers infra, observability, prompt tuning.",
        score: 0.81,
      },
    ],
  },
  {
    match: /how long|timeline|build|web|website/i,
    answer:
      "A typical small-business marketing site runs 3–5 weeks: 1 week of discovery and copy, 2–3 weeks of build and content integration, then a 1-week QA and launch sprint. AI features (chat, intake, lead routing) add 1–2 weeks depending on integrations.",
    citations: [
      {
        source: "web-build-process.md",
        snippet:
          "Phase 1 (week 1): discovery + IA. Phase 2 (weeks 2–4): build, content, integrations. Phase 3 (week 5): QA, performance, launch.",
        score: 0.88,
      },
    ],
  },
  {
    match: /gohighlevel|ghl/i,
    answer:
      "Yes — we integrate with GoHighLevel via their REST API and webhooks. Common patterns we ship: AI receptionist writes contacts and notes into a GHL pipeline, a webhook triggers GHL workflows on call hangup, and the AI tags leads with intent + urgency before they hit a human.",
    citations: [
      {
        source: "integrations.md",
        snippet:
          "GoHighLevel — supported via REST + webhook. AI receptionist creates contacts, posts call summaries as notes, advances pipeline stages.",
        score: 0.94,
      },
    ],
  },
  {
    match: /haiku|sonnet|claude.*model|which model/i,
    answer:
      "We default to Claude Haiku 4.5 for high-throughput tasks like lead summarization, intent classification, and basic Q&A — it's fast and cheap. Claude Sonnet 4.6 is our pick for anything where reasoning quality matters: long-context extraction, complex retrieval grounding, structured outputs that have to be right the first time. Opus is reserved for one-off heavy lifts.",
    citations: [
      {
        source: "model-selection.md",
        snippet:
          "Default: Haiku 4.5 for lead routing, classification, summarization. Upgrade to Sonnet 4.6 when accuracy on structured outputs matters.",
        score: 0.9,
      },
    ],
  },
];

const FALLBACK = {
  answer:
    "I don't have a confident answer for that in this corpus. The sample knowledge base only covers AI Receptionist pricing, web-build timelines, GoHighLevel integrations, and our Claude model selection. For anything else, ask Chad directly via the contact form.",
  citations: [],
};

export async function POST(req: NextRequest) {
  let body: { question?: string } = {};
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 });
  }
  const q = (body.question ?? "").trim();
  if (!q) {
    return new Response(JSON.stringify({ error: "Empty question" }), { status: 400 });
  }

  const hit = ANSWERS.find((a) => a.match.test(q));
  const answer = hit?.answer ?? FALLBACK.answer;
  const citations = hit?.citations ?? FALLBACK.citations;

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

      controller.enqueue(send({ kind: "citations", items: citations }));
      await wait(120);

      const tokens = answer.split(/(\s+)/);
      for (const t of tokens) {
        controller.enqueue(send({ kind: "token", text: t }));
        await wait(15 + Math.random() * 25);
      }
      controller.enqueue(send({ kind: "done", ok: true }));
      controller.close();
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
