"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Calendar,
  Receipt,
  Mail,
  Share2,
  MessageCircle,
  Database,
  Package,
  Target,
  BarChart3,
  UserPlus,
  FileText,
  Cog,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Zap,
  CheckCircle,
  User,
  Phone,
  Clock,
  DollarSign,
  TrendingUp,
  Rocket,
  Settings,
  Star,
  type LucideIcon,
} from "lucide-react";
import { trackConversionEvent } from "@/lib/analytics-client";

/* ---------- Types ---------- */

interface AutomationRec {
  title: string;
  description: string;
  hoursSaved: number;
  priority: "high" | "medium" | "low";
  tools: string[];
  phase: 1 | 2 | 3;
  icon: string;
}

interface WizardData {
  businessName: string;
  industry: string;
  teamSize: string;
  revenueRange: string;
  painPoints: string[];
  otherPainPoint: string;
  currentTools: string[];
  name: string;
  email: string;
  phone: string;
}

interface Recommendation extends AutomationRec {
  key: string;
}

/* ---------- Constants ---------- */

const INDUSTRIES = [
  { label: "Restaurant / Food", emoji: "🍽️" },
  { label: "Retail / E-commerce", emoji: "🛒" },
  { label: "Professional Services", emoji: "⚙️" },
  { label: "Healthcare", emoji: "🩺" },
  { label: "Construction / Trades", emoji: "🔨" },
  { label: "Real Estate", emoji: "🏠" },
  { label: "Auto / Repair", emoji: "🔧" },
  { label: "Hotel / Hospitality", emoji: "🏨" },
  { label: "Other", emoji: "✨" },
];

const TEAM_SIZES = ["Just me", "2-5", "6-15", "16-50", "50+"];

const REVENUE_RANGES = [
  "Under $10K",
  "$10K-$50K",
  "$50K-$200K",
  "$200K-$500K",
  "$500K+",
];

const PAIN_POINTS = [
  { key: "scheduling", label: "Scheduling & appointments" },
  { key: "invoicing", label: "Invoicing & billing" },
  { key: "email", label: "Email & follow-ups" },
  { key: "social-media", label: "Social media management" },
  { key: "customer-support", label: "Customer support / inquiries" },
  { key: "data-entry", label: "Data entry & spreadsheets" },
  { key: "inventory", label: "Inventory management" },
  { key: "lead-tracking", label: "Lead tracking & CRM" },
  { key: "reporting", label: "Reporting & analytics" },
  { key: "employee-onboarding", label: "Employee onboarding" },
  { key: "document-management", label: "Document management" },
  { key: "other", label: "Other" },
];

const CURRENT_TOOLS = [
  "Google Workspace (Gmail, Sheets, etc.)",
  "Microsoft 365",
  "QuickBooks / Xero",
  "Mailchimp / Constant Contact",
  "Salesforce / HubSpot",
  "Square / Stripe",
  "Shopify / WooCommerce",
  "Calendly / Acuity",
  "Slack / Teams",
  "Custom spreadsheets",
  "Paper / manual processes",
  "None of the above",
];

const ICON_MAP: Record<string, LucideIcon> = {
  Calendar,
  Receipt,
  Mail,
  Share2,
  MessageCircle,
  Database,
  Package,
  Target,
  BarChart3,
  UserPlus,
  FileText,
  Cog,
};

