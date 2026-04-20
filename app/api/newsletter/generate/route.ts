import { NextRequest } from "next/server";
import {
  resolveYouTubeInput,
  fetchTranscript,
  fetchVideoMeta,
} from "@/lib/youtube-transcript";
import { generateNewsletter } from "@/lib/newsletter-gen";
import {
  analyzeYouTubeVideo,
  getGeminiApiKey,
  type VideoAnalysis,
} from "@/lib/gemini-video-extract";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

interface GenerateRequest {
  videoUrl?: string;
  customInstructions?: string;
  secret?: string;
}

function authorize(req: NextRequest, body: GenerateRequest) {
  const required = process.env.NEWSLETTER_ADMIN_SECRET;
  if (!required) return true;
  const headerSecret = req.headers.get("x-admin-secret");
  const urlSecret = new URL(req.url).searchParams.get("secret");
  return (
    headerSecret === required ||
    urlSecret === required ||
    body.secret === required
  );
}

/**
 * Streams progress events back to the browser as Server-Sent-Event lines.
 * Cloudflare's 524 timeout only applies until the first byte — once we start
 * streaming, the connection stays open for the full function runtime.
 */
export async function POST(req: NextRequest) {
  const encoder = new TextEncoder();
  let send: (data: Record<string, unknown>) => void = () => {};
  let closeStream: () => void = () => {};

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      send = (data) => {
        try {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(data)}\n\n`),
          );
        } catch {
          /* controller closed — ignore */
        }
      };
      closeStream = () => {
        try {
          controller.close();
        } catch {
          /* already closed */
        }
      };
      // Heartbeat so intermediate proxies (Cloudflare) see activity even
      // when Gemini is silent for 60+ seconds.
      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(": ping\n\n"));
        } catch {
          clearInterval(heartbeat);
        }
      }, 15000);

      runPipeline(req, send)
        .catch((err) => {
          const message = err instanceof Error ? err.message : String(err);
          const stack = err instanceof Error ? err.stack : undefined;
          console.error("[newsletter/generate] uncaught:", message, stack);
          send({
            type: "error",
            error: `Server error: ${message}`,
          });
        })
        .finally(() => {
          clearInterval(heartbeat);
          closeStream();
        });
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}

async function runPipeline(
  req: NextRequest,
  send: (data: Record<string, unknown>) => void,
) {
  let body: GenerateRequest;
  try {
    body = await req.json();
  } catch {
    send({ type: "error", error: "Invalid JSON" });
    return;
  }

  if (!authorize(req, body)) {
    send({ type: "error", error: "Unauthorized" });
    return;
  }

  const videoUrl = body.videoUrl?.trim();
  if (!videoUrl) {
    send({ type: "error", error: "videoUrl is required" });
    return;
  }

  send({ type: "progress", stage: "resolving-url" });

  let resolved;
  try {
    resolved = await resolveYouTubeInput(videoUrl);
  } catch (err) {
    send({
      type: "error",
      error:
        err instanceof Error
          ? `Could not resolve the YouTube URL: ${err.message}`
          : "Could not resolve the YouTube URL.",
    });
    return;
  }
  if (!resolved) {
    send({
      type: "error",
      error:
        "Could not extract a video from that URL. Paste a video link (watch?v=...), a channel (@handle), or /channel/UCxxx.",
    });
    return;
  }
  const videoId = resolved.videoId;
  const canonicalUrl = `https://www.youtube.com/watch?v=${videoId}`;

  send({
    type: "progress",
    stage: "resolved",
    videoId,
    videoUrl: canonicalUrl,
    resolvedFrom: resolved.resolvedFrom,
    channelHandle: resolved.channelHandle ?? null,
    channelTitle: resolved.channelTitle ?? null,
    latestVideoTitle: resolved.latestVideoTitle ?? null,
  });

  if (!process.env.ANTHROPIC_API_KEY) {
    send({
      type: "error",
      error:
        "ANTHROPIC_API_KEY is not set. Add it in Vercel → Settings → Environment Variables.",
    });
    return;
  }

  send({ type: "progress", stage: "fetching-metadata-and-analysis" });

  const [metaResult, transcriptResult, analysisResult] =
    await Promise.allSettled([
      fetchVideoMeta(videoId),
      fetchTranscript(videoId),
      getGeminiApiKey()
        ? analyzeYouTubeVideo({ videoUrl: canonicalUrl })
        : Promise.reject(new Error("Gemini API key not configured")),
    ]);

  const meta =
    metaResult.status === "fulfilled"
      ? metaResult.value
      : {
          videoId,
          title: null,
          channel: null,
          publishedAt: null,
          durationSeconds: null,
        };

  const transcript =
    transcriptResult.status === "fulfilled" ? transcriptResult.value : null;
  const transcriptError =
    transcriptResult.status === "rejected"
      ? transcriptResult.reason instanceof Error
        ? transcriptResult.reason.message
        : String(transcriptResult.reason)
      : null;

  const analysis: VideoAnalysis | null =
    analysisResult.status === "fulfilled" ? analysisResult.value : null;
  const analysisError =
    analysisResult.status === "rejected"
      ? analysisResult.reason instanceof Error
        ? analysisResult.reason.message
        : String(analysisResult.reason)
      : null;

  send({
    type: "progress",
    stage: "analysis-done",
    hasTranscript: !!transcript,
    hasAnalysis: !!analysis,
    reposExtracted: analysis?.total_repos_mentioned ?? null,
    transcriptWordCount: transcript
      ? transcript.split(/\s+/).filter(Boolean).length
      : 0,
  });

  if (!analysis && !transcript) {
    send({
      type: "error",
      error:
        "Could not analyze this video. Gemini failed" +
        (analysisError ? ` (${analysisError})` : "") +
        " and captions" +
        (transcriptError ? ` (${transcriptError})` : " were empty") +
        ".",
    });
    return;
  }

  send({ type: "progress", stage: "writing-newsletter" });

  let draft;
  try {
    draft = await generateNewsletter({
      transcript: transcript ?? undefined,
      analysis: analysis ?? undefined,
      videoMeta: meta,
      videoUrl: canonicalUrl,
      customInstructions: body.customInstructions,
    });
  } catch (err) {
    send({
      type: "error",
      error: err instanceof Error ? err.message : String(err),
    });
    return;
  }

  const wordCount = transcript
    ? transcript.split(/\s+/).filter(Boolean).length
    : 0;

  send({
    type: "done",
    ok: true,
    videoId,
    videoUrl: canonicalUrl,
    meta,
    resolvedFrom: resolved.resolvedFrom,
    channelHandle: resolved.channelHandle ?? null,
    channelTitle: resolved.channelTitle ?? null,
    latestVideoTitle: resolved.latestVideoTitle ?? null,
    transcriptWordCount: wordCount,
    source: analysis ? "gemini+transcript" : "transcript-only",
    reposExtracted: analysis?.total_repos_mentioned ?? null,
    analysisError,
    transcriptError,
    draft,
  });
}
