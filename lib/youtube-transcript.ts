import { YoutubeTranscript } from "youtube-transcript";

export interface YouTubeVideoMeta {
  videoId: string;
  title: string | null;
  channel: string | null;
}

/** Extract the YouTube video id from any reasonable URL form. */
export function extractVideoId(input: string): string | null {
  const raw = input.trim();
  // Bare 11-char id
  if (/^[a-zA-Z0-9_-]{11}$/.test(raw)) return raw;

  try {
    const url = new URL(raw);
    const host = url.hostname.replace(/^www\./, "");
    if (host === "youtu.be") {
      return url.pathname.slice(1) || null;
    }
    if (host.endsWith("youtube.com")) {
      const v = url.searchParams.get("v");
      if (v) return v;
      // /embed/VIDEO_ID or /shorts/VIDEO_ID
      const segments = url.pathname.split("/").filter(Boolean);
      const idx = segments.findIndex(
        (s) => s === "embed" || s === "shorts" || s === "v",
      );
      if (idx >= 0 && segments[idx + 1]) return segments[idx + 1];
    }
  } catch {
    /* not a URL */
  }
  return null;
}

/** Fetch a single flattened transcript string for the given video. */
export async function fetchTranscript(videoId: string): Promise<string> {
  const items = await YoutubeTranscript.fetchTranscript(videoId, {
    lang: "en",
  });
  if (!items || items.length === 0) {
    throw new Error("No captions found for this video.");
  }
  return items
    .map((x) => x.text?.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join(" ");
}

/** Fetch basic metadata without auth via oEmbed endpoint. */
export async function fetchVideoMeta(
  videoId: string,
): Promise<YouTubeVideoMeta> {
  try {
    const res = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(
        `https://www.youtube.com/watch?v=${videoId}`,
      )}&format=json`,
      { signal: AbortSignal.timeout(8000) },
    );
    if (!res.ok) {
      return { videoId, title: null, channel: null };
    }
    const data = (await res.json()) as {
      title?: string;
      author_name?: string;
    };
    return {
      videoId,
      title: data.title || null,
      channel: data.author_name || null,
    };
  } catch {
    return { videoId, title: null, channel: null };
  }
}
