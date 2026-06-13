"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Globe,
  CheckCircle,
  AlertTriangle,
  XCircle,
  User,
  Mail,
  Phone,
  ArrowRight,
  Loader2,
  Monitor,
  Smartphone,
  Zap,
  Search,
  Shield,
  Eye,
  BarChart3,
} from "lucide-react";

/* ---------- Types ---------- */

interface Scores {
  performance: number;
  seo: number;
  accessibility: number;
  bestPractices: number;
}

interface Finding {
  label: string;
  value: string;
  status: "pass" | "warning" | "fail";
}

interface DiagnosisFix {
  priority: "high" | "medium" | "low";
  problem: string;
  why_it_matters: string;
  fix: string;
  estimated_hours: number;
}

interface ActionPlanPhase {
  title: string;
  timeline: string;
  includes: string[];
  estimated_price_range: string;
}

interface Diagnosis {
  industry: string;
  industry_label: string;
  executive_summary: string;
  scorecard_interpretation: string;
  top_fixes: DiagnosisFix[];
  business_impact: string[];
  action_plan: { phase_1: ActionPlanPhase; phase_2: ActionPlanPhase };
  cta_headline: string;
  cta_subhead: string;
}

interface KeywordPresent {
  term: string;
  location: "title" | "h1" | "h2" | "body" | "alt" | "meta";
  density: "high" | "medium" | "low";
}

interface KeywordMissing {
  term: string;
  why_important: string;
  estimated_monthly_searches: string;
}

interface KeywordReport {
  primary_keyword_detected: string;
  primary_keyword_strength: "strong" | "moderate" | "weak" | "missing";
  keywords_present: KeywordPresent[];
  keywords_missing: KeywordMissing[];
  headline_alignment: { score: "good" | "fair" | "poor"; note: string };
  local_seo: {
    has_nap: boolean;
    has_schema: boolean;
    has_geo_meta: boolean;
    has_city_in_title: boolean;
    note: string;
  };
  recommendations: string[];
}

interface AuditResult {
  success: boolean;
  url: string;
  overallGrade: string;
  overallScore: number;
  mobile: { scores: Scores; findings: Finding[] };
  desktop: { scores: Scores; findings: Finding[] };
  diagnosis: Diagnosis | null;
  diagnosisError: string | null;
  keywordReport: KeywordReport | null;
  keywordError: string | null;
}

/* ---------- Finding descriptions (plain-English) ---------- */

const CATEGORY_INFO: Record<
  "Performance" | "SEO" | "Accessibility" | "Best Practices",
  { what: string; whyItMatters: string }
> = {
  Performance: {
    what:
      "How fast your page loads and becomes interactive. Aggregate of Core Web Vitals: First Contentful Paint, Largest Contentful Paint, Cumulative Layout Shift, Total Blocking Time, Speed Index. NOT just one number.",
    whyItMatters:
      "Google ranks slow sites lower. Mobile visitors leave after 3 seconds of waiting. Slow site = lost calls, lost bookings, lost revenue.",
  },
  SEO: {
    what:
      "Basic on-page technical SEO: meta tags, robots.txt, viewport, structured data, link text, image alt presence. Does NOT measure keywords or content quality.",
    whyItMatters:
      "Foundational signals Google uses to understand your page. Missing tags = Google can't classify what you do = harder to rank for the right searches.",
  },
  Accessibility: {
    what:
      "WCAG-style checks: color contrast, alt text, ARIA labels, keyboard navigation, form labels, screen-reader compatibility.",
    whyItMatters:
      "Required by California law for many businesses (Unruh Act). Lawsuits are common. Also: ~15% of Americans have some disability. Inaccessible site = excluded customers.",
  },
  "Best Practices": {
    what:
      "Web platform hygiene: HTTPS, no console errors, no deprecated APIs, secure browser features, correct image aspect ratios, proper charset.",
    whyItMatters:
      "Signals trust. Sites with security warnings or browser errors feel broken — visitors don't book or buy from sites that feel broken.",
  },
};