const automationMap: Record<string, AutomationRec> = {
  scheduling: {
    title: "Smart Scheduling & Booking",
    description:
      "Replace phone/email booking with an automated system. Clients book online, get confirmations, and receive reminders automatically.",
    hoursSaved: 6,
    priority: "high",
    tools: ["Calendly", "Cal.com", "Acuity"],
    phase: 1,
    icon: "Calendar",
  },
  invoicing: {
    title: "Automated Invoicing & Payment Reminders",
    description:
      "Generate invoices automatically from completed jobs. Send payment reminders on a schedule. Accept online payments.",
    hoursSaved: 5,
    priority: "high",
    tools: ["QuickBooks", "Stripe", "Zapier"],
    phase: 1,
    icon: "Receipt",
  },
  email: {
    title: "Email Sequences & Auto Follow-ups",
    description:
      "Set up automated email sequences for new leads, post-purchase follow-ups, and re-engagement campaigns.",
    hoursSaved: 7,
    priority: "high",
    tools: ["Mailchimp", "ActiveCampaign", "n8n"],
    phase: 1,
    icon: "Mail",
  },
  "social-media": {
    title: "Social Media Auto-Scheduling",
    description:
      "Batch-create content and schedule posts across all platforms. Auto-repurpose content for different channels.",
    hoursSaved: 5,
    priority: "medium",
    tools: ["Buffer", "Hootsuite", "Later"],
    phase: 2,
    icon: "Share2",
  },
  "customer-support": {
    title: "AI-Powered Customer Support",
    description:
      "Deploy an AI chatbot for FAQs and common inquiries. Route complex issues to your team automatically.",
    hoursSaved: 8,
    priority: "high",
    tools: ["Intercom", "Tidio", "Custom AI Bot"],
    phase: 2,
    icon: "MessageCircle",
  },
  "data-entry": {
    title: "Automated Data Capture & Entry",
    description:
      "Eliminate manual data entry with form automation, OCR for documents, and API integrations between your tools.",
    hoursSaved: 6,
    priority: "high",
    tools: ["Zapier", "Make", "n8n"],
    phase: 1,
    icon: "Database",
  },
  inventory: {
    title: "Real-Time Inventory Sync",
    description:
      "Sync inventory across all sales channels automatically. Get low-stock alerts and auto-reorder triggers.",
    hoursSaved: 4,
    priority: "medium",
    tools: ["Shopify", "Square", "TradeGecko"],
    phase: 2,
    icon: "Package",
  },
  "lead-tracking": {
    title: "Automated Lead Pipeline",
    description:
      "Capture leads from all channels into one CRM. Auto-score, auto-assign, and trigger follow-up sequences.",
    hoursSaved: 7,
    priority: "high",
    tools: ["HubSpot", "Pipedrive", "Zapier"],
    phase: 1,
    icon: "Target",
  },
  reporting: {
    title: "Auto-Generated Reports & Dashboards",
    description:
      "Pull data from all your tools into live dashboards. Get weekly summary reports delivered to your inbox automatically.",
    hoursSaved: 4,
    priority: "medium",
    tools: ["Google Data Studio", "Metabase", "n8n"],
    phase: 2,
    icon: "BarChart3",
  },
  "employee-onboarding": {
    title: "Streamlined Employee Onboarding",
    description:
      "Automate paperwork, training assignments, and account provisioning for new hires. One-click onboarding.",
    hoursSaved: 3,
    priority: "low",
    tools: ["BambooHR", "Gusto", "Notion"],
    phase: 3,
    icon: "UserPlus",
  },
  "document-management": {
    title: "Digital Document Workflow",
    description:
      "Replace paper with digital forms, e-signatures, and automated filing. Search any document instantly.",
    hoursSaved: 4,
    priority: "medium",
    tools: ["DocuSign", "PandaDoc", "Google Drive"],
    phase: 2,
    icon: "FileText",
  },
  other: {
    title: "Custom Workflow Automation",
    description:
      "We'll analyze your specific workflow and design a custom automation solution tailored to your business.",
    hoursSaved: 5,
    priority: "medium",
    tools: ["n8n", "Zapier", "Custom API"],
    phase: 2,
    icon: "Cog",
  },
};

/* ---------- Helpers ---------- */

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getTeamMultiplier(teamSize: string): number {
  switch (teamSize) {
    case "Just me":
      return 1;
    case "2-5":
      return 1.5;
    case "6-15":
      return 2;
    case "16-50":
      return 2.5;
    case "50+":
      return 3;
    default:
      return 1;
  }
}

