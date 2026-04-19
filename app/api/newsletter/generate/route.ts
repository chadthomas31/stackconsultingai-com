import { NextRequest, NextResponse } from "next/server";
import {
  extractVideoId,
  fetchTranscript,
  fetchVideoMeta,
} from "@/lib/youtube-transcript";
import { generateNewsletter } from "@/lib/newsletter-gen";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 90;

interface GenerateRequest {
  videoUrl?: string;
  customInstructions?: string;
  secret?: string;
}

function authorize(req: NextRequest, body: GenerateRequest) {
  const required = process.env.NEWSLETTER_ADMIN_SECRET;
  if (!required) return true; // Dev/unconfigured — allow (useful locally)
  const headerSecret = req.headers.get("x-admin-secret");
  const urlSecret = new URL(req.url).searchParams.get("secret");
  return (
    headerSecret === required ||
    urlSecret === required ||
    body.secret === required
  );
}

export async function POST(req: NextRequest) {
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

  const videoId = extractVideoId(videoUrl);
  if (!videoId) {
    return NextResponse.json(
      { ok: false, error: "Could not extract a YouTube video id from that URL" },
      { status: 400 },
    );
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "ANTHROPIC_API_KEY is not set in the server environment. Add it in Vercel → Settings → Environment Variables.",
      },
      { status: 503 },
    );
  }

  // 1. Fetch transcript + metadata in parallel
  let transcript: string;
  let meta;
  try {
    [transcript, meta] = await Promise.all([
      fetchTranscript(videoId),
      fetchVideoMeta(videoId),
    ]);
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        stage: "transcript",
        error:
          err instanceof Error
            ? err.message
            : "Could not fetch captions for this video.",
      },
      { status: 400 },
    );
  }

  const wordCount = transcript.split(/\s+/).filter(Boolean).length;
  if (wordCount < 80) {
    return NextResponse.json(
      {
        ok: false,
        stage: "transcript",
        error: `Transcript is too short (${wordCount} words). Try a longer video.`,
      },
      { status: 400 },
    );
  }

  // 2. Generate newsletter via Claude
  let draft;
  try {
    draft = await generateNewsletter({
      transcript,
      videoMeta: meta,
      videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
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
    videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
    meta,
    transcriptWordCount: wordCount,
    draft,
  });
}