const FINDING_DESCRIPTIONS: Record<string, string> = {
  "First Contentful Paint":
    "Time until your visitor sees ANYTHING on the page. Over 1.8s and they think your site is broken. Over 3s and 40% bounce before it loads.",
  "Largest Contentful Paint":
    "Time until your hero image / main headline finishes loading. Google's #1 ranking signal for mobile. Over 2.5s = lower search position. Over 4s = visitors leave.",
  "Cumulative Layout Shift":
    "How much the page jumps around while loading. High shift = visitors mis-tap buttons, miss CTAs, get frustrated, and leave. Under 0.1 is good.",
  "Total Blocking Time":
    "How long the page is frozen and won't respond to taps. High = visitor taps your phone number and nothing happens. Under 200ms feels instant.",
  "Speed Index":
    "How quickly the visible page fills in. Slow fill = visitor sees a half-empty page and assumes nothing is here. Lower = better.",
  "Meta Description":
    "The blurb Google shows in search results. Missing means Google writes its own (badly), and your search click-through rate drops 30-40%.",
  "Document Title":
    "What appears in browser tabs and Google results. Generic title = no one clicks. Should name what you do AND where.",
  "Image Alt Attributes":
    "Descriptions for images. Missing = excluded from Google Image search (huge for restaurants/dental/real estate) AND California Unruh Act exposure.",
  HTTPS:
    "Encrypted connection. Without it, Chrome shows 'Not Secure' next to your URL. Visitors leave. Google de-ranks you. Non-negotiable in 2026.",
  "Viewport Meta Tag":
    "Tells phones how to render the page. Missing = your site looks broken on every smartphone — text microscopic, layout shattered.",
  "Render-Blocking Resources":
    "Scripts/stylesheets that pause everything until they download. Each one adds delay before your visitor sees the page. Fewer = faster first impression.",
  "CSS Minification":
    "Stylesheets stripped of whitespace. Smaller files = faster page = better mobile experience. Easy to fix, no excuse to skip.",
};

/* ---------- Helpers ---------- */

function normalizeUrl(raw: string): string {
  let url = raw.trim();
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "https://" + url;
  }
  return url;
}

function isValidUrl(str: string): boolean {
  try {
    const u = new URL(normalizeUrl(str));
    return (
      (u.protocol === "http:" || u.protocol === "https:") &&
      u.hostname.includes(".")
    );
  } catch {
    return false;
  }
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function scoreColor(score: number): string {
  if (score >= 90) return "text-emerald-600";
  if (score >= 50) return "text-amber-600";
  return "text-red-600";
}

function scoreStroke(score: number): string {
  if (score >= 90) return "stroke-emerald-600";
  if (score >= 50) return "stroke-amber-600";
  return "stroke-red-600";
}

function gradeColor(grade: string): string {
  if (grade === "A") return "text-emerald-600";
  if (grade === "B") return "text-brand";
  if (grade === "C") return "text-amber-600";
  if (grade === "D") return "text-orange-600";
  return "text-red-600";
}

function gradeStroke(grade: string): string {
  if (grade === "A") return "stroke-emerald-600";
  if (grade === "B") return "stroke-brand";
  if (grade === "C") return "stroke-amber-600";
  if (grade === "D") return "stroke-orange-600";
  return "stroke-red-600";
}

function statusBadge(score: number): { label: string; className: string } {
  if (score >= 90)
    return {
      label: "Strong",
      className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    };
  if (score >= 75)
    return {
      label: "Fair",
      className: "bg-amber-50 text-amber-700 border-amber-200",
    };
  if (score >= 50)
    return {
      label: "Needs Work",
      className: "bg-orange-50 text-orange-700 border-orange-200",
    };
  return {
    label: "Critical",
    className: "bg-red-50 text-red-700 border-red-200",
  };
}

function priorityBadge(p: "high" | "medium" | "low"): {
  label: string;
  className: string;
} {
  if (p === "high")
    return {
      label: "High priority",
      className: "bg-red-50 text-red-700 border-red-200",
    };
  if (p === "medium")
    return {
      label: "Medium priority",
      className: "bg-amber-50 text-amber-700 border-amber-200",
    };
  return {
    label: "Low priority",
    className: "bg-soft text-navy-700 border-border",
  };
}

/* ---------- SVG Gauges ---------- */

function RadialGauge({
  score,
  size = 100,
  label,
  strokeWidth = 6,
}: {
  score: number;
  size?: number;
  label: string;
  strokeWidth?: number;
}) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 100);
    return () => clearTimeout(timer);
  }, [score]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          className="-rotate-90"
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          aria-label={`${label}: ${score} out of 100`}
          role="img"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-border"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            className={`${scoreStroke(score)} transition-all duration-1000 ease-out`}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-lg font-bold ${scoreColor(score)}`}>
            {animatedScore}
          </span>
        </div>
      </div>
      <span className="text-xs text-muted-foreground font-medium text-center leading-tight">
        {label}
      </span>
    </div>
  );
}