function getHourlyCost(revenue: string): number {
  switch (revenue) {
    case "Under $10K":
      return 25;
    case "$10K-$50K":
      return 35;
    case "$50K-$200K":
      return 50;
    case "$200K-$500K":
      return 65;
    case "$500K+":
      return 85;
    default:
      return 35;
  }
}

function calculateAutomationScore(data: WizardData): number {
  let score = 0;

  // Pain points count (0-12) -> 0-50
  score += Math.min(data.painPoints.length * 4.2, 50);

  // Tool gaps: paper/manual or none = high score
  const manualTools = data.currentTools.filter(
    (t) => t === "Paper / manual processes" || t === "None of the above"
  );
  if (manualTools.length > 0) score += 20;
  else if (data.currentTools.length <= 2) score += 15;
  else if (data.currentTools.length <= 4) score += 10;
  else score += 5;

  // Team size -> bigger team = more opportunity
  const teamMultiplier = getTeamMultiplier(data.teamSize);
  score += teamMultiplier * 5;

  // Revenue scale
  const revenueIdx = REVENUE_RANGES.indexOf(data.revenueRange);
  score += (revenueIdx + 1) * 3;

  return Math.min(Math.round(score), 100);
}

function getRecommendations(data: WizardData): Recommendation[] {
  const recs: Recommendation[] = data.painPoints
    .filter((key) => automationMap[key])
    .map((key) => ({
      key,
      ...automationMap[key],
    }));

  // Sort: high priority first, then by hours saved
  recs.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return b.hoursSaved - a.hoursSaved;
  });

  return recs;
}

function calculateSavings(
  recs: Recommendation[],
  teamSize: string,
  revenue: string
): { hoursPerWeek: number; dollarsPerMonth: number } {
  const multiplier = getTeamMultiplier(teamSize);
  const hourlyCost = getHourlyCost(revenue);
  const baseHours = recs.reduce((sum, r) => sum + r.hoursSaved, 0);
  const scaledHours = Math.round(baseHours * Math.min(multiplier, 2));
  const dollarsPerMonth = Math.round(scaledHours * hourlyCost * 4.33);
  return { hoursPerWeek: scaledHours, dollarsPerMonth };
}

/* ---------- SVG Gauge ---------- */

function AutomationGauge({ score }: { score: number }) {
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

  const gaugeColor =
    score >= 70
      ? "stroke-red-400"
      : score >= 40
        ? "stroke-amber-400"
        : "stroke-emerald-400";
  const textColor =
    score >= 70
      ? "text-red-400"
      : score >= 40
        ? "text-amber-400"
        : "text-emerald-400";

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          className="-rotate-90"
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          aria-label={`Automation opportunity score: ${score} out of 100`}
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
            className={`${gaugeColor} transition-all duration-1000 ease-out`}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-5xl font-bold font-heading ${textColor}`}>
            {animatedScore}
          </span>
          <span className="text-sm text-muted-foreground">/100</span>
        </div>
      </div>
      <span className="text-sm font-medium text-muted-foreground">
        Automation Opportunity Score
      </span>
    </div>
  );
}

/* ---------- Progress Steps ---------- */

function ProgressBar({ currentStep }: { currentStep: number }) {
  const steps = [
    { num: 1, label: "Business" },
    { num: 2, label: "Pain Points" },
    { num: 3, label: "Tools" },
    { num: 4, label: "Contact" },
  ];

  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {steps.map((step, i) => (
        <div key={step.num} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                currentStep > step.num
                  ? "bg-primary text-primary-foreground"
                  : currentStep === step.num
                    ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                    : "bg-secondary text-muted-foreground border border-border"
              }`}
            >
              {currentStep > step.num ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                step.num
              )}
            </div>
            <span
              className={`text-xs mt-1.5 transition-colors ${
                currentStep >= step.num
                  ? "text-foreground font-medium"
                  : "text-muted-foreground"
              }`}
            >
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`w-12 sm:w-20 h-0.5 mx-2 mb-5 transition-colors duration-300 ${
                currentStep > step.num ? "bg-primary" : "bg-border"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

/* ---------- Priority Badge ---------- */

function PriorityBadge({ priority }: { priority: "high" | "medium" | "low" }) {
  const styles = {
    high: "bg-red-400/10 text-red-400 border-red-400/20",
    medium: "bg-amber-400/10 text-amber-400 border-amber-400/20",
    low: "bg-sky-400/10 text-sky-400 border-sky-400/20",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[priority]}`}
    >
      {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
    </span>
  );
}

