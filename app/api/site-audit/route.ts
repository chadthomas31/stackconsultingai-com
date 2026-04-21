import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 180;
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface AuditRequest {
  url: string;
  name: string;
  email: string;
  phone?: string;
}

interface LighthouseScores {
  performance: number;
  seo: number;
  accessibility: number;
  bestPractices: number;
}

interface KeyFinding {
  label: string;
  value: string;
  status: "pass" | "warning" | "fail";
}

function normalizeUrl(raw: string): string {
  let url = raw.trim();
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "https://" + url;
  }
  return url;
}

function isValidUrl(str: string): boolean {
  try {
    const u = new URL(str);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractScores(lighthouseResult: any): LighthouseScores {
  const cats = lighthouseResult?.categories || {};
  return {
    performance: Math.round((cats.performance?.score ?? 0) * 100),
    seo: Math.round((cats.seo?.score ?? 0) * 100),
    accessibility: Math.round((cats.accessibility?.score ?? 0) * 100),
    bestPractices: Math.round((cats["best-practices"]?.score ?? 0) * 100),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractFindings(lighthouseResult: any): KeyFinding[] {
  const audits = lighthouseResult?.audits || {};
  const findings: KeyFinding[] = [];

  if (audits["first-contentful-paint"]) {
    const fcp = audits["first-contentful-paint"];
    const ms = Math.round(fcp.numericValue || 0);
    const status = fcp.score >= 0.9 ? "pass" : fcp.score >= 0.5 ? "warning" : "fail";
    findings.push({ label: "First Contentful Paint", value: `${(ms / 1000).toFixed(1)}s`, status });
  }
  if (audits["largest-contentful-paint"]) {
    const lcp = audits["largest-contentful-paint"];
    const ms = Math.round(lcp.numericValue || 0);
    const status = lcp.score >= 0.9 ? "pass" : lcp.score >= 0.5 ? "warning" : "fail";
    findings.push({ label: "Largest Contentful Paint", value: `${(ms / 1000).toFixed(1)}s`, status });
  }
  if (audits["cumulative-layout-shift"]) {
    const cls = audits["cumulative-layout-shift"];
    const val = (cls.numericValue || 0).toFixed(3);
    const status = cls.score >= 0.9 ? "pass" : cls.score >= 0.5 ? "warning" : "fail";
    findings.push({ label: "Cumulative Layout Shift", value: val, status });
  }
  if (audits["total-blocking-time"]) {
    const tbt = audits["total-blocking-time"];
    const ms = Math.round(tbt.numericValue || 0);
    const status = tbt.score >= 0.9 ? "pass" : tbt.score >= 0.5 ? "warning" : "fail";
    findings.push({ label: "Total Blocking Time", value: `${ms}ms`, status });
  }
  if (audits["speed-index"]) {
    const si = audits["speed-index"];
    const ms = Math.round(si.numericValue || 0);
    const status = si.score >= 0.9 ? "pass" : si.score >= 0.5 ? "warning" : "fail";
    findings.push({ label: "Speed Index", value: `${(ms / 1000).toFixed(1)}s`, status });
  }
  if (audits["meta-description"]) {
    findings.push({
      label: "Meta Description",
      value: audits["meta-description"].score === 1 ? "Present" : "Missing",
      status: audits["meta-description"].score === 1 ? "pass" : "fail",
    });
  }
  if (audits["document-title"]) {
    findings.push({
      label: "Document Title",
      value: audits["document-title"].score === 1 ? "Present" : "Missing",
      status: audits["document-title"].score === 1 ? "pass" : "fail",
    });
  }
  if (audits["image-alt"]) {
    findings.push({
      label: "Image Alt Attributes",
      value: audits["image-alt"].score === 1 ? "All present" : "Missing on some images",
      status: audits["image-alt"].score === 1 ? "pass" : "fail",
    });
  }
  if (audits["is-on-https"]) {
    findings.push({
      label: "HTTPS",
      value: audits["is-on-https"].score === 1 ? "Enabled" : "Not secure",
      status: audits["is-on-https"].score === 1 ? "pass" : "fail",
    });
  }
  if (audits["viewport"]) {
    findings.push({
      label: "Viewport Meta Tag",
      value: audits["viewport"].score === 1 ? "Configured" : "Missing",
      status: audits["viewport"].score === 1 ? "pass" : "warning",
    });
  }
  if (audits["render-blocking-resources"]) {
    const items = audits["render-blocking-resources"].details?.items?.length || 0;
    findings.push({
      label: "Render-Blocking Resources",
      value: items === 0 ? "None detected" : `${items} found`,
      status: items === 0 ? "pass" : "warning",
    });
  }
  if (audits["unminified-css"]) {
    findings.push({
      label: "CSS Minification",
      value: audits["unminified-css"].score === 1 ? "Optimized" : "Not minified",
      status: audits["unminified-css"].score === 1 ? "pass" : "warning",
    });
  }
  return findings.slice(0, 12);
}

function calculateGrade(avg: number): string {
  if (avg >= 90) return "A";
  if (avg >= 80) return "B";
  if (avg >= 65) return "C";
  if (avg >= 50) return "D";
  return "F";
}

function getClientIp(request: NextRequest): string | null {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const first = forwardedFor.split(",")[0]?.trim();
    return first || null;
  }
  return (
    request.headers.get("x-real-ip") ??
    request.headers.get("cf-connecting-ip") ??
    null
  );
}

async function fetchPageSpeed(url: string, strategy: "mobile" | "desktop") {
  const key = process.env.GOOGLE_API_KEY;
  const keyParam = key ? `&key=${key}` : "";
  const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=${strategy}&category=performance&category=accessibility&category=best-practices&category=seo${keyParam}`;
  const res = await fetch(apiUrl, { signal: AbortSignal.timeout(120000) });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PageSpeed API error (${strategy}): ${res.status} - ${text.slice(0, 200)}`);
  }
  return res.json();
}

// Streaming response. Same pattern as /api/newsletter/generate — sends SSE
// frames so Cloudflare keeps the connection open past 100s and the client
// can show live progress while PageSpeed grinds.
export async function POST(request: NextRequest) {
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
          /* closed */
        }
      };
      closeStream = () => {
        try {
          controller.close();
        } catch {
          /* already closed */
        }
      };
      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(": ping\n\n"));
        } catch {
          clearInterval(heartbeat);
        }
      }, 15000);

      runAudit(request, send)
        .catch((err) => {
          console.error("[site-audit] uncaught:", err);
          send({
            type: "error",
            error:
              err instanceof Error
                ? `Server error: ${err.message}`
                : "Server error",
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

async function runAudit(
  request: NextRequest,
  send: (data: Record<string, unknown>) => void,
) {
  let body: AuditRequest;
  try {
    body = await request.json();
  } catch {
    send({ type: "error", error: "Invalid JSON body." });
    return;
  }

  const { name, email, phone } = body;
  let { url } = body;

  if (!url || !name || !email) {
    send({ type: "error", error: "Name, email, and URL are required." });
    return;
  }
  if (!isValidEmail(email)) {
    send({ type: "error", error: "Please enter a valid email address." });
    return;
  }

  url = normalizeUrl(url);
  if (!isValidUrl(url)) {
    send({ type: "error", error: "Please enter a valid website URL." });
    return;
  }

  send({ type: "progress", stage: "running-mobile" });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mobileData: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let desktopData: any;
  try {
    // Run in parallel — Google PageSpeed can take 30-60s per strategy.
    [mobileData, desktopData] = await Promise.all([
      fetchPageSpeed(url, "mobile"),
      fetchPageSpeed(url, "desktop"),
    ]);
  } catch (apiError) {
    console.error("PageSpeed API error:", apiError);
    const msg =
      apiError instanceof Error ? apiError.message : String(apiError);
    send({
      type: "error",
      error: `Could not analyze that website. ${msg.includes("429") ? "Rate limit hit — try again in a minute." : "Please check the URL is accessible and try again."}`,
    });
    return;
  }

  send({ type: "progress", stage: "scoring" });

  const mobileScores = extractScores(mobileData.lighthouseResult);
  const desktopScores = extractScores(desktopData.lighthouseResult);
  const mobileFindings = extractFindings(mobileData.lighthouseResult);
  const desktopFindings = extractFindings(desktopData.lighthouseResult);

  const allScores = [
    mobileScores.performance,
    mobileScores.seo,
    mobileScores.accessibility,
    mobileScores.bestPractices,
  ];
  const avg = Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length);
  const overallGrade = calculateGrade(avg);

  if (isSupabaseConfigured()) {
    try {
      const { error: dbError } = await supabaseAdmin.from("tool_leads").insert({
        tool_name: "site-audit",
        tool_data: {
          mobile_scores: mobileScores,
          desktop_scores: desktopScores,
          overall_grade: overallGrade,
          overall_score: avg,
        },
        email,
        phone: phone || null,
        business_name: name,
        ip_address: getClientIp(request),
        user_agent: request.headers.get("user-agent"),
      });
      if (dbError) {
        console.error("Supabase insert error:", dbError);
      }
    } catch (err) {
      console.error("Supabase insert threw:", err);
    }
  }

  send({
    type: "done",
    success: true,
    url,
    overallGrade,
    overallScore: avg,
    mobile: {
      scores: mobileScores,
      findings: mobileFindings,
    },
    desktop: {
      scores: desktopScores,
      findings: desktopFindings,
    },
  });
}
