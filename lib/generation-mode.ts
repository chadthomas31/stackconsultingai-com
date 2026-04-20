/**
 * Pre-Gemini audit. Decides whether spending ~$0.10 on Gemini video analysis
 * is worth it for a given video, based on duration, captions, and user mode.
 */

export type GenerationMode = "auto" | "transcript-only" | "always-gemini";

export interface AuditInput {
  mode: GenerationMode;
  durationSeconds: number | null;
  hasTranscript: boolean;
  transcriptWordCount: number | null;
}

export interface AuditResult {
  useGemini: boolean;
  reason: string;
  estimatedGeminiCost: number | null;
  durationMinutes: number | null;
}

// Gemini 2.5 Flash video input pricing: ~263 tokens per second of video at
// $0.30 per 1M input tokens (as of early 2026). Adjust if pricing changes.
const GEMINI_VIDEO_TOKENS_PER_SECOND = 263;
const GEMINI_INPUT_PRICE_PER_1M_TOKENS = 0.3;

export function estimateGeminiCost(
  durationSeconds: number | null,
): number | null {
  if (!durationSeconds || durationSeconds <= 0) return null;
  const tokens = durationSeconds * GEMINI_VIDEO_TOKENS_PER_SECOND;
  return (tokens / 1_000_000) * GEMINI_INPUT_PRICE_PER_1M_TOKENS;
}

export function formatCost(cost: number | null): string {
  if (cost === null) return "?";
  if (cost < 0.01) return "<$0.01";
  return `~$${cost.toFixed(2)}`;
}

export function audit(input: AuditInput): AuditResult {
  const cost = estimateGeminiCost(input.durationSeconds);
  const durationMinutes = input.durationSeconds
    ? Math.round(input.durationSeconds / 60)
    : null;
  const durationLabel = durationMinutes !== null ? `${durationMinutes} min` : "unknown length";

  if (input.mode === "transcript-only") {
    if (!input.hasTranscript) {
      return {
        useGemini: false,
        reason:
          "Transcript-only mode selected, but this video has no captions. The draft will fail unless you switch modes.",
        estimatedGeminiCost: cost,
        durationMinutes,
      };
    }
    return {
      useGemini: false,
      reason: `Transcript-only mode. Saved ${formatCost(cost)}.`,
      estimatedGeminiCost: cost,
      durationMinutes,
    };
  }

  if (input.mode === "always-gemini") {
    return {
      useGemini: true,
      reason: `Always-Gemini mode. Estimated cost: ${formatCost(cost)}.`,
      estimatedGeminiCost: cost,
      durationMinutes,
    };
  }

  // AUTO mode — smart decision:

  if (!input.hasTranscript) {
    return {
      useGemini: true,
      reason: `No captions available — Gemini is the only option. Estimated cost: ${formatCost(cost)}.`,
      estimatedGeminiCost: cost,
      durationMinutes,
    };
  }

  // Short video with captions: transcripts are plenty.
  if (input.durationSeconds !== null && input.durationSeconds < 300) {
    return {
      useGemini: false,
      reason: `${durationLabel} video with captions — transcript alone is sufficient. Skipping Gemini saves ${formatCost(cost)}.`,
      estimatedGeminiCost: cost,
      durationMinutes,
    };
  }

  // Transcript is too thin (host mostly showing, barely talking): escalate.
  if (
    input.transcriptWordCount !== null &&
    input.transcriptWordCount < 400 &&
    input.durationSeconds !== null &&
    input.durationSeconds > 180
  ) {
    return {
      useGemini: true,
      reason: `Transcript is thin (${input.transcriptWordCount} words for a ${durationLabel} video — host is mostly showing, not speaking). Using Gemini for on-screen content. Estimated cost: ${formatCost(cost)}.`,
      estimatedGeminiCost: cost,
      durationMinutes,
    };
  }

  // Medium-to-long with good captions: use Gemini to catch on-screen details
  // (repo names shown but not spoken, demos, code).
  return {
    useGemini: true,
    reason: `${durationLabel} video with captions — using Gemini to catch on-screen repo names and demos. Estimated cost: ${formatCost(cost)}.`,
    estimatedGeminiCost: cost,
    durationMinutes,
  };
}