/* ---------- Main Component ---------- */

export default function AutomationFinder() {
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const [data, setData] = useState<WizardData>({
    businessName: "",
    industry: "",
    teamSize: "",
    revenueRange: "",
    painPoints: [],
    otherPainPoint: "",
    currentTools: [],
    name: "",
    email: "",
    phone: "",
  });

  const update = useCallback(
    (partial: Partial<WizardData>) => setData((prev) => ({ ...prev, ...partial })),
    []
  );

  const togglePainPoint = useCallback((key: string) => {
    setData((prev) => ({
      ...prev,
      painPoints: prev.painPoints.includes(key)
        ? prev.painPoints.filter((p) => p !== key)
        : [...prev.painPoints, key],
    }));
  }, []);

  const toggleTool = useCallback((tool: string) => {
    setData((prev) => ({
      ...prev,
      currentTools: prev.currentTools.includes(tool)
        ? prev.currentTools.filter((t) => t !== tool)
        : [...prev.currentTools, tool],
    }));
  }, []);

  const validateStep = useCallback((): boolean => {
    setError("");
    switch (step) {
      case 1:
        if (!data.businessName.trim()) {
          setError("Please enter your business name.");
          return false;
        }
        if (!data.industry) {
          setError("Please select your industry.");
          return false;
        }
        if (!data.teamSize) {
          setError("Please select your team size.");
          return false;
        }
        if (!data.revenueRange) {
          setError("Please select your revenue range.");
          return false;
        }
        return true;
      case 2:
        if (data.painPoints.length === 0) {
          setError("Please select at least one pain point.");
          return false;
        }
        return true;
      case 3:
        if (data.currentTools.length === 0) {
          setError("Please select at least one option.");
          return false;
        }
        return true;
      case 4:
        if (!data.name.trim()) {
          setError("Please enter your name.");
          return false;
        }
        if (!data.email.trim() || !isValidEmail(data.email)) {
          setError("Please enter a valid email address.");
          return false;
        }
        return true;
      default:
        return true;
    }
  }, [step, data]);

  const handleNext = useCallback(async () => {
    if (!validateStep()) return;

    if (step === 4) {
      // Submit lead data
      setSubmitting(true);
      try {
        await fetch("/api/automation-finder", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      } catch {
        // Fire-and-forget, don't block results
      }
      setSubmitting(false);

      trackConversionEvent("automation_finder_complete", {
        industry: data.industry,
      });

      setShowResults(true);
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 200);
      return;
    }

    setStep((s) => s + 1);
  }, [step, validateStep, data]);

  const handleBack = useCallback(() => {
    setError("");
    setStep((s) => Math.max(1, s - 1));
  }, []);

  // Computed results
  const recommendations = getRecommendations(data);
  const automationScore = calculateAutomationScore(data);
  const savings = calculateSavings(recommendations, data.teamSize, data.revenueRange);

  const phase1 = recommendations.filter((r) => r.phase === 1);
  const phase2 = recommendations.filter((r) => r.phase === 2);
  const phase3 = recommendations.filter((r) => r.phase === 3);

  /* ---------- Shared input styles ---------- */
  const inputClass =
    "w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all";
  const selectClass =
    "w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none cursor-pointer";
  const checkboxWrapClass =
    "flex items-center gap-3 p-3 rounded-lg bg-background border border-border hover:border-primary/40 transition-all cursor-pointer select-none";

  return (
    <section className="py-20 px-4 bg-secondary/30">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
            <Zap className="w-4 h-4" />
            <span>Free Automation Report</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4">
            Find Your Automation Opportunities
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Answer a few questions about your business and get a personalized
            automation roadmap with estimated time and cost savings.
          </p>
        </div>

        {/* Wizard Form */}
        {!showResults && (
          <div className="bg-card border border-border rounded-xl p-8 max-w-2xl mx-auto">
            <ProgressBar currentStep={step} />

            {/* Step 1: Business Profile */}
            {step === 1 && (
              <div className="space-y-5 animate-fade-in">
                <h3 className="text-xl font-bold font-heading mb-2">
                  Tell us about your business
                </h3>

                <div>
                  <label htmlFor="af-business" className="block text-sm font-medium mb-2">
                    Business Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="af-business"
                    value={data.businessName}
                    onChange={(e) => update({ businessName: e.target.value })}
                    className={inputClass}
                    placeholder="Your Business Name"
                  />
                </div>

                <div>
                  <label htmlFor="af-industry" className="block text-sm font-medium mb-2">
                    Industry <span className="text-red-400">*</span>
                  </label>
                  <select
                    id="af-industry"
                    value={data.industry}
                    onChange={(e) => update({ industry: e.target.value })}
                    className={selectClass}
                  >
                    <option value="">Select your industry</option>
                    {INDUSTRIES.map((ind) => (
                      <option key={ind.label} value={ind.label}>
                        {ind.emoji} {ind.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="af-team" className="block text-sm font-medium mb-2">
                    Team Size <span className="text-red-400">*</span>
                  </label>
                  <select
                    id="af-team"
                    value={data.teamSize}
                    onChange={(e) => update({ teamSize: e.target.value })}
                    className={selectClass}
                  >
                    <option value="">Select team size</option>
                    {TEAM_SIZES.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="af-revenue" className="block text-sm font-medium mb-2">
                    Monthly Revenue Range <span className="text-red-400">*</span>
                  </label>
                  <select
                    id="af-revenue"
                    value={data.revenueRange}
                    onChange={(e) => update({ revenueRange: e.target.value })}
                    className={selectClass}
                  >
                    <option value="">Select revenue range</option>
                    {REVENUE_RANGES.map((range) => (
                      <option key={range} value={range}>
                        {range}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Step 2: Pain Points */}
            {step === 2 && (
              <div className="space-y-5 animate-fade-in">
                <h3 className="text-xl font-bold font-heading mb-2">
                  What takes too much of your time?
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Select all that apply.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PAIN_POINTS.map((pp) => (
                    <label key={pp.key} className={checkboxWrapClass}>
                      <input
                        type="checkbox"
                        checked={data.painPoints.includes(pp.key)}
                        onChange={() => togglePainPoint(pp.key)}
                        className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 bg-background"
                      />
                      <span className="text-sm">{pp.label}</span>
                    </label>
                  ))}
                </div>

                {data.painPoints.includes("other") && (
                  <div className="animate-fade-in">
                    <label
                      htmlFor="af-other-pain"
                      className="block text-sm font-medium mb-2"
                    >
                      Describe your other pain point
                    </label>
                    <input
                      type="text"
                      id="af-other-pain"
                      value={data.otherPainPoint}
                      onChange={(e) => update({ otherPainPoint: e.target.value })}
                      className={inputClass}
                      placeholder="e.g., Coordinating between field and office teams"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Current Tools */}
            {step === 3 && (
              <div className="space-y-5 animate-fade-in">
                <h3 className="text-xl font-bold font-heading mb-2">
                  What tools do you currently use?
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Select all that apply.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {CURRENT_TOOLS.map((tool) => (
                    <label key={tool} className={checkboxWrapClass}>
                      <input
                        type="checkbox"
                        checked={data.currentTools.includes(tool)}
                        onChange={() => toggleTool(tool)}
                        className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 bg-background"
                      />
                      <span className="text-sm">{tool}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Contact Info */}
            {step === 4 && (
              <div className="space-y-5 animate-fade-in">
                <h3 className="text-xl font-bold font-heading mb-2">
                  Where should we send your report?
                </h3>

                <div>
                  <label htmlFor="af-name" className="block text-sm font-medium mb-2">
                    Your Name <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      id="af-name"
                      value={data.name}
                      onChange={(e) => update({ name: e.target.value })}
                      className={`${inputClass} pl-12`}
                      placeholder="John Smith"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="af-email" className="block text-sm font-medium mb-2">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="email"
                      id="af-email"
                      value={data.email}
                      onChange={(e) => update({ email: e.target.value })}
                      className={`${inputClass} pl-12`}
                      placeholder="you@company.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="af-phone" className="block text-sm font-medium mb-2">
                    Phone{" "}
                    <span className="text-muted-foreground font-normal">(optional)</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="tel"
                      id="af-phone"
                      value={data.phone}
                      onChange={(e) => update({ phone: e.target.value })}
                      className={`${inputClass} pl-12`}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="mt-4 p-3 rounded-lg bg-red-400/10 border border-red-400/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 gap-4">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-lg font-semibold hover:bg-secondary transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
              ) : (
                <div />
              )}
              <button
                type="button"
                onClick={handleNext}
                disabled={submitting}
                className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : step === 4 ? (
                  <>
                    <Zap className="w-5 h-5" />
                    Get My Free Automation Report
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Results Dashboard */}
        {showResults && (
          <div ref={resultRef} className="space-y-8 animate-fade-in-up">
            {/* Score + Savings Header */}
            <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-border rounded-2xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                {/* Gauge */}
                <div className="flex justify-center">
                  <AutomationGauge score={automationScore} />
                </div>

                {/* Savings Cards */}
                <div className="space-y-4">
                  <div className="bg-card border border-border rounded-xl p-5 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Clock className="w-5 h-5 text-primary" />
                      <span className="text-sm text-muted-foreground font-medium">
                        Estimated Time Saved
                      </span>
                    </div>
                    <div className="text-4xl font-bold font-heading text-primary">
                      {savings.hoursPerWeek}
                    </div>
                    <div className="text-sm text-muted-foreground">hours / week</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-card border border-border rounded-xl p-5 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <DollarSign className="w-5 h-5 text-emerald-400" />
                      <span className="text-sm text-muted-foreground font-medium">
                        Estimated Cost Savings
                      </span>
                    </div>
                    <div className="text-4xl font-bold font-heading text-emerald-400">
                      ${savings.dollarsPerMonth.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">per month</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground max-w-xl mx-auto">
                  {automationScore >= 70
                    ? `${data.businessName} has significant automation potential. You're spending too many hours on tasks that can be fully automated.`
                    : automationScore >= 40
                      ? `${data.businessName} has solid automation opportunities. Targeted automations could free up your team for higher-value work.`
                      : `${data.businessName} is already fairly streamlined! A few strategic automations could still save meaningful time.`}
                </p>
              </div>
            </div>

            {/* Top Recommendations */}
            <div className="bg-card border border-border rounded-xl p-8">
              <h3 className="text-xl font-bold font-heading mb-6 flex items-center gap-2">
                <Star className="w-5 h-5 text-accent" />
                Top Recommendations
              </h3>
              <div className="space-y-4">
                {recommendations.slice(0, 5).map((rec, i) => {
                  const IconComp = ICON_MAP[rec.icon] || Cog;
                  return (
                    <div
                      key={rec.key}
                      className={`bg-background border border-border rounded-xl p-5 animate-fade-in-up`}
                      style={{ animationDelay: `${i * 100}ms` }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <IconComp className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-3 mb-2">
                            <h4 className="font-bold font-heading text-lg">
                              {rec.title}
                            </h4>
                            <PriorityBadge priority={rec.priority} />
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {rec.description}
                          </p>
                          <div className="flex flex-wrap items-center gap-4 text-sm">
                            <span className="flex items-center gap-1.5 text-primary font-medium">
                              <Clock className="w-4 h-4" />
                              ~{rec.hoursSaved} hrs/week saved
                            </span>
                            <span className="text-muted-foreground">
                              Suggested:{" "}
                              {rec.tools.map((t, idx) => (
                                <span key={t}>
                                  <span className="text-foreground font-medium">{t}</span>
                                  {idx < rec.tools.length - 1 && ", "}
                                </span>
                              ))}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3-Phase Roadmap */}
            <div className="bg-card border border-border rounded-xl p-8">
              <h3 className="text-xl font-bold font-heading mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Your 3-Phase Automation Roadmap
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Phase 1 */}
                <div className="bg-background border border-border rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-emerald-400/10 flex items-center justify-center">
                      <Rocket className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <div className="font-bold font-heading text-sm">Phase 1</div>
                      <div className="text-xs text-muted-foreground">
                        Week 1-2: Quick Wins
                      </div>
                    </div>
                  </div>
                  {phase1.length > 0 ? (
                    <ul className="space-y-2">
                      {phase1.map((r) => (
                        <li
                          key={r.key}
                          className="flex items-center gap-2 text-sm"
                        >
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{r.title}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      No quick wins identified
                    </p>
                  )}
                </div>

                {/* Phase 2 */}
                <div className="bg-background border border-border rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-amber-400/10 flex items-center justify-center">
                      <Settings className="w-4 h-4 text-amber-400" />
                    </div>
                    <div>
                      <div className="font-bold font-heading text-sm">Phase 2</div>
                      <div className="text-xs text-muted-foreground">
                        Month 1-2: Core Automations
                      </div>
                    </div>
                  </div>
                  {phase2.length > 0 ? (
                    <ul className="space-y-2">
                      {phase2.map((r) => (
                        <li
                          key={r.key}
                          className="flex items-center gap-2 text-sm"
                        >
                          <CheckCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>{r.title}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      No core automations identified
                    </p>
                  )}
                </div>

                {/* Phase 3 */}
                <div className="bg-background border border-border rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-sky-400/10 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-sky-400" />
                    </div>
                    <div>
                      <div className="font-bold font-heading text-sm">Phase 3</div>
                      <div className="text-xs text-muted-foreground">
                        Month 3+: Advanced Integrations
                      </div>
                    </div>
                  </div>
                  {phase3.length > 0 ? (
                    <ul className="space-y-2">
                      {phase3.map((r) => (
                        <li
                          key={r.key}
                          className="flex items-center gap-2 text-sm"
                        >
                          <CheckCircle className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                          <span>{r.title}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      No advanced integrations identified
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-primary/10 border-2 border-primary/20 rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-bold font-heading mb-3">
                Want Us to Build These Automations?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                Our team specializes in building custom automation solutions for small
                businesses. Book a free strategy call to discuss your roadmap.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/#contact"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                >
                  Book a Free Strategy Call
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <button
                  onClick={() => {
                    setShowResults(false);
                    setStep(1);
                    setData({
                      businessName: "",
                      industry: "",
                      teamSize: "",
                      revenueRange: "",
                      painPoints: [],
                      otherPainPoint: "",
                      currentTools: [],
                      name: "",
                      email: "",
                      phone: "",
                    });
                    setError("");
                  }}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-border rounded-lg font-semibold hover:bg-secondary transition-all"
                >
                  Start Over
                </button>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Results generated for{" "}
                <span className="text-foreground font-medium">{data.email}</span>
                {" "}&mdash; we&rsquo;ll follow up within 24 hours
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
