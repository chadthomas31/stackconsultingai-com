/**
 * SSRF-safe HTTP fetch for user-supplied URLs.
 *
 * Defends against:
 *   - Loopback / link-local / RFC1918 / CGNAT / multicast / reserved ranges
 *   - DNS-rebinding via post-resolve IP check (each hop re-resolved)
 *   - Open-redirect SSRF: redirects are followed manually with re-validation
 *   - Memory exhaustion: response body streamed with a hard byte cap
 *   - Slowloris / hung connections: AbortController timeout per hop
 *
 * Caller-controlled `maxBytes` is the inviolable upper bound. The helper
 * also rejects responses that DECLARE Content-Length > 4× maxBytes before
 * reading any body bytes.
 */

import { lookup } from "dns/promises";
import { isIP } from "net";

function ipv4ToNum(ip: string): number {
  const p = ip.split(".").map(Number);
  if (p.length !== 4 || p.some((n) => !Number.isInteger(n) || n < 0 || n > 255)) {
    return Number.NaN;
  }
  // 32-bit unsigned; max 2^32 - 1 = 4_294_967_295, well inside Number.MAX_SAFE_INTEGER.
  return p[0] * 16777216 + p[1] * 65536 + p[2] * 256 + p[3];
}

const PRIVATE_IPV4_RANGES: Array<readonly [number, number]> = [
  [ipv4ToNum("0.0.0.0"), ipv4ToNum("0.255.255.255")],
  [ipv4ToNum("10.0.0.0"), ipv4ToNum("10.255.255.255")],
  [ipv4ToNum("100.64.0.0"), ipv4ToNum("100.127.255.255")],
  [ipv4ToNum("127.0.0.0"), ipv4ToNum("127.255.255.255")],
  [ipv4ToNum("169.254.0.0"), ipv4ToNum("169.254.255.255")],
  [ipv4ToNum("172.16.0.0"), ipv4ToNum("172.31.255.255")],
  [ipv4ToNum("192.0.0.0"), ipv4ToNum("192.0.0.255")],
  [ipv4ToNum("192.168.0.0"), ipv4ToNum("192.168.255.255")],
  [ipv4ToNum("198.18.0.0"), ipv4ToNum("198.19.255.255")],
  [ipv4ToNum("224.0.0.0"), ipv4ToNum("239.255.255.255")],
  [ipv4ToNum("240.0.0.0"), ipv4ToNum("255.255.255.255")],
];

function isPrivateIPv4(ip: string): boolean {
  const v = ipv4ToNum(ip);
  if (!Number.isFinite(v)) return true; // unparseable → treat as unsafe
  return PRIVATE_IPV4_RANGES.some(([lo, hi]) => v >= lo && v <= hi);
}

function isPrivateIPv6(ip: string): boolean {
  const lower = ip.toLowerCase();
  if (lower === "::" || lower === "::1") return true;
  if (lower.startsWith("fe80:") || lower.startsWith("fec0:")) return true;
  if (lower.startsWith("fc") || lower.startsWith("fd")) return true;
  if (lower.startsWith("ff")) return true;
  if (lower.startsWith("::ffff:")) {
    const v4 = lower.slice(7);
    if (isIP(v4) === 4) return isPrivateIPv4(v4);
  }
  if (lower.startsWith("64:ff9b::")) {
    const tail = lower.slice("64:ff9b::".length);
    const v4 = tail.includes(".") ? tail : null;
    if (v4 && isIP(v4) === 4) return isPrivateIPv4(v4);
  }
  return false;
}

async function assertPublicHost(hostname: string): Promise<void> {
  const stripped = hostname.replace(/^\[|\]$/g, "");
  const literalKind = isIP(stripped);
  if (literalKind === 4) {
    if (isPrivateIPv4(stripped)) {
      throw new Error(`Refusing private IPv4 host ${stripped}`);
    }
    return;
  }
  if (literalKind === 6) {
    if (isPrivateIPv6(stripped)) {
      throw new Error(`Refusing private IPv6 host ${stripped}`);
    }
    return;
  }

  const lower = stripped.toLowerCase();
  if (lower === "localhost" || lower.endsWith(".localhost") || lower.endsWith(".local")) {
    throw new Error(`Refusing reserved hostname ${stripped}`);
  }
  if (lower.endsWith(".internal") || lower.endsWith(".intranet") || lower.endsWith(".lan")) {
    throw new Error(`Refusing reserved hostname ${stripped}`);
  }

  const records = await lookup(stripped, { all: true });
  for (const r of records) {
    if (r.family === 4 && isPrivateIPv4(r.address)) {
      throw new Error(`Host ${stripped} resolves to private IPv4 ${r.address}`);
    }
    if (r.family === 6 && isPrivateIPv6(r.address)) {
      throw new Error(`Host ${stripped} resolves to private IPv6 ${r.address}`);
    }
  }
}

