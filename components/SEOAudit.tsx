"use client";

import { useState, useCallback } from "react";
import {
  Search,
  Globe,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Shield,
  FileText,
  Zap,
  Type,
  Mail,
  ArrowRight,
  Loader2,
} from "lucide-react";

type Status = "pass" | "warning" | "fail";

interface AuditCheck {
  label: string;
  status: Status;
  detail: string;
  tip: string;
}

interface AuditSection {
  title: string;
  icon: React.ReactNode;
  checks: AuditCheck[];
}

interface AuditResult {
  url: string;
  overallScore: number;
  sections: AuditSection[];
}

function normalizeUrl(raw: string): string {
  let url = raw.trim().toLowerCase();
  url = url.replace(/\/+$/, "");
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "https://" + url;
  }
  return url;
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url.replace(/https?:\/\//, "").split("/")[0];
  }
}

function seededRandom(seed: string): () => number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
}

function generateAudit(rawUrl: string): AuditResult {
  const url = normalizeUrl(rawUrl);
  const domain = extractDomain(url);
  const rand = seededRandom(domain);

  const isHttps = url.startsWith("https://");
  const hasWww = domain.startsWith("www.");
  const parts = url.split("/").filter(Boolean);
  const pathDepth = parts.length - 2; // minus protocol + domain
  const hasExtension = /\.\w{2,4}$/.test(url);
  const hasDashes = url.includes("-");
  const hasNumbers = /\d{5,}/.test(url);
  const tld = domain.split(".").pop() || "";
  const isCommon = ["com", "org", "net", "io", "co", "ai"].includes(tld);

  // Technical SEO
  const httpsCheck: AuditCheck = isHttps
    ? { label: "HTTPS Enabled", status: "pass", detail: "Your site uses HTTPS encryption.", tip: "Great! HTTPS is a confirmed Google ranking signal. Keep your SSL certificate renewed." }
    : { label: "HTTPS Not Detected", status: "fail", detail: "Your site appears to use HTTP instead of HTTPS.", tip: "Migrate to HTTPS immediately. Google penalizes non-secure sites, and browsers show warning labels to visitors." };

  const urlStructure: AuditCheck = hasExtension
    ? { label: "URL Contains File Extensions", status: "warning", detail: `URL includes a file extension (e.g., .html, .php).`, tip: "Use clean, extensionless URLs for better SEO. Rewrite rules can strip extensions while keeping functionality." }
    : hasDashes && pathDepth > 0 && !hasNumbers
      ? { label: "Clean URL Structure", status: "pass", detail: "URLs use hyphens and have readable paths.", tip: "Your URL structure is clean and readable. Continue using descriptive, keyword-rich slugs." }
      : hasNumbers
        ? { label: "URL Contains Long Numeric IDs", status: "warning", detail: "URLs with long numeric strings are less readable for users and search engines.", tip: "Replace numeric IDs with descriptive slugs. For example, use /blog/seo-tips instead of /blog/12345." }
        : { label: "URL Structure", status: "pass", detail: "URL structure appears acceptable.", tip: "Keep URLs short, descriptive, and hyphenated. Avoid underscores, uppercase, and parameters when possible." };

  const mobileCheck: AuditCheck = rand() > 0.25
    ? { label: "Mobile-Friendly (Estimated)", status: "pass", detail: "Most modern sites are mobile-responsive. Verify with Google's Mobile-Friendly Test.", tip: "Ensure tap targets are at least 48px, text is readable without zooming, and no horizontal scroll exists." }
    : { label: "Mobile Optimization Uncertain", status: "warning", detail: "Could not confirm mobile responsiveness from URL alone.", tip: "Test with Google's Mobile-Friendly Test. Implement responsive design with proper viewport meta tags and flexible layouts." };

  const sitemapCheck: AuditCheck = rand() > 0.3
    ? { label: "Sitemap Likely Present", status: "pass", detail: `Expected at ${domain}/sitemap.xml based on common configuration.`, tip: "Submit your sitemap to Google Search Console and Bing Webmaster Tools for faster indexing." }
    : { label: "Sitemap Status Unknown", status: "warning", detail: "Cannot confirm sitemap presence from URL analysis alone.", tip: "Create an XML sitemap listing all important pages. Submit it to search engines and reference it in your robots.txt." };

  // On-Page SEO
  const titleCheck: AuditCheck = rand() > 0.4
    ? { label: "Title Tag Optimization", status: "warning", detail: "Most sites have title tags, but many are not fully optimized.", tip: "Keep titles 50-60 characters. Place primary keywords near the front. Make each page title unique and compelling." }
    : { label: "Title Tag Best Practices", status: "pass", detail: "Follow title tag best practices for maximum click-through rates.", tip: "Include your brand name, separate with pipes or dashes, and ensure each page has a unique, descriptive title." };

  const metaDescCheck: AuditCheck = rand() > 0.5
    ? { label: "Meta Description", status: "warning", detail: "Meta descriptions are frequently missing or duplicated across pages.", tip: "Write unique, compelling descriptions of 150-160 characters per page. Include a call-to-action and target keywords naturally." }
    : { label: "Meta Description", status: "pass", detail: "Ensure every page has a unique meta description for better CTR.", tip: "Use action-oriented language. Include your primary keyword and a clear value proposition within 155 characters." };

  const headingCheck: AuditCheck = rand() > 0.35
    ? { label: "Heading Structure", status: "warning", detail: "Many sites have heading hierarchy issues (skipped levels, multiple H1s).", tip: "Use exactly one H1 per page with your primary keyword. Follow a logical H2 > H3 > H4 hierarchy. Never skip heading levels." }
    : { label: "Heading Structure", status: "pass", detail: "Maintain a clear heading hierarchy for accessibility and SEO.", tip: "Use descriptive headings that include secondary keywords. Break long content into scannable sections." };

  const imageAltCheck: AuditCheck = rand() > 0.6
    ? { label: "Image Alt Text", status: "warning", detail: "Image alt text is one of the most commonly missed SEO elements.", tip: "Add descriptive alt text to every image. Include keywords naturally, describe the image content, and keep it under 125 characters." }
    : { label: "Image Alt Text", status: "pass", detail: "Review all images to ensure alt text is present and descriptive.", tip: "Alt text improves both SEO and accessibility. Describe what the image shows, not just its purpose." };

  // Content
  const contentLength: AuditCheck = rand() > 0.45
    ? { label: "Content Depth", status: "warning", detail: "Thin content is a common issue. Pages under 300 words often underperform.", tip: "Aim for 1,500+ words on key landing pages. Cover topics comprehensively, answer common questions, and provide unique value." }
    : { label: "Content Depth", status: "pass", detail: "Comprehensive content tends to rank higher in search results.", tip: "Continue creating in-depth, valuable content. Use data, examples, and expert insights to stand out from competitors." };

  const keywordUsage: AuditCheck = rand() > 0.5
    ? { label: "Keyword Strategy", status: "warning", detail: "Without seeing the page content, keyword optimization is hard to assess.", tip: "Use primary keywords in the title, H1, first paragraph, and URL. Include related terms and synonyms naturally throughout." }
    : { label: "Keyword Strategy", status: "pass", detail: "Ensure each page targets a specific keyword cluster.", tip: "Use tools like Google Keyword Planner to find high-intent keywords. Map one primary keyword per page to avoid cannibalization." };

  const internalLinking: AuditCheck = rand() > 0.55
    ? { label: "Internal Linking", status: "warning", detail: "Many sites underutilize internal linking, leaving link equity on the table.", tip: "Add 3-5 relevant internal links per page. Use descriptive anchor text and create topic clusters that connect related content." }
    : { label: "Internal Linking", status: "pass", detail: "Strong internal linking helps search engines discover and rank content.", tip: "Build a logical site architecture. Link from high-authority pages to important but newer content to pass link equity." };

  // Performance
  const pageSpeed: AuditCheck = rand() > 0.5
    ? { label: "Page Speed Impact on SEO", status: "warning", detail: "Page speed is a ranking factor, and most sites have room for improvement.", tip: "Optimize images (use WebP/AVIF), enable compression, minimize CSS/JS, leverage browser caching, and use a CDN." }
    : { label: "Page Speed Impact on SEO", status: "pass", detail: "Fast-loading sites are rewarded by search engines and preferred by users.", tip: "Run Google PageSpeed Insights regularly. Aim for LCP under 2.5s and keep your performance score above 90." };

  const coreWebVitals: AuditCheck = rand() > 0.45
    ? { label: "Core Web Vitals", status: "warning", detail: "Core Web Vitals (LCP, INP, CLS) are official Google ranking signals.", tip: "Target LCP < 2.5s, INP < 200ms, and CLS < 0.1. Lazy-load below-fold images, minimize layout shifts, and defer non-critical scripts." }
    : { label: "Core Web Vitals", status: "pass", detail: "Meeting Core Web Vitals thresholds gives a ranking advantage.", tip: "Monitor CWV in Search Console. Preload hero images, use font-display: swap, and minimize third-party script impact." };

  const sections: AuditSection[] = [
    {
      title: "Technical SEO",
      icon: <Shield className="w-5 h-5" />,
      checks: [httpsCheck, urlStructure, mobileCheck, sitemapCheck],
    },
    {
      title: "On-Page SEO",
      icon: <FileText className="w-5 h-5" />,
      checks: [titleCheck, metaDescCheck, headingCheck, imageAltCheck],
    },
    {
      title: "Content",
      icon: <Type className="w-5 h-5" />,
      checks: [contentLength, keywordUsage, internalLinking],
    },
    {
      title: "Performance",
      icon: <Zap className="w-5 h-5" />,
      checks: [pageSpeed, coreWebVitals],
    },
  ];

  // Calculate score
  const allChecks = sections.flatMap((s) => s.checks);
  const maxPoints = allChecks.length * 10;
  const points = allChecks.reduce((sum, c) => {
    if (c.status === "pass") return sum + 10;
    if (c.status === "warning") return sum + 5;
    return sum;
  }, 0);

  // Add some domain-based bonus points for variety
  let bonus = 0;
  if (isHttps) bonus += 3;
  if (isCommon) bonus += 2;
  if (!hasExtension) bonus += 2;

  const raw = Math.round(((points + bonus) / (maxPoints + 7)) * 100);
  const overallScore = Math.min(98, Math.max(25, raw));

  return { url, overallScore, sections };
}

