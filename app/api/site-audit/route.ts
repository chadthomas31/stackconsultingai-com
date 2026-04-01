import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

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

function extractScores(lighthouseResult: any): LighthouseScores {
  const cats = lighthouseResult?.categories || {};
  return {
    performance: Math.round((cats.performance?.score ?? 0) * 100),
    seo: Math.round((cats.seo?.score ?? 0) * 100),
    accessibility: Math.round((cats.accessibility?.score ?? 0) * 100),
    bestPractices: Math.round((cats["best-practices"]?.score ?? 0) * 100),
  };
}

function extractFindings(lighthouseResult: any): KeyFinding[] {
  const audits = lighthouseResult?.audits || {};
  const findings: KeyFinding[] = [];

  // First Contentful Paint
  if (audits["first-contentful-paint"]) {
    const fcp = audits["first-contentful-paint"];
    const ms = Math.round(fcp.numericValue || 0);
    const status = fcp.score >= 0.9 ? "pass" : fcp.score >= 0.5 ? "warning" : "fail";
    findings.push({ label: "First Contentful Paint", value: `${(ms / 1000).toFixed(1)}s`, status });
  }

  // Largest Contentful Paint
  if (audits["largest-contentful-paint"]) {
    const lcp = audits["largest-contentful-paint"];
    const ms = Math.round(lcp.numericValue || 0);
    const status = lcp.score >= 0.9 ? "pass" : lcp.score >= 0.5 ? "warning" : "fail";
    findings.push({ label: "Largest Contentful Paint", value: `${(ms / 1000).toFixed(1)}s`, status });
  }

  // Cumulative Layout Shift
  if (audits["cumulative-layout-shift"]) {
    const cls = audits["cumulative-layout-shift"];
    const val = (cls.numericValue || 0).toFixed(3);
    const status = cls.score >= 0.9 ? "pass" : cls.score >= 0.5 ? "warning" : "fail";
    findings.push({ label: "Cumulative Layout Shift", value: val, status });
  }

  // Total Blocking Time
  if (audits["total-blocking-time"]) {
    const tbt = audits["total-blocking-time"];
    const ms = Math.round(tbt.numericValue || 0);
    const status = tbt.score >= 0.9 ? "pass" : tbt.score >= 0.5 ? "warning" : "fail";
    findings.push({ label: "Total Blocking Time", value: `${ms}ms`, status });
  }

  // Speed Index
  if (audits["speed-index"]) {
    const si = audits["speed-index"];
    const ms = Math.round(si.numericValue || 0);
    const status = si.score >= 0.9 ? "pass" : si.score >= 0.5 ? "warning" : "fail";
    findings.push({ label: "Speed Index", value: `${(ms / 1000).toFixed(1)}s`, status });
  }

  // Meta description
  if (audits["meta-description"]) {
    const md = audits["meta-description"];
    findings.push({
      label: "Meta Description",
      value: md.score === 1 ? "Present" : "Missing",
      status: md.score === 1 ? "pass" : "fail",
    });
  }

  // Document title
  if (audits["document-title"]) {
    const dt = audits["document-title"];
    findings.push({
      label: "Document Title",
      value: dt.score === 1 ? "Present" : "Missing",
      status: dt.score === 1 ? "pass" : "fail",
    });
  }

  // Image alt text
  if (audits["image-alt"]) {
    const ia = audits["image-alt"];
    findings.push({
      label: "Image Alt Attributes",
      value: ia.score === 1 ? "All present" : "Missing on some images",
      status: ia.score === 1 ? "pass" : "fail",
    });
  }

  // HTTPS
  if (audits["is-on-https"]) {
    const https = audits["is-on-https"];
    findings.push({
      label: "HTTPS",
      value: https.score === 1 ? "Enabled" : "Not secure",
      status: https.score === 1 ? "pass" : "fail",
    });
  }

  // Viewport
  if (audits["viewport"]) {
    const vp = audits["viewport"];
    findings.push({
      label: "Viewport Meta Tag",
      value: vp.score === 1 ? "Configured" : "Missing",
      status: vp.score === 1 ? "pass" : "warning",
    });
  }

  // Render-blocking resources
  if (audits["render-blocking-resources"]) {
    const rb = audits["render-blocking-resources"];
    const items = rb.details?.items?.length || 0;
    findings.push({
      label: "Render-Blocking Resources",
      value: items === 0 ? "None detected" : `${items} found`,
      status: items === 0 ? "pass" : "warning",
    });
  }

  // Unminified CSS
  if (audits["unminified-css"]) {
    const uc = audits["unminified-css"];
    findings.push({
      label: "CSS Minification",
      value: uc.score === 1 ? "Optimized" : "Not minified",
      status: uc.score === 1 ? "pass" : "warning",
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
  const res = await fetch(apiUrl, { signal: AbortSignal.timeout(60000) });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PageSpeed API error (${strategy}): ${res.status} - ${text}`);
  }
  return res.json();
}

export async function POST(request: NextRequest) {
  try {
    const body: AuditRequest = await request.json();
    const { name, email, phone } = body;
    let { url } = body;

    // Validate inputs
    if (!url || !name || !email) {
      return NextResponse.json(
        { success: false, error: "Name, email, and URL are required." },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    url = normalizeUrl(url);
    if (!isValidUrl(url)) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid website URL." },
        { status: 400 }
      );
    }

    // Fetch mobile and desktop in parallel
    let mobileData: any;
    let desktopData: any;

    try {
      [mobileData, desktopData] = await Promise.all([
        fetchPageSpeed(url, "mobile"),
        fetchPageSpeed(url, "desktop"),
      ]);
    } catch (apiError: any) {
      console.error("PageSpeed API error:", apiError);
      return NextResponse.json(
        {
          success: false,
          error:
            "Could not analyze that website. Please check the URL is accessible and try again.",
        },
        { status: 502 }
      );
    }

    const mobileScores = extractScores(mobileData.lighthouseResult);
    const desktopScores = extractScores(desktopData.lighthouseResult);
    const mobileFindings = extractFindings(mobileData.lighthouseResult);
    const desktopFindings = extractFindings(desktopData.lighthouseResult);

    // Calculate overall grade from mobile scores (Google is mobile-first)
    const allScores = [
      mobileScores.performance,
      mobileScores.seo,
      mobileScores.accessibility,
      mobileScores.bestPractices,
    ];
    const avg = Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length);
    const overallGrade = calculateGrade(avg);

    const result = {
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
    };

    // Await Supabase save to avoid dropping leads on serverless
    if (isSupabaseConfigured()) {
      const { error: dbError } = await supabaseAdmin
        .from("tool_leads")
        .insert({
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
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Site audit error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