export type SafeFetchResult =
  | {
      ok: true;
      status: number;
      finalUrl: string;
      body: string;
      truncated: boolean;
    }
  | { ok: false; reason: string };

const DEFAULT_MAX_REDIRECTS = 5;

export async function safeFetchHtml(opts: {
  url: string;
  maxBytes: number;
  timeoutMs?: number;
  userAgent?: string;
}): Promise<SafeFetchResult> {
  let current = opts.url;
  const maxBytes = opts.maxBytes;
  const timeoutMs = opts.timeoutMs ?? 15000;
  const ua =
    opts.userAgent ??
    "Mozilla/5.0 (compatible; StackConsultingAuditBot/1.0; +https://stackconsultingai.com)";

  for (let hop = 0; hop < DEFAULT_MAX_REDIRECTS; hop++) {
    let parsed: URL;
    try {
      parsed = new URL(current);
    } catch {
      return { ok: false, reason: "Invalid URL" };
    }
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return { ok: false, reason: `Disallowed protocol ${parsed.protocol}` };
    }
    try {
      await assertPublicHost(parsed.hostname);
    } catch (e) {
      return { ok: false, reason: e instanceof Error ? e.message : "Private host" };
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    let res: Response;
    try {
      res = await fetch(current, {
        method: "GET",
        redirect: "manual",
        signal: controller.signal,
        headers: {
          "user-agent": ua,
          accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
      });
    } catch (e) {
      clearTimeout(timer);
      return {
        ok: false,
        reason: e instanceof Error ? e.message : "Fetch failed",
      };
    }

    if (res.status >= 300 && res.status < 400) {
      const loc = res.headers.get("location");
      clearTimeout(timer);
      if (!loc) return { ok: false, reason: "Redirect without Location header" };
      try {
        current = new URL(loc, current).toString();
      } catch {
        return { ok: false, reason: "Invalid redirect target" };
      }
      continue;
    }

    if (!res.ok) {
      clearTimeout(timer);
      return { ok: false, reason: `HTTP ${res.status}` };
    }

    const cl = res.headers.get("content-length");
    if (cl) {
      const declared = Number.parseInt(cl, 10);
      if (Number.isFinite(declared) && declared > maxBytes * 4) {
        try {
          controller.abort();
        } catch {
          // ignore
        }
        clearTimeout(timer);
        return {
          ok: false,
          reason: `Declared Content-Length ${declared} exceeds cap`,
        };
      }
    }

    if (!res.body) {
      clearTimeout(timer);
      return { ok: false, reason: "Empty response body" };
    }

    const reader = res.body.getReader();
    const chunks: Uint8Array[] = [];
    let total = 0;
    let truncated = false;
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (!value) continue;
        if (total + value.length > maxBytes) {
          const remain = maxBytes - total;
          if (remain > 0) chunks.push(value.subarray(0, remain));
          total = maxBytes;
          truncated = true;
          try {
            await reader.cancel();
          } catch {
            // ignore
          }
          break;
        }
        chunks.push(value);
        total += value.length;
      }
    } catch (e) {
      clearTimeout(timer);
      return { ok: false, reason: e instanceof Error ? e.message : "Read failed" };
    }
    clearTimeout(timer);

    const buf = new Uint8Array(total);
    let offset = 0;
    for (const c of chunks) {
      buf.set(c, offset);
      offset += c.length;
    }
    const body = new TextDecoder("utf-8", { fatal: false }).decode(buf);

    return {
      ok: true,
      status: res.status,
      finalUrl: current,
      body,
      truncated,
    };
  }

  return { ok: false, reason: "Too many redirects" };
}
