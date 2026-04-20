import { YoutubeTranscript } from "youtube-transcript";

export interface YouTubeVideoMeta {
  videoId: string;
  title: string | null;
  channel: string | null;
}

export interface YouTubeResolveResult {
  videoId: string;
  resolvedFrom: "video-url" | "bare-id" | "channel-latest";
  channelHandle?: string;
  channelTitle?: string;
  latestVideoTitle?: string;
}

/** Synchronous: extract a video id from a video URL. Returns null for channel URLs. */
export function extractVideoId(input: string): string | null {
  const raw = input.trim();
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

/** Returns true if this looks like a YouTube channel URL (not a video URL). */
function parseChannelUrl(input: string): {
  kind: "handle" | "channel-id" | "legacy-user" | "legacy-c";
  value: string;
} | null {
  try {
    const url = new URL(input.trim());
    const host = url.hostname.replace(/^www\./, "");
    if (!host.endsWith("youtube.com")) return null;

    const segments = url.pathname.split("/").filter(Boolean);
    if (segments.length === 0) return null;

    // /@handle
    if (segments[0].startsWith("@")) {
      return { kind: "handle", value: segments[0].slice(1) };
    }
    // /channel/UCxxx
    if (segments[0] === "channel" && segments[1]) {
      return { kind: "channel-id", value: segments[1] };
    }
    // /user/name (legacy)
    if (segments[0] === "user" && segments[1]) {
      return { kind: "legacy-user", value: segments[1] };
    }
    // /c/name (legacy custom)
    if (segments[0] === "c" && segments[1]) {
      return { kind: "legacy-c", value: segments[1] };
    }
  } catch {
    /* not a URL */
  }
  return null;
}

const BROWSER_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36";

/**
 * Fetch a channel's /videos tab and pull the most recent videoId + channel title.
 * We scrape the HTML because YouTube's RSS endpoint 404s on some channels.
 */
async function scrapeChannelLatest(channelUrl: string): Promise<{
  videoId: string;
  latestVideoTitle: string | null;
  channelTitle: string | null;
} | null> {
  const videosUrl = channelUrl.replace(/\/+$/, "") + "/videos";
  const res = await fetch(videosUrl, {
    headers: {
      "User-Agent": BROWSER_UA,
      "Accept-Language": "en-US,en;q=0.9",
    },
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) return null;
  const html = await res.text();

  const videoIdMatch = html.match(/"videoId":"([a-zA-Z0-9_-]{11})"/);
  if (!videoIdMatch) return null;
  const videoId = videoIdMatch[1];

  // Title: find the first "title":{"runs":[{"text":"..."}]} block that appears near our videoId.
  // The grid-renderer attaches a "title.runs[0].text" right after "videoId".
  const videoIdIndex = html.indexOf(`"videoId":"${videoId}"`);
  let latestVideoTitle: string | null = null;
  if (videoIdIndex >= 0) {
    const window = html.slice(videoIdIndex, videoIdIndex + 2000);
    const titleMatch =
      window.match(/"title":\{"runs":\[\{"text":"([^"\\]+(?:\\.[^"\\]*)*)"/) ||
      window.match(/"title":\{"simpleText":"([^"\\]+(?:\\.[^"\\]*)*)"/);
    if (titleMatch) {
      latestVideoTitle = titleMatch[1]
        .replace(/\\u0026/g, "&")
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, "\\");
    }
  }

  const chTitleMatch =
    html.match(/<meta property="og:title" content="([^"]+)"/) ||
    html.match(/<title>([^<]+)<\/title>/);
  const channelTitle = chTitleMatch
    ? chTitleMatch[1].replace(/ - YouTube$/, "").trim()
    : null;

  return { videoId, latestVideoTitle, channelTitle };
}

/**
 * Resolve any YouTube URL — video or channel — into a single videoId.
 * For channel URLs, returns the most-recently-published video from the RSS feed.
 */
export async function resolveYouTubeInput(
  input: string,
): Promise<YouTubeResolveResult | null> {
  const raw = input.trim();

  if (/^[a-zA-Z0-9_-]{11}$/.test(raw)) {
    return { videoId: raw, resolvedFrom: "bare-id" };
  }

  const directVideoId = extractVideoId(raw);
  if (directVideoId) {
    return { videoId: directVideoId, resolvedFrom: "video-url" };
  }

  const channel = parseChannelUrl(raw);
  if (!channel) return null;

  let lookupUrl: string;
  let channelHandle: string | undefined;
  if (channel.kind === "handle") {
    channelHandle = channel.value;
    lookupUrl = `https://www.youtube.com/@${channel.value}`;
  } else if (channel.kind === "channel-id") {
    lookupUrl = `https://www.youtube.com/channel/${channel.value}`;
  } else if (channel.kind === "legacy-user") {
    lookupUrl = `https://www.youtube.com/user/${channel.value}`;
  } else {
    lookupUrl = `https://www.youtube.com/c/${channel.value}`;
  }

  const latest = await scrapeChannelLatest(lookupUrl);
  if (!latest) return null;

  return {
    videoId: latest.videoId,
    resolvedFrom: "channel-latest",
    channelHandle,
    channelTitle: latest.channelTitle ?? undefined,
    latestVideoTitle: latest.latestVideoTitle ?? undefined,
  };
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
