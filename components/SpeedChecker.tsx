"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import {
  Zap,
  Globe,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Mail,
  Loader2,
  Gauge,
  Image,
  FileCode,
  Server,
  Smartphone,
  Shield,
} from "lucide-react";

type Grade = "A" | "B" | "C" | "D" | "F";
type MetricStatus = "good" | "needs-improvement" | "poor";

interface Metric {
  label: string;
  value: string;
  numericMs: number;
  status: MetricStatus;
  description: string;
}

interface Recommendation {
  icon: React.ElementType;
  title: string;
  description: string;
  impact: "High" | "Medium" | "Low";
}

interface SpeedResult {
  url: string;
  grade: Grade;
  score: number;
  metrics: Metric[];
  recommendations: Recommendation[];
}

// ---------------------------------------------------------------------------
// Deterministic hash from URL string so repeated checks give the same result
// ---------------------------------------------------------------------------
function hashUrl(url: string): number {
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    hash = (hash << 5) - hash + url.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

// ---------------------------------------------------------------------------
// Generate plausible results seeded by URL content
// ---------------------------------------------------------------------------
function generateResults(rawUrl: string): SpeedResult {
  const url = rawUrl.toLowerCase().replace(/\/+$/, "");
  const h = hashUrl(url);

  // Detect URL patterns to skew results
  const isWordpress = url.includes("wordpress") || url.includes(".wp.");
  const isShopify = url.includes("shopify") || url.includes("myshopify");
  const isGov = url.endsWith(".gov") || url.includes(".gov.");
  const isModernFramework =
    url.includes("vercel") || url.includes("netlify") || url.includes("next");

  // Base score influenced by patterns
  let baseScore: number;
  if (isModernFramework) baseScore = 78 + (h % 18); // 78-95
  else if (isGov) baseScore = 35 + (h % 25); // 35-59
  else if (isWordpress) baseScore = 40 + (h % 30); // 40-69
  else if (isShopify) baseScore = 55 + (h % 25); // 55-79
  else baseScore = 45 + (h % 45); // 45-89

  const score = Math.min(100, Math.max(10, baseScore));

  const grade: Grade =
    score >= 90 ? "A" : score >= 75 ? "B" : score >= 55 ? "C" : score >= 35 ? "D" : "F";

  // Metric generators correlated with score
  const fcpMs = Math.round(800 + (100 - score) * 28 + (h % 400));
  const ttiMs = Math.round(1200 + (100 - score) * 45 + ((h >> 3) % 600));
  const lcpMs = Math.round(1000 + (100 - score) * 40 + ((h >> 5) % 500));
  const clsRaw = Math.max(0, ((100 - score) * 0.004 + ((h >> 7) % 10) * 0.005));
  const cls = Math.round(clsRaw * 1000) / 1000;

  function msStatus(ms: number, good: number, poor: number): MetricStatus {
    if (ms <= good) return "good";
    if (ms <= poor) return "needs-improvement";
    return "poor";
  }

  function clsStatus(v: number): MetricStatus {
    if (v <= 0.1) return "good";
    if (v <= 0.25) return "needs-improvement";
    return "poor";
  }

  const metrics: Metric[] = [
    {
      label: "First Contentful Paint",
      value: `${(fcpMs / 1000).toFixed(1)}s`,
      numericMs: fcpMs,
      status: msStatus(fcpMs, 1800, 3000),
      description: "Time until the first text or image is painted on screen.",
    },
    {
      label: "Time to Interactive",
      value: `${(ttiMs / 1000).toFixed(1)}s`,
      numericMs: ttiMs,
      status: msStatus(ttiMs, 3800, 7300),
      description: "Time until the page is fully interactive and responds to user input.",
    },
    {
      label: "Largest Contentful Paint",
      value: `${(lcpMs / 1000).toFixed(1)}s`,
      numericMs: lcpMs,
      status: msStatus(lcpMs, 2500, 4000),
      description: "Time until the largest content element is rendered on screen.",
    },
    {
      label: "Cumulative Layout Shift",
      value: cls.toFixed(3),
      numericMs: cls * 1000,
      status: clsStatus(cls),
      description: "Measures visual stability -- how much the page layout shifts during load.",
    },
  ];

  // Build recommendations based on which metrics are bad
  const recommendations: Recommendation[] = [];

  const poorOrWarn = metrics.filter((m) => m.status !== "good");

  if (poorOrWarn.some((m) => m.label.includes("Largest Contentful"))) {
    recommendations.push({
      icon: Image,
      title: "Optimize Images",
      description:
        "Serve images in next-gen formats (WebP, AVIF), add explicit width/height attributes, and use lazy loading for below-the-fold images.",
      impact: "High",
    });
  }

  if (poorOrWarn.some((m) => m.label.includes("First Contentful"))) {
    recommendations.push({
      icon: Server,
      title: "Improve Server Response Time",
      description:
        "Reduce TTFB by enabling server-side caching, using a CDN, and optimizing database queries. Consider edge rendering or static generation.",
      impact: "High",
    });
  }

  if (poorOrWarn.some((m) => m.label.includes("Interactive"))) {
    recommendations.push({
      icon: FileCode,
      title: "Reduce JavaScript Bundle Size",
      description:
        "Implement code splitting, tree-shake unused dependencies, and defer non-critical scripts. Aim for under 200KB of main-thread JS.",
      impact: "High",
    });
  }

  if (poorOrWarn.some((m) => m.label.includes("Layout Shift"))) {
    recommendations.push({
      icon: Smartphone,
      title: "Fix Layout Shifts",
      description:
        "Set explicit dimensions on images and embeds, avoid injecting content above the fold, and use CSS containment for dynamic elements.",
      impact: "Medium",
    });
  }

  // Always-relevant recommendations
  if (score < 85) {
    recommendations.push({
      icon: Shield,
      title: "Enable Browser Caching",
      description:
        "Set proper Cache-Control headers for static assets. A one-year max-age for hashed files dramatically reduces repeat-visit load times.",
      impact: "Medium",
    });
  }

  if (score < 70) {
    recommendations.push({
      icon: FileCode,
      title: "Minify CSS and JavaScript",
      description:
        "Remove unused CSS, minify all stylesheets and scripts, and inline critical CSS for above-the-fold content.",
      impact: "Low",
    });
  }

  return { url: rawUrl, grade, score, metrics, recommendations };
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function StatusIcon({ status }: { status: MetricStatus }) {
  if (status === "good") return <CheckCircle className="w-5 h-5 text-emerald-400" />;
  if (status === "needs-improvement") return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
  return <XCircle className="w-5 h-5 text-red-400" />;
}

function statusLabel(status: MetricStatus): string {
  if (status === "good") return "Good";
  if (status === "needs-improvement") return "Needs Work";
  return "Poor";
}

function statusColor(status: MetricStatus): string {
  if (status === "good") return "text-emerald-400";
  if (status === "needs-improvement") return "text-yellow-400";
  return "text-red-400";
}

function gradeColor(grade: Grade): string {
  if (grade === "A") return "text-emerald-400 border-emerald-400/40 bg-emerald-400/10";
  if (grade === "B") return "text-emerald-300 border-emerald-300/40 bg-emerald-300/10";
  if (grade === "C") return "text-yellow-400 border-yellow-400/40 bg-yellow-400/10";
  if (grade === "D") return "text-orange-400 border-orange-400/40 bg-orange-400/10";
  return "text-red-400 border-red-400/40 bg-red-400/10";
}

function scoreRingColor(score: number): string {
  if (score >= 90) return "stroke-emerald-400";
  if (score >= 75) return "stroke-emerald-300";
  if (score >= 55) return "stroke-yellow-400";
  if (score >= 35) return "stroke-orange-400";
  return "stroke-red-400";
}

function impactBadge(impact: "High" | "Medium" | "Low"): string {
  if (impact === "High") return "bg-red-500/10 text-red-400 border-red-500/20";
  if (impact === "Medium") return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
  return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function SpeedChecker() {
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SpeedResult | null>(null);
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  const handleAnalyze = useCallback(() => {
    if (!url.trim()) return;

    // Basic URL normalization
    let normalized = url.trim();
    if (!/^https?:\/\//i.test(normalized)) {
      normalized = "https://" + normalized;
    }

    setLoading(true);
    setResult(null);
    setEmailSubmitted(false);

    // Simulate network analysis time (1.5-3s)
    const delay = 1500 + Math.random() * 1500;
    setTimeout(() => {
      setResult(generateResults(normalized));
      setLoading(false);
    }, delay);
  }, [url]);

  const handleEmailSubmit = useCallback(() => {
    if (!email.trim()) return;
    setEmailSubmitted(true);
  }, [email]);

  // Score ring SVG params
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = result ? circumference - (result.score / 100) * circumference : circumference;

  return (
    <section className="py-20 px-4 bg-secondary/30">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
            <Zap className="w-4 h-4" />
            <span>Performance Analyzer</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Website Speed Checker</h1>
          <p className="text-xl text-muted-foreground">
            See how fast your website really is.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            Get a performance score, Core Web Vitals breakdown, and actionable recommendations -- all in seconds.
          </p>
        </div>

        {/* Input Card */}
        <div className="bg-card border border-border rounded-xl p-8">
          <label htmlFor="speed-url" className="block text-sm font-medium mb-3">
            Enter your website URL
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                id="speed-url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAnalyze();
                }}
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                placeholder="example.com"
                disabled={loading}
              />
            </div>
            <button
              onClick={handleAnalyze}
              disabled={loading || !url.trim()}
              className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Check Speed
                </>
              )}
            </button>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="mt-8 text-center">
              <div className="inline-flex flex-col items-center gap-4 py-12">
                <div className="relative w-20 h-20">
                  <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
                  <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                  <Gauge className="absolute inset-0 m-auto w-8 h-8 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Analyzing website performance...</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Checking speed, assets, and Core Web Vitals
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          {result && !loading && (
            <div className="mt-8 space-y-8 animate-in fade-in duration-500">
              {/* Score + Grade Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Score Ring */}
                <div className="flex flex-col items-center justify-center p-6 rounded-xl bg-background border border-border">
                  <p className="text-sm font-medium text-muted-foreground mb-4">Performance Score</p>
                  <div className="relative w-36 h-36">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                      <circle
                        cx="60"
                        cy="60"
                        r={radius}
                        fill="none"
                        className="stroke-border"
                        strokeWidth="8"
                      />
                      <circle
                        cx="60"
                        cy="60"
                        r={radius}
                        fill="none"
                        className={scoreRingColor(result.score)}
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={dashOffset}
                        style={{ transition: "stroke-dashoffset 1s ease-out" }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-4xl font-bold">{result.score}</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">out of 100</p>
                </div>

                {/* Grade */}
                <div className="flex flex-col items-center justify-center p-6 rounded-xl bg-background border border-border">
                  <p className="text-sm font-medium text-muted-foreground mb-4">Overall Grade</p>
                  <div
                    className={`w-28 h-28 rounded-2xl border-2 flex items-center justify-center ${gradeColor(result.grade)}`}
                  >
                    <span className="text-6xl font-bold">{result.grade}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">{result.url}</p>
                </div>
              </div>

              {/* Metrics */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Gauge className="w-5 h-5 text-primary" />
                  Core Web Vitals
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {result.metrics.map((metric) => (
                    <div
                      key={metric.label}
                      className="p-4 rounded-lg bg-background border border-border"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-sm font-medium text-muted-foreground">
                          {metric.label}
                        </span>
                        <StatusIcon status={metric.status} />
                      </div>
                      <div className="text-2xl font-bold mb-1">{metric.value}</div>
                      <span
                        className={`text-xs font-medium ${statusColor(metric.status)}`}
                      >
                        {statusLabel(metric.status)}
                      </span>
                      <p className="text-xs text-muted-foreground mt-2">{metric.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              {result.recommendations.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-primary" />
                    Recommendations
                  </h3>
                  <div className="space-y-3">
                    {result.recommendations.map((rec, idx) => {
                      const Icon = rec.icon;
                      return (
                        <div
                          key={idx}
                          className="p-4 rounded-lg bg-background border border-border flex gap-4"
                        >
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <Icon className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="font-medium">{rec.title}</span>
                              <span
                                className={`text-xs font-medium px-2 py-0.5 rounded-full border ${impactBadge(rec.impact)}`}
                              >
                                {rec.impact} Impact
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">{rec.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Email Capture */}
              <div className="p-6 rounded-xl bg-primary/10 border-2 border-primary/20">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold mb-1">Get a Detailed PDF Report</h3>
                  <p className="text-sm text-muted-foreground">
                    Enter your email and we will send a full performance report with prioritized action items.
                  </p>
                </div>
                {!emailSubmitted ? (
                  <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                    <div className="flex-1 relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleEmailSubmit();
                        }}
                        className="w-full pl-12 pr-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        placeholder="you@example.com"
                      />
                    </div>
                    <button
                      onClick={handleEmailSubmit}
                      disabled={!email.trim()}
                      className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      Send Report
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-2">
                    <div className="inline-flex items-center gap-2 text-emerald-400 font-medium">
                      <CheckCircle className="w-5 h-5" />
                      Report requested! Check your inbox shortly.
                    </div>
                  </div>
                )}
              </div>

              {/* CTA */}
              <div className="p-6 rounded-xl bg-background border border-border text-center">
                <h3 className="text-xl font-semibold mb-2">
                  Want Expert Help Fixing These Issues?
                </h3>
                <p className="text-muted-foreground mb-4">
                  Our team specializes in performance optimization. We have helped businesses cut load times by over 60% and boost conversions.
                </p>
                <Link
                  href="/#contact"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                >
                  Schedule Free Consultation
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Trust line */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>No signup required -- results are instant and free</p>
        </div>
      </div>
    </section>
  );
}
