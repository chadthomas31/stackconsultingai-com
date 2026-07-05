import { NextRequest } from "next/server";
import OpenAI from "openai";
import { retrieveTopK } from "@/lib/portfolio/kb";
import { enforceRateLimit, rateLimitErrorPayload } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TOOL_SLUG = "demo-kb";
const MAX_QUESTION_LEN = 500;

const enc = new TextEncoder();
const send = (data: unknown) => enc.encode(`data: ${JSON.stringify(data)}\n\n`);

const jsonError = (message: string, status: number) =>
  new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "content-type": "application/json" },
  });

function snippet(text: string, maxLen = 120): string {
  const trimmed = text.trim();
  if (trimmed.length <= maxLen) return trimmed;
  return `${trimmed.slice(0, maxLen).trimEnd()}…`;
}

export async function POST(req: NextRequest) {
  let body: { question?: string } = {};
  try {
    body = await req.json();
  } catch {
    return jsonError("Invalid JSON", 400);
  }

  const q = (body.question ?? "").trim();
  if (!q) {
    return jsonError("Question is required", 400);
  }
  if (q.length > MAX_QUESTION_LEN) {
    return jsonError("Question too long. Limit 500 characters.", 400);
  }

  const rate = await enforceRateLimit(req, TOOL_SLUG);
  if (!rate.allowed) {
    return new Response(JSON.stringify(rateLimitErrorPayload(rate, TOOL_SLUG)), {
      status: 429,
      headers: { "content-type": "application/json" },
    });
  }

  if (!process.env.OPENAI_API_KEY) {
    return jsonError("Knowledge base demo is temporarily unavailable.", 503);
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  let retrieval;
  try {
    retrieval = await retrieveTopK(client, q, 3);
  } catch {
    return jsonError("Could not retrieve from the knowledge base. Try again.", 502);
  }

  const citations = retrieval.chunks.map((c) => ({
    source: c.source,
    snippet: snippet(c.text),
    score: c.score,
  }));

  const context = retrieval.chunks
    .map((c, i) => `[Source ${i + 1} · ${c.source}]\n${c.text}`)
    .join("\n\n");

  const systemPrompt = `You are a helpful assistant answering questions about Stack Consulting AI using ONLY the context below. Cite sources by their bracketed number, e.g. [Source 1]. If the answer is not in the context, say so plainly — do not invent details.\n\n=== CONTEXT ===\n${context}\n=== END CONTEXT ===`;

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const safeEnqueue = (chunk: Uint8Array) => {
        try {
          controller.enqueue(chunk);
        } catch {
          // controller already closed
        }
      };

      safeEnqueue(send({ kind: "citations", items: citations }));

      try {
        const completion = await client.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: q },
          ],
          temperature: 0.2,
          max_tokens: 400,
          stream: true,
        });

        for await (const part of completion) {
          const text = part.choices[0]?.delta?.content;
          if (text) {
            safeEnqueue(send({ kind: "token", text }));
          }
        }

        safeEnqueue(send({ kind: "done", ok: true }));
      } catch {
        safeEnqueue(
          send({ kind: "error", message: "Answer generation failed. Try again." }),
        );
      } finally {
        try {
          controller.close();
        } catch {
          // already closed
        }
      }
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
