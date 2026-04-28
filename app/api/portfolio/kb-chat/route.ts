import { NextResponse } from "next/server";
import OpenAI from "openai";
import { retrieveTopK } from "@/lib/portfolio/kb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ReqBody = { question?: string };

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      {
        error:
          "OPENAI_API_KEY not configured on the server. This demo requires the env var to be set.",
      },
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

  const question = body.question?.trim();
  if (!question) {
    return NextResponse.json(
      { error: "Field `question` is required." },
      { status: 400 },
    );
  }
  if (question.length > 500) {
    return NextResponse.json(
      { error: "Question too long. Limit 500 characters." },
      { status: 400 },
    );
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const t0 = Date.now();

  let retrieval;
  try {
    retrieval = await retrieveTopK(client, question, 3);
  } catch (err) {
    return NextResponse.json(
      {
        error: "Embeddings call failed.",
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 502 },
    );
  }
  const t_embed = Date.now() - t0;

  const context = retrieval.chunks
    .map(
      (c, i) =>
        `[Source ${i + 1} · ${c.source}]\n${c.text}`,
    )
    .join("\n\n");

  const systemPrompt = `You are a helpful assistant answering questions about Stack Consulting AI using ONLY the context below. Cite sources by their bracketed number, e.g. [Source 1]. If the answer is not in the context, say so plainly — do not invent details.\n\n=== CONTEXT ===\n${context}\n=== END CONTEXT ===`;

  const t1 = Date.now();
  let completion;
  try {
    completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: question },
      ],
      temperature: 0.2,
      max_tokens: 400,
    });
  } catch (err) {
    return NextResponse.json(
      {
        error: "Chat completion failed.",
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 502 },
    );
  }
  const t_chat = Date.now() - t1;
  const t_total = Date.now() - t0;

  const answer =
    completion.choices[0]?.message?.content?.trim() ?? "(no response)";

  return NextResponse.json({
    answer,
    sources: retrieval.chunks.map((c, i) => ({
      ref: i + 1,
      id: c.id,
      source: c.source,
      score: Number(c.score.toFixed(4)),
    })),
    usage: {
      embed_tokens: retrieval.query_embed_tokens,
      prompt_tokens: completion.usage?.prompt_tokens ?? 0,
      completion_tokens: completion.usage?.completion_tokens ?? 0,
      total_tokens: completion.usage?.total_tokens ?? 0,
    },
    timing_ms: {
      embed: t_embed,
      chat: t_chat,
      total: t_total,
    },
    embeddings_cache_hit: retrieval.cache_hit,
    model: completion.model,
  });
}
