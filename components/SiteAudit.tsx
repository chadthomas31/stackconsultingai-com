"use client";

import { useState, useCallback, useEffect, useRef } from "react";
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

interface AuditResult {
  success: boolean;
  url: string;
  overallGrade: string;
  overallScore: number;
  mobile: { scores: Scores; findings: Finding[] };
  desktop: { scores: Scores; findings: Finding[] };
}

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
  if (score >= 90) return "text-emerald-400";
  if (score >= 50) return "text-amber-400";
  return "text-red-400";
}

function scoreStroke(score: number): string {
  if (score >= 90) return "stroke-emerald-400";
  if (score >= 50) return "stroke-amber-400";
  return "stroke-red-400";
}

function gradeColor(grade: string): string {
  if (grade === "A") return "text-emerald-400";
  if (grade === "B") return "text-sky-400";
  if (grade === "C") return "text-amber-400";
  if (grade === "D") return "text-orange-400";
  return "text-red-400";
}

function gradeStroke(grade: string): string {
  if (grade === "A") return "stroke-emerald-400";
  if (grade === "B") return "stroke-sky-400";
  if (grade === "C") return "stroke-amber-400";
  if (grade === "D") return "stroke-orange-400";
  return "stroke-red-400";
}

function gradeBg(grade: string): string {
  if (grade === "A") return "from-emerald-400/20 to-emerald-400/5";
  if (grade === "B") return "from-sky-400/20 to-sky-400/5";
  if (grade === "C") return "from-amber-400/20 to-amber-400/5";
  if (grade === "D") return "from-orange-400/20 to-orange-400/5";
  return "from-red-400/20 to-red-400/5";
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

function StatusIcon({ status }: { status: "pass" | "warning" | "fail" }) {
  if (status === "pass")
    return <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />;
  if (status === "warning")
    return <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />;
  return <XCircle className="w-4 h-4 text-red-400 shrink-0" />;
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
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url: normalizeUrl(url),
            name,
            email,
            phone: phone || undefined,
          }),
          signal: AbortSignal.timeout(90000),
        });

        if (!res.ok && res.status >= 500) {
          setError(
            "The audit took too long — that usually means the target site is slow. Try again, or try a different URL."
          );
          setLoading(false);
          return;
        }

        const data = await res.json();

        if (!data.success) {
          setError(data.error || "Something went wrong. Please try again.");
          setLoading(false);
          return;
        }

        setProgress(100);
        // Short delay so the progress bar fills
        setTimeout(() => {
          setResult(data as AuditResult);
          setLoading(false);
          // Push GTM event
          if (typeof window !== "undefined" && (window as any).dataLayer) {
            (window as any).dataLayer.push({
              event: "site_audit_complete",
              audit_url: data.url,
              audit_grade: data.overallGrade,
              audit_score: data.overallScore,
            });
          }
          // Scroll to results
          setTimeout(() => {
            resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 200);
        }, 400);
      } catch (err: unknown) {
        const isTimeout =
          err instanceof DOMException && err.name === "TimeoutError";
        setError(
          isTimeout
            ? "The audit timed out. PageSpeed is slow — try again in a moment."
            : "Network error. Please check your connection and try again."
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

        {/* Results Dashboard */}
        {result && (
          <div ref={resultRef} className="space-y-8 animate-fade-in-up">
            {/* Overall Grade Card */}
            <div
              className={`bg-gradient-to-br ${gradeBg(result.overallGrade)} border border-border rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8`}
            >
              <GradeGauge grade={result.overallGrade} score={result.overallScore} />
              <div className="text-center md:text-left flex-1">
                <h3 className="text-2xl font-bold font-heading mb-2">
                  Overall Website Grade
                </h3>
                <p className="text-muted-foreground mb-1">
                  Analysis of{" "}
                  <span className="text-foreground font-medium">{result.url}</span>
                </p>
                <p className="text-sm text-muted-foreground max-w-md">
                  {result.overallScore >= 90
                    ? "Excellent! Your website is performing great across all metrics. Minor tweaks could push you to perfection."
                    : result.overallScore >= 75
                      ? "Good foundation, but there are clear opportunities to improve performance and conversions."
                      : result.overallScore >= 50
                        ? "Your site has significant room for improvement. Fixing the issues below could dramatically boost traffic."
                        : "Critical issues detected. Your website is likely losing visitors and search rankings. Let us help."}
                </p>
              </div>
            </div>

            {/* Category Scores Grid */}
            <div className="bg-card border border-border rounded-xl p-8">
              <h3 className="text-lg font-bold font-heading mb-6 text-center">
                Category Scores (Mobile)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 justify-items-center">
                <RadialGauge
                  score={result.mobile.scores.performance}
                  label="Performance"
                />
                <RadialGauge score={result.mobile.scores.seo} label="SEO" />
                <RadialGauge
                  score={result.mobile.scores.accessibility}
                  label="Accessibility"
                />
                <RadialGauge
                  score={result.mobile.scores.bestPractices}
                  label="Best Practices"
                />
              </div>
            </div>

            {/* Mobile vs Desktop Comparison */}
            <div className="bg-card border border-border rounded-xl p-8">
              <h3 className="text-lg font-bold font-heading mb-6 text-center">
                Mobile vs Desktop
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Mobile */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 justify-center text-muted-foreground mb-2">
                    <Smartphone className="w-5 h-5 text-primary" />
                    <span className="font-semibold text-foreground">Mobile</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {(
                      [
                        ["Performance", result.mobile.scores.performance],
                        ["SEO", result.mobile.scores.seo],
                        ["Accessibility", result.mobile.scores.accessibility],
                        ["Best Practices", result.mobile.scores.bestPractices],
                      ] as const
                    ).map(([label, score]) => (
                      <div
                        key={label}
                        className="flex items-center justify-between p-3 rounded-lg bg-background border border-border"
                      >
                        <span className="text-xs text-muted-foreground">{label}</span>
                        <span className={`text-sm font-bold ${scoreColor(score)}`}>
                          {score}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Desktop */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 justify-center text-muted-foreground mb-2">
                    <Monitor className="w-5 h-5 text-primary" />
                    <span className="font-semibold text-foreground">Desktop</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {(
                      [
                        ["Performance", result.desktop.scores.performance],
                        ["SEO", result.desktop.scores.seo],
                        ["Accessibility", result.desktop.scores.accessibility],
                        ["Best Practices", result.desktop.scores.bestPractices],
                      ] as const
                    ).map(([label, score]) => (
                      <div
                        key={label}
                        className="flex items-center justify-between p-3 rounded-lg bg-background border border-border"
                      >
                        <span className="text-xs text-muted-foreground">{label}</span>
                        <span className={`text-sm font-bold ${scoreColor(score)}`}>
                          {score}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Key Findings */}
            <div className="bg-card border border-border rounded-xl p-8">
              <h3 className="text-lg font-bold font-heading mb-6">Key Findings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {result.mobile.findings.map((finding, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-lg bg-background border border-border"
                  >
                    <StatusIcon status={finding.status} />
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium text-foreground">
                        {finding.label}
                      </span>
                    </div>
                    <span
                      className={`text-sm font-mono font-medium shrink-0 ${
                        finding.status === "pass"
                          ? "text-emerald-400"
                          : finding.status === "warning"
                            ? "text-amber-400"
                            : "text-red-400"
                      }`}
                    >
                      {finding.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-primary/10 border-2 border-primary/20 rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-bold font-heading mb-3">
                Want Us to Fix These Issues?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                Our team can optimize your website for speed, SEO, and conversions.
                Book a free strategy call to discuss your results.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/#contact"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                >
                  Get a Free Consultation
                  <ArrowRight className="w-5 h-5" />
                </a>
                <button
                  onClick={() => {
                    setResult(null);
                    setUrl("");
                    setName("");
                    setEmail("");
                    setPhone("");
                    setError("");
                  }}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-border rounded-lg font-semibold hover:bg-secondary transition-all"
                >
                  Audit Another Site
                </button>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Full report sent to{" "}
                <span className="text-foreground font-medium">{email}</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
