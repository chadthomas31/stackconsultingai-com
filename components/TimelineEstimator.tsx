"use client";

import { useState, useMemo } from "react";
import {
  Calendar,
  Clock,
  CheckCircle,
  Layers,
  ArrowRight,
  Mail,
  Lightbulb,
  Flag,
  BarChart3,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface EstimatorInputs {
  projectType: string;
  pages: string;
  designComplexity: string;
  features: string[];
  contentReadiness: string;
  email: string;
}

interface PhaseEstimate {
  name: string;
  days: number;
  color: string;
  bgColor: string;
  borderColor: string;
}

interface Milestone {
  label: string;
  date: Date;
  phase: string;
}

/* ------------------------------------------------------------------ */
/*  Option data                                                        */
/* ------------------------------------------------------------------ */

const projectTypes = [
  { value: "landing-page", label: "Landing Page" },
  { value: "new-website", label: "New Website" },
  { value: "redesign", label: "Redesign" },
  { value: "ecommerce", label: "E-commerce Store" },
  { value: "web-app", label: "Web Application" },
];

const pageOptions = [
  { value: "1-3", label: "1-3 Pages" },
  { value: "4-7", label: "4-7 Pages" },
  { value: "8-15", label: "8-15 Pages" },
  { value: "16+", label: "16+ Pages" },
];

const designOptions = [
  { value: "template", label: "Template-based" },
  { value: "custom", label: "Custom Design" },
  { value: "premium", label: "Premium / Animated" },
];

const featureOptions = [
  { value: "contact-form", label: "Contact Form" },
  { value: "blog-cms", label: "Blog / CMS" },
  { value: "ecommerce", label: "E-commerce" },
  { value: "user-auth", label: "User Auth" },
  { value: "api-integrations", label: "API Integrations" },
  { value: "analytics", label: "Analytics" },
  { value: "seo", label: "SEO Optimization" },
  { value: "chat-ai", label: "Chat / AI Widget" },
];

const contentOptions = [
  { value: "ready", label: "Content Ready" },
  { value: "copywriting", label: "Need Copywriting" },
  { value: "media", label: "Need Photos / Media" },
  { value: "scratch", label: "Starting from Scratch" },
];

/* ------------------------------------------------------------------ */
/*  Phase colors                                                       */
/* ------------------------------------------------------------------ */

const PHASE_STYLES: Record<
  string,
  { color: string; bgColor: string; borderColor: string }
> = {
  discovery: {
    color: "text-blue-400",
    bgColor: "bg-blue-500/20",
    borderColor: "border-blue-500/40",
  },
  design: {
    color: "text-purple-400",
    bgColor: "bg-purple-500/20",
    borderColor: "border-purple-500/40",
  },
  development: {
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/20",
    borderColor: "border-emerald-500/40",
  },
  testing: {
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/20",
    borderColor: "border-yellow-500/40",
  },
  launch: {
    color: "text-green-400",
    bgColor: "bg-green-500/20",
    borderColor: "border-green-500/40",
  },
};

const BAR_COLORS: Record<string, string> = {
  discovery: "bg-blue-500",
  design: "bg-purple-500",
  development: "bg-emerald-500",
  testing: "bg-yellow-500",
  launch: "bg-green-500",
};

/* ------------------------------------------------------------------ */
/*  Calculation helpers                                                */
/* ------------------------------------------------------------------ */

function calculatePhases(inputs: EstimatorInputs): PhaseEstimate[] {
  /* ---------- base days by project type ---------- */
  let discovery = 2;
  let design = 3;
  let development = 5;
  let testing = 2;
  let launch = 1;

  switch (inputs.projectType) {
    case "landing-page":
      discovery = 1;
      design = 2;
      development = 3;
      testing = 1;
      launch = 1;
      break;
    case "new-website":
      discovery = 3;
      design = 5;
      development = 8;
      testing = 3;
      launch = 2;
      break;
    case "redesign":
      discovery = 3;
      design = 5;
      development = 7;
      testing = 3;
      launch = 2;
      break;
    case "ecommerce":
      discovery = 4;
      design = 7;
      development = 14;
      testing = 5;
      launch = 3;
      break;
    case "web-app":
      discovery = 5;
      design = 8;
      development = 25;
      testing = 8;
      launch = 4;
      break;
  }

  /* ---------- page count multiplier ---------- */
  let pageMult = 1.0;
  switch (inputs.pages) {
    case "1-3":
      pageMult = 0.8;
      break;
    case "4-7":
      pageMult = 1.0;
      break;
    case "8-15":
      pageMult = 1.35;
      break;
    case "16+":
      pageMult = 1.7;
      break;
  }

  /* ---------- design complexity ---------- */
  let designMult = 1.0;
  switch (inputs.designComplexity) {
    case "template":
      designMult = 0.6;
      break;
    case "custom":
      designMult = 1.0;
      break;
    case "premium":
      designMult = 1.4;
      break;
  }

  /* ---------- features add-on days ---------- */
  const featureDays: Record<string, number> = {
    "contact-form": 0.5,
    "blog-cms": 2,
    ecommerce: 5,
    "user-auth": 3,
    "api-integrations": 3,
    analytics: 1,
    seo: 1,
    "chat-ai": 3,
  };
  const extraDevDays = inputs.features.reduce(
    (sum, f) => sum + (featureDays[f] ?? 0),
    0
  );
  const extraTestDays = Math.ceil(extraDevDays * 0.25);

  /* ---------- content readiness ---------- */
  let contentAdd = 0;
  switch (inputs.contentReadiness) {
    case "ready":
      contentAdd = 0;
      break;
    case "copywriting":
      contentAdd = 3;
      break;
    case "media":
      contentAdd = 4;
      break;
    case "scratch":
      contentAdd = 7;
      break;
  }

  /* ---------- assemble ---------- */
  discovery = Math.round(discovery * pageMult);
  design = Math.round(design * pageMult * designMult) + Math.round(contentAdd * 0.5);
  development =
    Math.round(development * pageMult * designMult) + Math.round(extraDevDays);
  testing = Math.round(testing * pageMult) + extraTestDays;
  launch = Math.round(launch);

  /* ensure minimums */
  discovery = Math.max(discovery, 1);
  design = Math.max(design, 1);
  development = Math.max(development, 2);
  testing = Math.max(testing, 1);
  launch = Math.max(launch, 1);

  /* add remaining content days to discovery */
  discovery += Math.round(contentAdd * 0.5);

  return [
    {
      name: "Discovery & Planning",
      days: discovery,
      ...PHASE_STYLES.discovery,
    },
    { name: "Design", days: design, ...PHASE_STYLES.design },
    { name: "Development", days: development, ...PHASE_STYLES.development },
    { name: "Testing & QA", days: testing, ...PHASE_STYLES.testing },
    {
      name: "Launch & Optimization",
      days: launch,
      ...PHASE_STYLES.launch,
    },
  ];
}

function buildMilestones(phases: PhaseEstimate[]): Milestone[] {
  const today = new Date();
  const milestones: Milestone[] = [];
  let cumulativeDays = 0;

  const milestoneLabels = [
    "Project kick-off",
    "Design concepts approved",
    "Development complete",
    "QA sign-off",
    "Go live!",
  ];

  phases.forEach((phase, idx) => {
    cumulativeDays += phase.days;
    const date = new Date(today);
    date.setDate(date.getDate() + cumulativeDays);
    milestones.push({
      label: milestoneLabels[idx],
      date,
      phase: phase.name,
    });
  });

  return milestones;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDuration(totalDays: number): string {
  if (totalDays <= 10) return `${totalDays} business days (~${Math.ceil(totalDays / 5)} week${Math.ceil(totalDays / 5) === 1 ? "" : "s"})`;
  const weeks = Math.round(totalDays / 5);
  return `${totalDays} business days (~${weeks} week${weeks === 1 ? "" : "s"})`;
}

/* ------------------------------------------------------------------ */
/*  Tips                                                               */
/* ------------------------------------------------------------------ */

const tips = [
  "Have content (copy, images, brand assets) ready before the design phase to avoid delays.",
  "Provide timely feedback -- aim for 24-48 hour turnaround on review rounds.",
  "Limit scope creep by locking requirements after the Discovery phase.",
  "Designate a single point of contact on your team for faster decisions.",
  "Plan user testing early so feedback can be addressed during development.",
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function TimelineEstimator() {
  const [inputs, setInputs] = useState<EstimatorInputs>({
    projectType: "",
    pages: "",
    designComplexity: "",
    features: [],
    contentReadiness: "",
    email: "",
  });

  const [showResults, setShowResults] = useState(false);

  const handleFeatureToggle = (value: string) => {
    setInputs((prev) => ({
      ...prev,
      features: prev.features.includes(value)
        ? prev.features.filter((f) => f !== value)
        : [...prev.features, value],
    }));
  };

  const canEstimate =
    inputs.projectType &&
    inputs.pages &&
    inputs.designComplexity &&
    inputs.contentReadiness;

  const handleEstimate = () => {
    if (!canEstimate) {
      alert("Please complete all required selections before estimating.");
      return;
    }
    setShowResults(true);
  };

  /* computed results */
  const phases = useMemo(
    () => (showResults ? calculatePhases(inputs) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [showResults, inputs.projectType, inputs.pages, inputs.designComplexity, inputs.features, inputs.contentReadiness]
  );

  const totalDays = useMemo(() => phases.reduce((s, p) => s + p.days, 0), [phases]);
  const maxPhaseDays = useMemo(() => Math.max(...phases.map((p) => p.days), 1), [phases]);
  const milestones = useMemo(() => buildMilestones(phases), [phases]);

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */

  return (
    <section className="py-20 px-4 bg-secondary/30">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
            <Calendar className="w-4 h-4" />
            <span>Timeline Estimator</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Estimate Your Project Timeline
          </h2>
          <p className="text-xl text-muted-foreground">
            See a realistic phase-by-phase schedule for your web project.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            Answer a few questions and get an instant timeline breakdown -- no signup required.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-card border border-border rounded-xl p-8">
          <div className="space-y-8">
            {/* 1. Project Type */}
            <div>
              <label className="block text-sm font-medium mb-3">
                Project Type *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {projectTypes.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() =>
                      setInputs((prev) => ({ ...prev, projectType: t.value }))
                    }
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      inputs.projectType === t.value
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Number of Pages */}
            <div>
              <label className="block text-sm font-medium mb-3">
                Number of Pages *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {pageOptions.map((o) => (
                  <button
                    key={o.value}
                    type="button"
                    onClick={() =>
                      setInputs((prev) => ({ ...prev, pages: o.value }))
                    }
                    className={`p-4 rounded-lg border-2 transition-all ${
                      inputs.pages === o.value
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="font-semibold">{o.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Design Complexity */}
            <div>
              <label className="block text-sm font-medium mb-3">
                Design Complexity *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {designOptions.map((o) => (
                  <button
                    key={o.value}
                    type="button"
                    onClick={() =>
                      setInputs((prev) => ({
                        ...prev,
                        designComplexity: o.value,
                      }))
                    }
                    className={`p-4 rounded-lg border-2 transition-all ${
                      inputs.designComplexity === o.value
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Features (multi-select) */}
            <div>
              <label className="block text-sm font-medium mb-3">
                Features Needed (select all that apply)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {featureOptions.map((f) => (
                  <button
                    key={f.value}
                    type="button"
                    onClick={() => handleFeatureToggle(f.value)}
                    className={`p-4 rounded-lg border-2 transition-all text-left flex items-start gap-3 ${
                      inputs.features.includes(f.value)
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 ${
                        inputs.features.includes(f.value)
                          ? "border-primary bg-primary"
                          : "border-border"
                      }`}
                    >
                      {inputs.features.includes(f.value) && (
                        <CheckCircle className="w-4 h-4 text-primary-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{f.label}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 5. Content Readiness */}
            <div>
              <label className="block text-sm font-medium mb-3">
                Content Readiness *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {contentOptions.map((o) => (
                  <button
                    key={o.value}
                    type="button"
                    onClick={() =>
                      setInputs((prev) => ({
                        ...prev,
                        contentReadiness: o.value,
                      }))
                    }
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      inputs.contentReadiness === o.value
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Estimate Button */}
            <button
              onClick={handleEstimate}
              disabled={!canEstimate}
              className={`w-full px-8 py-4 rounded-lg font-semibold text-lg transition-all flex items-center justify-center gap-2 ${
                canEstimate
                  ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              }`}
            >
              <Clock className="w-5 h-5" />
              Estimate My Timeline
            </button>
          </div>

          {/* ------------------- RESULTS ------------------- */}
          {showResults && phases.length > 0 && (
            <div className="mt-10 space-y-10 animate-fadeIn">
              {/* Total Duration */}
              <div className="text-center p-8 rounded-xl bg-primary/10 border-2 border-primary/20">
                <div className="text-sm font-medium text-primary mb-1">
                  Estimated Total Duration
                </div>
                <div className="text-5xl md:text-6xl font-bold mb-2">
                  {formatDuration(totalDays)}
                </div>
                <p className="text-muted-foreground text-sm">
                  Based on your selections. Actual timelines may vary depending on
                  feedback speed and scope changes.
                </p>
              </div>

              {/* Phase Timeline Bars */}
              <div>
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-primary" />
                  Phase Breakdown
                </h3>
                <div className="space-y-4">
                  {phases.map((phase, idx) => {
                    const pct = Math.max((phase.days / maxPhaseDays) * 100, 12);
                    const phaseKey = Object.keys(PHASE_STYLES)[idx];
                    return (
                      <div key={phase.name}>
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-sm font-medium ${phase.color}`}>
                            {phase.name}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {phase.days} day{phase.days !== 1 ? "s" : ""}
                            {phase.days >= 5 &&
                              ` (~${Math.round(phase.days / 5)} wk${Math.round(phase.days / 5) === 1 ? "" : "s"})`}
                          </span>
                        </div>
                        <div className="w-full h-7 rounded-md bg-secondary/60 overflow-hidden">
                          <div
                            className={`h-full rounded-md ${BAR_COLORS[phaseKey]} transition-all duration-700 ease-out`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Key Milestones */}
              <div>
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Flag className="w-5 h-5 text-primary" />
                  Key Milestones
                </h3>
                <div className="relative pl-6 border-l-2 border-border space-y-6">
                  {milestones.map((m, idx) => {
                    const phaseKey = Object.keys(PHASE_STYLES)[idx];
                    const style = PHASE_STYLES[phaseKey];
                    return (
                      <div key={m.label} className="relative">
                        <div
                          className={`absolute -left-[calc(0.75rem+1px)] top-1 w-5 h-5 rounded-full border-2 ${style.bgColor} ${style.borderColor} flex items-center justify-center`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full ${BAR_COLORS[phaseKey]}`}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="font-semibold">{m.label}</div>
                          <div className="text-sm text-muted-foreground">
                            {formatDate(m.date)} &middot; End of {m.phase}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Tips */}
              <div>
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-primary" />
                  Tips for Keeping Your Project on Track
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {tips.map((tip) => (
                    <div
                      key={tip}
                      className="flex items-start gap-3 p-4 rounded-lg bg-secondary/40 border border-border"
                    >
                      <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Email Capture + CTA */}
              <div className="p-8 rounded-xl bg-card border-2 border-primary/20">
                <div className="text-center mb-6">
                  <BarChart3 className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="text-2xl font-bold mb-2">
                    Want a Detailed Project Plan?
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Enter your email and we will send you a custom project plan with
                    accurate milestones, cost estimates, and next steps.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                  <div className="flex-1 relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="email"
                      value={inputs.email}
                      onChange={(e) =>
                        setInputs((prev) => ({ ...prev, email: e.target.value }))
                      }
                      className="w-full pl-12 pr-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      placeholder="you@example.com"
                    />
                  </div>
                  <a
                    href={`mailto:info@stackconsultingai.com?subject=Project%20Timeline%20Request&body=Hi%2C%20I%20used%20the%20timeline%20estimator%20and%20would%20like%20a%20detailed%20plan.%0A%0AProject%20type%3A%20${encodeURIComponent(inputs.projectType)}%0APages%3A%20${encodeURIComponent(inputs.pages)}%0ADesign%3A%20${encodeURIComponent(inputs.designComplexity)}%0AFeatures%3A%20${encodeURIComponent(inputs.features.join(", "))}%0AContent%3A%20${encodeURIComponent(inputs.contentReadiness)}%0AEstimated%20duration%3A%20${totalDays}%20days`}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 whitespace-nowrap"
                  >
                    Get Detailed Plan
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Trust Signals */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            Free to use &middot; No signup required &middot; Response within 24 hours
          </p>
        </div>
      </div>
    </section>
  );
}
