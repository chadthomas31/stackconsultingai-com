import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Demo 01 — Call Me. Mock SSE stream until task #3 wires real FreeSWITCH.
// Real version will: validate phone, rate-limit by IP, originate via FsPBX
// webhook (port 8089, ext 5002), persist as lead in Supabase, stream stage
// updates from a webhook callback.

const enc = new TextEncoder();
const sse = (event: string, data: unknown) =>
  enc.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);

const STAGES = [
  { id: "validated", label: "Number validated", detail: "E.164 format accepted", delayMs: 250 },
  { id: "originated", label: "Outbound call originated", detail: "FreeSWITCH leg created", delayMs: 700 },
  { id: "ringing", label: "Phone ringing", detail: "SIP 180 from carrier", delayMs: 900 },
  { id: "answered", label: "Caller answered", detail: "Bridging to OpenAI Realtime agent", delayMs: 600 },
];

export async function POST(req: NextRequest) {
  let body: { phone?: string } = {};
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 });
  }
  const digits = (body.phone ?? "").replace(/\D/g, "");
  if (digits.length !== 10) {
    return new Response(JSON.stringify({ error: "Invalid phone" }), { status: 400 });
  }

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
      controller.enqueue(sse("start", { phone: `+1${digits}` }));
      for (const stage of STAGES) {
        await wait(stage.delayMs);
        controller.enqueue(sse("stage", stage));
      }
      await wait(150);
      controller.enqueue(sse("done", { ok: true }));
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