function GradeGauge({
  grade,
  score,
}: {
  grade: string;
  score: number;
}) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const size = 180;
  const strokeWidth = 10;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 100);
    return () => clearTimeout(timer);
  }, [score]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          className="-rotate-90"
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          aria-label={`Overall grade: ${grade}, score ${score} out of 100`}
          role="img"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-border"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            className={`${gradeStroke(grade)} transition-all duration-1000 ease-out`}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-6xl font-bold font-heading ${gradeColor(grade)}`}>
            {grade}
          </span>
          <span className="text-sm text-muted-foreground">{animatedScore}/100</span>
        </div>
      </div>
    </div>
  );
}

/* ---------- Status Icon ---------- */

function CategoryRow({
  label,
  mobile,
  desktop,
  badge,
  info,
}: {
  label: string;
  mobile: number;
  desktop: number;
  badge: { label: string; className: string };
  info: { what: string; whyItMatters: string };
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <tr
        onClick={() => setOpen((v) => !v)}
        className="border-b border-border last:border-0 hover:bg-soft/50 cursor-pointer"
      >
        <td className="py-3 px-6 font-medium text-navy-900 flex items-center gap-2">
          <span
            className={`inline-block w-1.5 h-1.5 rounded-full transition-transform ${open ? "rotate-45 bg-brand" : "bg-navy-700/40"}`}
          />
          {label}
        </td>
        <td className="py-3 px-3 text-right font-mono font-semibold text-orange-600">
          {mobile}
        </td>
        <td className="py-3 px-3 text-right font-mono font-semibold text-orange-600">
          {desktop}
        </td>
        <td className="py-3 px-6 text-right">
          <span
            className={`inline-block px-2.5 py-1 text-xs font-medium border rounded ${badge.className}`}
          >
            {badge.label}
          </span>
        </td>
      </tr>
      {open && (
        <tr className="border-b border-border bg-soft/40">
          <td colSpan={4} className="py-4 px-6">
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs uppercase tracking-wider text-navy-700/60 font-semibold mb-1">
                  What it measures
                </p>
                <p className="text-navy-800 leading-relaxed">{info.what}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-navy-700/60 font-semibold mb-1">
                  Why it matters
                </p>
                <p className="text-navy-800 leading-relaxed">
                  {info.whyItMatters}
                </p>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function StatusIcon({ status }: { status: "pass" | "warning" | "fail" }) {
  if (status === "pass")
    return <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />;
  if (status === "warning")
    return <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />;
  return <XCircle className="w-4 h-4 text-red-600 shrink-0" />;
}

/* ---------- Scanning messages ---------- */

const SCAN_MESSAGES = [
  { text: "Checking performance metrics...", icon: Zap },
  { text: "Analyzing SEO signals...", icon: Search },
  { text: "Testing mobile responsiveness...", icon: Smartphone },
  { text: "Scanning security headers...", icon: Shield },
  { text: "Reviewing accessibility...", icon: Eye },
  { text: "Evaluating best practices...", icon: BarChart3 },
  { text: "Comparing desktop vs mobile...", icon: Monitor },
  { text: "Generating your report...", icon: BarChart3 },
];

/* ---------- Main Component ---------- */

export default function SiteAudit() {
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<AuditResult | null>(null);
  const [scanMsgIndex, setScanMsgIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const resultRef = useRef<HTMLDivElement>(null);

  // Cycle through scan messages
  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setScanMsgIndex((prev) => (prev + 1) % SCAN_MESSAGES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [loading]);

  // Animate progress bar
  useEffect(() => {
    if (!loading) {
      setProgress(0);
      return;
    }
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 8 + 2;
      });
    }, 800);
    return () => clearInterval(interval);
  }, [loading]);

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      setError("");

      if (!url.trim() || !name.trim() || !email.trim()) {
        setError("Please fill in all required fields.");
        return;
      }
      if (!isValidUrl(url)) {
        setError("Please enter a valid website URL (e.g., example.com).");
        return;
      }
      if (!isValidEmail(email)) {
        setError("Please enter a valid email address.");
        return;
      }

      setLoading(true);
      setResult(null);
      setScanMsgIndex(0);

      try {
        const res = await fetch("/api/site-audit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "text/event-stream",
          },
          body: JSON.stringify({
            url: normalizeUrl(url),
            name,
            email,
            phone: phone || undefined,
          }),
          signal: AbortSignal.timeout(200000),
        });

        if (res.status === 429) {
          const data = await res.json().catch(() => null);
          setError(
            data?.suggest?.message
              ? `Daily free-audit limit reached. ${data.suggest.message}`
              : "Daily free-audit limit reached. Subscribe to The Stack Report newsletter for unlimited access: /stack-report",
          );
          setLoading(false);
          return;
        }

        if (!res.ok || !res.body) {
          setError(
            `Audit failed with HTTP ${res.status}. Try again, or try a different URL.`,
          );
          setLoading(false);
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let final: AuditResult | null = null;
        let streamError: string | null = null;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const frames = buffer.split("\n\n");
          buffer = frames.pop() ?? "";
          for (const frame of frames) {
            if (!frame.startsWith("data: ")) continue;
            let event: Record<string, unknown>;
            try {
              event = JSON.parse(frame.slice(6));
            } catch {
              continue;
            }
            if (event.type === "error") {
              streamError = String(event.error ?? "Audit failed.");
            } else if (event.type === "done") {
              final = event as unknown as AuditResult;
            }
            // "progress" events just keep CF alive; nothing to render.
          }
        }

        if (streamError) {
          setError(streamError);
          setLoading(false);
          return;
        }
        if (!final) {
          setError(
            "The audit stream ended without results — Google PageSpeed is slow right now. Try again in a moment.",
          );
          setLoading(false);
          return;
        }

        setProgress(100);
        setTimeout(() => {
          setResult(final as AuditResult);
          setLoading(false);
          if (typeof window !== "undefined" && (window as any).dataLayer) {
            (window as any).dataLayer.push({
              event: "site_audit_complete",
              audit_url: (final as AuditResult).url,
              audit_grade: (final as AuditResult).overallGrade,
              audit_score: (final as AuditResult).overallScore,
            });
          }
          setTimeout(() => {
            resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 200);
        }, 400);
      } catch (err: unknown) {
        const isTimeout =
          err instanceof DOMException && err.name === "TimeoutError";
        setError(
          isTimeout
            ? "The audit timed out after 3 minutes. PageSpeed is very slow today — try again in a moment."
            : "Network error. Please check your connection and try again.",
        );
        setLoading(false);
      }
    },
    [url, name, email, phone]
  );

  const ScanMsg = SCAN_MESSAGES[scanMsgIndex];

  return (
    <section className="py-20 px-4 bg-secondary/30">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
            <BarChart3 className="w-4 h-4" />
            <span>Free AI Site Audit</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4">
            How Does Your Website Score?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get a comprehensive performance, SEO, and accessibility audit powered by
            Google Lighthouse — completely free.
          </p>
        </div>

        {/* Form */}
        {!result && (
          <div className="bg-card border border-border rounded-xl p-8 max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} noValidate>
              <div className="space-y-4">
                {/* URL */}
                <div>
                  <label
                    htmlFor="audit-url"
                    className="block text-sm font-medium mb-2"
                  >
                    Website URL <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="url"
                      id="audit-url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      placeholder="example.com"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label
                    htmlFor="audit-name"
                    className="block text-sm font-medium mb-2"
                  >
                    Your Name <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      id="audit-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      placeholder="John Smith"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="audit-email"
                    className="block text-sm font-medium mb-2"
                  >
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="email"
                      id="audit-email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      placeholder="you@company.com"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Phone (optional) */}
                <div>
                  <label
                    htmlFor="audit-phone"
                    className="block text-sm font-medium mb-2"
                  >
                    Phone{" "}
                    <span className="text-muted-foreground font-normal">
                      (optional)
                    </span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="tel"
                      id="audit-phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      placeholder="(555) 123-4567"
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="p-3 rounded-lg bg-red-400/10 border border-red-400/20 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-3 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      Run Free Audit
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Trust signals */}
            <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-primary" /> Takes ~15 seconds
              </span>
              <span className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-primary" /> No signup required
              </span>
              <span className="flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-primary" /> Results emailed to you
              </span>
            </div>

            {/* Loading animation */}
            {loading && (
              <div className="mt-8 space-y-4">
                {/* Progress bar */}
                <div className="h-2 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>

                {/* Scan message */}
                <div className="flex items-center justify-center gap-3 py-6 animate-fade-in">
                  <ScanMsg.icon className="w-5 h-5 text-primary animate-pulse" />
                  <span className="text-muted-foreground font-medium">
                    {ScanMsg.text}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Results — Consulting Diagnosis */}
        {result && (
          <div ref={resultRef} className="space-y-6 animate-fade-in-up">
            {/* 1. Executive Summary */}
            <div className="bg-white border border-border rounded-xl p-8 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-6">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="section-kicker">
                      <span className="live-dot" /> Audit complete
                    </span>
                    {result.diagnosis?.industry_label && (
                      <span className="text-xs uppercase tracking-wider text-navy-700/70 font-medium">
                        {result.diagnosis.industry_label}
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold font-heading text-navy-900 mb-2 tracking-tight">
                    {result.diagnosis?.cta_headline ?? "Your Website Audit"}
                  </h3>
                  <p className="text-sm text-navy-700/70 mb-4 break-all">
                    {result.url}
                  </p>
                  <p className="text-base md:text-lg text-navy-800 leading-relaxed max-w-2xl">
                    {result.diagnosis?.executive_summary ??
                      "Your audit completed but the AI summary is unavailable right now. The raw scores below still tell the story — bigger gaps mean bigger opportunities."}
                  </p>
                </div>
                <div className="shrink-0 flex flex-col items-center justify-center min-w-[120px] px-6 py-4 bg-soft border border-border rounded-md">
                  <span className="text-xs uppercase tracking-wider text-navy-700/60 mb-1">
                    Overall
                  </span>
                  <span
                    className={`text-6xl font-bold font-heading leading-none ${gradeColor(result.overallGrade)}`}
                  >
                    {result.overallGrade}
                  </span>
                  <span className="text-sm text-navy-700/70 mt-1">
                    {result.overallScore}/100
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Scorecard — Mobile vs Desktop */}
            <div className="bg-white border border-border rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-border bg-soft flex items-center justify-between">
                <h4 className="text-sm font-semibold text-navy-900 uppercase tracking-wider">
                  Category scorecard
                </h4>
                <span className="text-xs text-navy-700/60">
                  Tap a row to learn what it measures
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-navy-700/70">
                      <th className="text-left py-3 px-6 font-medium">Area</th>
                      <th className="text-right py-3 px-3 font-medium">Mobile</th>
                      <th className="text-right py-3 px-3 font-medium">Desktop</th>
                      <th className="text-right py-3 px-6 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(
                      [
                        ["Performance", result.mobile.scores.performance, result.desktop.scores.performance],
                        ["SEO", result.mobile.scores.seo, result.desktop.scores.seo],
                        ["Accessibility", result.mobile.scores.accessibility, result.desktop.scores.accessibility],
                        ["Best Practices", result.mobile.scores.bestPractices, result.desktop.scores.bestPractices],
                      ] as const
                    ).map(([label, m, d]) => {
                      const badge = statusBadge(m);
                      const info = CATEGORY_INFO[label];
                      return (
                        <CategoryRow
                          key={label}
                          label={label}
                          mobile={m}
                          desktop={d}
                          badge={badge}
                          info={info}
                        />
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {result.diagnosis?.scorecard_interpretation && (
                <div className="px-6 py-4 bg-brand/5 border-t border-border">
                  <p className="text-sm text-navy-800">
                    <strong className="text-brand">Biggest gap:</strong>{" "}
                    {result.diagnosis.scorecard_interpretation}
                  </p>
                </div>
              )}
            </div>

            {/* 3. Top Fixes */}
            {result.diagnosis?.top_fixes && result.diagnosis.top_fixes.length > 0 && (
              <div className="bg-white border border-border rounded-xl p-8">
                <div className="mb-6">
                  <h4 className="text-xl font-bold font-heading text-navy-900 mb-1">
                    What we&apos;d fix first
                  </h4>
                  <p className="text-sm text-navy-700/70">
                    Prioritized by revenue impact for {result.diagnosis.industry_label.toLowerCase()}.
                  </p>
                </div>
                <div className="space-y-4">
                  {result.diagnosis.top_fixes.map((fix, i) => {
                    const badge = priorityBadge(fix.priority);
                    return (
                      <div
                        key={i}
                        className="grid md:grid-cols-12 gap-4 p-5 border border-border rounded-md hover:border-navy-700/30 transition-colors"
                      >
                        <div className="md:col-span-2 flex md:flex-col items-start gap-2">
                          <span className="font-mono text-xs text-navy-700/60">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className={`inline-block px-2.5 py-1 text-xs font-medium border rounded ${badge.className}`}>
                            {badge.label}
                          </span>
                        </div>
                        <div className="md:col-span-10 space-y-2">
                          <p className="font-semibold text-navy-900 text-base">
                            {fix.problem}
                          </p>
                          <p className="text-sm text-navy-800">
                            <strong className="text-navy-900">Why it matters:</strong>{" "}
                            {fix.why_it_matters}
                          </p>
                          <p className="text-sm text-navy-800">
                            <strong className="text-navy-900">Fix:</strong> {fix.fix}
                          </p>
                          <p className="text-xs text-navy-700/60 font-mono">
                            ~{fix.estimated_hours}h to fix
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 3.5 Keyword Report */}
            {result.keywordReport && (
              <div className="bg-white border border-border rounded-xl p-8">
                <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <span className="section-kicker">Keyword & local SEO</span>
                    <h4 className="text-xl font-bold font-heading text-navy-900 mt-3">
                      What you&apos;re ranking for (and what you&apos;re missing)
                    </h4>
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-wider text-navy-700/60">
                      Primary target
                    </p>
                    <p className="font-mono text-base text-navy-900 mt-1">
                      {result.keywordReport.primary_keyword_detected || "(none detected)"}
                    </p>
                    <p className="text-xs mt-1">
                      <span
                        className={`inline-block px-2 py-0.5 rounded font-medium border ${
                          result.keywordReport.primary_keyword_strength === "strong"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : result.keywordReport.primary_keyword_strength === "moderate"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-red-50 text-red-700 border-red-200"
                        }`}
                      >
                        {result.keywordReport.primary_keyword_strength} signal
                      </span>
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Keywords present */}
                  <div>
                    <h5 className="text-sm font-semibold uppercase tracking-wider text-navy-700/70 mb-3">
                      Keywords found on page
                    </h5>
                    <div className="space-y-2">
                      {result.keywordReport.keywords_present.map((k, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between gap-2 px-3 py-2 border border-border rounded-md bg-soft/40"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-navy-900 truncate">
                              {k.term}
                            </p>
                            <p className="text-xs text-navy-700/60 font-mono">
                              in {k.location}
                            </p>
                          </div>
                          <span
                            className={`text-xs font-medium px-2 py-0.5 rounded shrink-0 ${
                              k.density === "high"
                                ? "bg-emerald-50 text-emerald-700"
                                : k.density === "medium"
                                  ? "bg-amber-50 text-amber-700"
                                  : "bg-soft text-navy-700"
                            }`}
                          >
                            {k.density}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Keywords missing — the money column */}
                  <div>
                    <h5 className="text-sm font-semibold uppercase tracking-wider text-orange-600 mb-3">
                      High-value keywords you&apos;re missing
                    </h5>
                    <div className="space-y-3">
                      {result.keywordReport.keywords_missing.map((k, i) => (
                        <div
                          key={i}
                          className="px-3 py-2 border-l-2 border-orange-600 bg-orange-50/50"
                        >
                          <div className="flex items-baseline justify-between gap-2 mb-1">
                            <p className="text-sm font-semibold text-navy-900">
                              {k.term}
                            </p>
                            <span className="text-xs font-mono text-navy-700/60 shrink-0">
                              ~{k.estimated_monthly_searches}/mo
                            </span>
                          </div>
                          <p className="text-xs text-navy-800 leading-snug">
                            {k.why_important}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Headline alignment + local SEO */}
                <div className="mt-6 grid md:grid-cols-2 gap-4">
                  <div className="p-4 border border-border rounded-md bg-soft/30">
                    <p className="text-xs uppercase tracking-wider text-navy-700/60 font-semibold mb-1">
                      Headline alignment
                    </p>
                    <p className="text-sm font-semibold text-navy-900 mb-1 capitalize">
                      {result.keywordReport.headline_alignment.score}
                    </p>
                    <p className="text-sm text-navy-800 leading-snug">
                      {result.keywordReport.headline_alignment.note}
                    </p>
                  </div>
                  <div className="p-4 border border-border rounded-md bg-soft/30">
                    <p className="text-xs uppercase tracking-wider text-navy-700/60 font-semibold mb-2">
                      Local SEO signals
                    </p>
                    <ul className="space-y-1 text-xs text-navy-800 mb-2">
                      <li className="flex items-center gap-2">
                        <StatusIcon
                          status={
                            result.keywordReport.local_seo.has_nap ? "pass" : "fail"
                          }
                        />
                        Name / Address / Phone visible
                      </li>
                      <li className="flex items-center gap-2">
                        <StatusIcon
                          status={
                            result.keywordReport.local_seo.has_schema
                              ? "pass"
                              : "fail"
                          }
                        />
                        Schema.org markup
                      </li>
                      <li className="flex items-center gap-2">
                        <StatusIcon
                          status={
                            result.keywordReport.local_seo.has_geo_meta
                              ? "pass"
                              : "warning"
                          }
                        />
                        Geo meta tags
                      </li>
                      <li className="flex items-center gap-2">
                        <StatusIcon
                          status={
                            result.keywordReport.local_seo.has_city_in_title
                              ? "pass"
                              : "fail"
                          }
                        />
                        City in page title
                      </li>
                    </ul>
                    <p className="text-sm text-navy-800 leading-snug mt-2 pt-2 border-t border-border">
                      {result.keywordReport.local_seo.note}
                    </p>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="mt-6">
                  <h5 className="text-sm font-semibold uppercase tracking-wider text-navy-700/70 mb-3">
                    Do these on Monday
                  </h5>
                  <ol className="space-y-2 list-decimal list-inside">
                    {result.keywordReport.recommendations.map((r, i) => (
                      <li key={i} className="text-sm text-navy-800 leading-relaxed">
                        {r}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            )}

            {/* 4. Business Impact */}
            {result.diagnosis?.business_impact && result.diagnosis.business_impact.length > 0 && (
              <div className="bg-soft border border-border rounded-xl p-8">
                <h4 className="text-xl font-bold font-heading text-navy-900 mb-4">
                  What this means for your business
                </h4>
                <ul className="space-y-3">
                  {result.diagnosis.business_impact.map((bullet, i) => (
                    <li key={i} className="flex items-start gap-3 text-navy-800">
                      <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-brand" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 5. Stack Action Plan */}
            {result.diagnosis?.action_plan && (
              <div className="bg-white border border-border rounded-xl p-8">
                <div className="mb-6">
                  <span className="section-kicker">Stack Consulting AI plan</span>
                  <h4 className="text-xl font-bold font-heading text-navy-900 mt-3">
                    Recommended path forward
                  </h4>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {([
                    ["phase_1", result.diagnosis.action_plan.phase_1],
                    ["phase_2", result.diagnosis.action_plan.phase_2],
                  ] as const).map(([key, phase], i) => (
                    <div
                      key={key}
                      className={`p-6 rounded-md border ${i === 0 ? "border-brand bg-brand/5" : "border-border bg-soft"}`}
                    >
                      <div className="flex items-baseline justify-between gap-2 mb-3">
                        <span className="text-xs font-mono uppercase tracking-wider text-navy-700/60">
                          Phase {i + 1}
                        </span>
                        <span className="text-xs font-medium text-navy-700">
                          {phase.timeline}
                        </span>
                      </div>
                      <h5 className="text-lg font-bold font-heading text-navy-900 mb-2">
                        {phase.title}
                      </h5>
                      <p className="text-sm font-mono text-brand mb-4">
                        {phase.estimated_price_range}
                      </p>
                      <ul className="space-y-2">
                        {phase.includes.map((item, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-navy-800">
                            <CheckCircle className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Raw Findings (collapsible-feeling) */}
            <details className="bg-white border border-border rounded-xl overflow-hidden group">
              <summary className="cursor-pointer px-6 py-4 bg-soft hover:bg-soft/70 text-sm font-semibold text-navy-900 flex items-center justify-between">
                <span>See all {result.mobile.findings.length} raw Lighthouse findings</span>
                <ArrowRight className="w-4 h-4 transition-transform group-open:rotate-90" />
              </summary>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-3">
                {result.mobile.findings.map((finding, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-md border border-border"
                  >
                    <div className="mt-0.5">
                      <StatusIcon status={finding.status} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm font-medium text-navy-900">
                          {finding.label}
                        </span>
                        <span
                          className={`text-sm font-mono font-medium shrink-0 ${scoreColor(
                            finding.status === "pass" ? 100 : finding.status === "warning" ? 60 : 30,
                          )}`}
                        >
                          {finding.value}
                        </span>
                      </div>
                      {FINDING_DESCRIPTIONS[finding.label] && (
                        <p className="mt-1 text-xs text-navy-700/70 leading-snug">
                          {FINDING_DESCRIPTIONS[finding.label]}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </details>

            {/* CTA Bar */}
            <div className="bg-navy-900 rounded-xl p-8 md:p-10">
              <div className="grid md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-7">
                  <h4 className="text-2xl font-bold font-heading text-white mb-2 tracking-tight">
                    {result.diagnosis?.cta_headline ?? "Want us to fix this?"}
                  </h4>
                  <p className="text-white/70">
                    {result.diagnosis?.cta_subhead ??
                      "Book a 20-minute call. We'll walk you through the audit and tell you what's worth fixing."}
                  </p>
                  <p className="text-xs text-white/50 mt-4">
                    Full report emailed to{" "}
                    <span className="text-white font-medium">{email}</span>.
                  </p>
                </div>
                <div className="md:col-span-5 flex flex-col gap-3">
                  <Link
                    href="/#contact"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand hover:bg-brand-hover text-white rounded-md font-semibold transition-colors"
                  >
                    Schedule a free review call
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => {
                      setResult(null);
                      setUrl("");
                      setName("");
                      setEmail("");
                      setPhone("");
                      setError("");
                    }}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-white/20 hover:border-white/40 hover:bg-white/5 text-white rounded-md font-medium transition-colors"
                  >
                    Audit another site
                  </button>
                </div>
              </div>
            </div>

            {result.diagnosisError && (
              <p className="text-xs text-navy-700/50 text-center font-mono">
                Note: AI diagnosis layer failed ({result.diagnosisError}). Showing raw scorecard only.
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