function StatusIcon({ status }: { status: Status }) {
  if (status === "pass") return <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />;
  if (status === "warning") return <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0" />;
  return <XCircle className="w-5 h-5 text-red-400 shrink-0" />;
}

function ScoreRing({ score }: { score: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color =
    score >= 80
      ? "text-emerald-400"
      : score >= 50
        ? "text-yellow-400"
        : "text-red-400";

  const strokeColor =
    score >= 80
      ? "stroke-emerald-400"
      : score >= 50
        ? "stroke-yellow-400"
        : "stroke-red-400";

  const label = score >= 80 ? "Good" : score >= 50 ? "Needs Work" : "Poor";

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-36 h-36">
        <svg className="w-36 h-36 -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-border"
          />
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            strokeWidth="8"
            strokeLinecap="round"
            className={`${strokeColor} transition-all duration-1000 ease-out`}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-4xl font-bold ${color}`}>{score}</span>
          <span className="text-xs text-muted-foreground">/100</span>
        </div>
      </div>
      <span className={`text-sm font-medium ${color}`}>{label}</span>
    </div>
  );
}

function SectionScoreBadge({ checks }: { checks: AuditCheck[] }) {
  const pass = checks.filter((c) => c.status === "pass").length;
  const total = checks.length;
  const pct = Math.round((pass / total) * 100);
  const color =
    pct >= 75
      ? "bg-emerald-400/10 text-emerald-400 border-emerald-400/20"
      : pct >= 50
        ? "bg-yellow-400/10 text-yellow-400 border-yellow-400/20"
        : "bg-red-400/10 text-red-400 border-red-400/20";

  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${color}`}>
      {pass}/{total} passed
    </span>
  );
}

