import { NextRequest, NextResponse } from "next/server";
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

async function handlePost(req: NextRequest) {
  let body: GenerateRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON" },
      { status: 400 },
    );
  }

  if (!authorize(req, body)) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  const videoUrl = body.videoUrl?.trim();
  if (!videoUrl) {
    return NextResponse.json(
      { ok: false, error: "videoUrl is required" },
      { status: 400 },
    );
  }

  let resolved;
  try {
    resolved = await resolveYouTubeInput(videoUrl);
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error:
          err instanceof Error
            ? `Could not resolve the YouTube URL: ${err.message}`
            : "Could not resolve the YouTube URL.",
      },
      { status: 400 },
    );
  }
  if (!resolved) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Could not extract a video from that URL. Paste a video link (watch?v=...), a channel (@handle), or /channel/UCxxx.",
      },
      { status: 400 },
    );
  }
  const videoId = resolved.videoId;

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "ANTHROPIC_API_KEY is not set. Add it in Vercel → Settings → Environment Variables.",
      },
      { status: 503 },
    );
  }

  const canonicalUrl = `https://www.youtube.com/watch?v=${videoId}`;

  const [metaResult, transcriptResult, analysisResult] = await Promise.allSettled([
    fetchVideoMeta(videoId),
    fetchTranscript(videoId),
    getGeminiApiKey()
      ? analyzeYouTubeVideo({ videoUrl: canonicalUrl })
      : Promise.reject(new Error("Gemini API key not configured")),
  ]);

  const meta =
    metaResult.status === "fulfilled"
      ? metaResult.value
      : { videoId, title: null, channel: null };

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

  if (!analysis && !transcript) {
    return NextResponse.json(
      {
        ok: false,
        stage: "source",
        error:
          "Could not analyze this video. Gemini failed" +
          (analysisError ? ` (${analysisError})` : "") +
          " and captions" +
          (transcriptError ? ` (${transcriptError})` : " were empty") +
          ".",
      },
      { status: 400 },
    );
  }

  const wordCount = transcript
    ? transcript.split(/\s+/).filter(Boolean).length
    : 0;

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
    return NextResponse.json(
      {
        ok: false,
        stage: "generate",
        error: err instanceof Error ? err.message : String(err),
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
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

/** Top-level wrapper that guarantees a JSON response even on uncaught errors. */
export async function POST(req: NextRequest) {
  try {
    return await handlePost(req);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const stack = err instanceof Error ? err.stack : undefined;
    console.error("[newsletter/generate] uncaught:", message, stack);
    return NextResponse.json(
      {
        ok: false,
        stage: "uncaught",
        error: `Server error: ${message}`,
      },
      { status: 500 },
    );
  }
}