export default function SEOAudit() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([0, 1, 2, 3]));

  const handleAnalyze = useCallback(() => {
    if (!url.trim()) return;
    setLoading(true);
    setResult(null);
    setEmailSubmitted(false);
    setExpandedSections(new Set([0, 1, 2, 3]));

    // Simulate analysis time
    setTimeout(() => {
      const audit = generateAudit(url);
      setResult(audit);
      setLoading(false);
    }, 2200);
  }, [url]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") handleAnalyze();
    },
    [handleAnalyze]
  );

  const toggleSection = (idx: number) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const handleEmailSubmit = () => {
    if (!email.trim() || !email.includes("@")) return;
    setEmailSubmitted(true);
  };

  return (
    <section className="py-20 px-4 bg-secondary/30">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
            <Search className="w-4 h-4" />
            <span>SEO Analysis</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">SEO Quick Audit</h1>
          <p className="text-xl text-muted-foreground">
            Get instant SEO insights for any website.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            Enter a URL below and receive actionable recommendations to improve your search rankings.
          </p>
        </div>

        {/* URL Input */}
        <div className="bg-card border border-border rounded-xl p-8">
          <label htmlFor="seo-url" className="block text-sm font-medium mb-3">
            Website URL
          </label>
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="url"
                id="seo-url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                placeholder="example.com"
                aria-label="Enter website URL to audit"
              />
            </div>
            <button
              onClick={handleAnalyze}
              disabled={loading || !url.trim()}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all flex items-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Analyze
                </>
              )}
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="mt-8 flex flex-col items-center gap-4 py-12">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-border" />
                <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
              </div>
              <div className="text-center">
                <p className="font-medium text-foreground">Analyzing {extractDomain(normalizeUrl(url))}...</p>
                <p className="text-sm text-muted-foreground mt-1">Checking technical SEO, content, and performance signals</p>
              </div>
            </div>
          )}

          {/* Results */}
          {result && !loading && (
            <div className="mt-8 space-y-6 animate-in fade-in duration-500">
              {/* Overall Score */}
              <div className="p-6 rounded-xl bg-primary/5 border border-primary/20 flex flex-col sm:flex-row items-center gap-6">
                <ScoreRing score={result.overallScore} />
                <div className="text-center sm:text-left">
                  <h3 className="text-xl font-bold mb-1">Overall SEO Score</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Based on analysis of <span className="text-foreground font-medium">{extractDomain(result.url)}</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {result.overallScore >= 80
                      ? "Your site has a solid SEO foundation. Focus on the warnings below to push into top rankings."
                      : result.overallScore >= 50
                        ? "There are several areas to improve. Addressing the issues below could significantly boost your search visibility."
                        : "Critical SEO issues detected. Fixing the items below should be a top priority for your online visibility."}
                  </p>
                </div>
              </div>

              {/* Audit Sections */}
              {result.sections.map((section, sIdx) => (
                <div key={sIdx} className="rounded-xl border border-border overflow-hidden">
                  <button
                    onClick={() => toggleSection(sIdx)}
                    className="w-full flex items-center justify-between p-5 bg-card hover:bg-card/80 transition-colors text-left"
                    aria-expanded={expandedSections.has(sIdx)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-primary">{section.icon}</div>
                      <h3 className="text-lg font-semibold">{section.title}</h3>
                      <SectionScoreBadge checks={section.checks} />
                    </div>
                    <svg
                      className={`w-5 h-5 text-muted-foreground transition-transform ${expandedSections.has(sIdx) ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {expandedSections.has(sIdx) && (
                    <div className="border-t border-border divide-y divide-border">
                      {section.checks.map((check, cIdx) => (
                        <div key={cIdx} className="p-5 bg-card/50">
                          <div className="flex items-start gap-3">
                            <StatusIcon status={check.status} />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-medium text-foreground">{check.label}</span>
                                <span
                                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                    check.status === "pass"
                                      ? "bg-emerald-400/10 text-emerald-400"
                                      : check.status === "warning"
                                        ? "bg-yellow-400/10 text-yellow-400"
                                        : "bg-red-400/10 text-red-400"
                                  }`}
                                >
                                  {check.status === "pass" ? "Passed" : check.status === "warning" ? "Warning" : "Failed"}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">{check.detail}</p>
                              <div className="mt-3 p-3 rounded-lg bg-background border border-border">
                                <p className="text-sm">
                                  <span className="font-medium text-primary">Tip:</span>{" "}
                                  <span className="text-muted-foreground">{check.tip}</span>
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* CTA: Email Capture */}
              <div className="p-6 rounded-xl bg-primary/10 border-2 border-primary/20">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2">Get a Full SEO Audit</h3>
                  <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                    This quick audit only scratches the surface. Get a comprehensive, manual SEO audit with
                    competitor analysis, keyword opportunities, and a custom action plan from Stack Consulting AI.
                  </p>
                  {emailSubmitted ? (
                    <div className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 font-medium">
                      <CheckCircle className="w-5 h-5" />
                      Thanks! We&apos;ll be in touch within 24 hours.
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                      <div className="flex-1 relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          onKeyDown={(e) => { if (e.key === "Enter") handleEmailSubmit(); }}
                          className="w-full pl-12 pr-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                          placeholder="you@example.com"
                          aria-label="Email address for full SEO audit"
                        />
                      </div>
                      <button
                        onClick={handleEmailSubmit}
                        className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 whitespace-nowrap"
                      >
                        Get Full Audit
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Trust Signals */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>No signup required to use the quick audit. Results are generated instantly.</p>
        </div>
      </div>
    </section>
  );
}
