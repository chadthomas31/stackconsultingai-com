import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Mail,
  MessageSquare,
  Phone,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import type {
  Assessment,
  AssessmentFourDayStep,
  AssessmentMajorProject,
  AssessmentPainPoint,
  AssessmentToolRecommendation,
} from "@/lib/assessment-schema";
import { getToolById, type Tool } from "@/lib/tool-catalog";
import { DEMO_ASSESSMENT } from "@/lib/demo-assessment";
import { getAssessmentById } from "@/lib/assessments-db";

/* ============================================================
   Data access — demo slug serves the baked sample; real UUIDs
   are fetched from Supabase (populated by /api/call-ended).
   ============================================================ */
async function loadAssessment(uuid: string): Promise<Assessment | null> {
  if (uuid === "demo") return DEMO_ASSESSMENT;
  return getAssessmentById(uuid);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ uuid: string }>;
}): Promise<Metadata> {
  const { uuid } = await params;
  const assessment = await loadAssessment(uuid);
  if (!assessment) return { title: "Assessment not found" };
  return {
    title: `${assessment.business.businessName} — AI Tools Assessment`,
    description: assessment.executiveSummary.pain,
    robots: "noindex",
  };
}

export default async function AssessmentPage({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = await params;
  const assessment = await loadAssessment(uuid);
  if (!assessment) notFound();

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-rose-50 via-orange-100 to-rose-200">
      {/* Subtle tech-grid overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
      >
        <GridBackground />
      </div>

      {/* Top strip — minimal branding */}
      <TopStrip />

      <main className="relative">
        <ReportHeader assessment={assessment} />

        <SectionCard>
          <ExecutiveSummary assessment={assessment} />
        </SectionCard>

        <SectionCard>
          <ImpactEffortMatrix painPoints={assessment.painPoints} />
        </SectionCard>

        <SectionCard>
          <RecommendedSolutions quickWins={assessment.quickWins} />
        </SectionCard>

        <SectionCard>
          <FourDayPlan plan={assessment.fourDayPlan} />
        </SectionCard>

        <SectionCard>
          <MajorProjects projects={assessment.majorProjects} />
        </SectionCard>

        <SectionCard>
          <FinancialImpact assessment={assessment} />
        </SectionCard>

        <SectionCard>
          <NextSteps assessment={assessment} />
        </SectionCard>

        <ReportFooter />
      </main>
    </div>
  );
}

/* ============================================================
   Layout primitives — the Gamma "card on gradient" pattern
   ============================================================ */

function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <section className="relative px-4 md:px-6 pb-8 md:pb-12">
      <div className="max-w-5xl mx-auto bg-white rounded-[24px] shadow-[0_20px_60px_-24px_rgba(220,38,38,0.22)] border border-white/60 overflow-hidden">
        <div className="p-8 md:p-14">{children}</div>
      </div>
    </section>
  );
}

function TopStrip() {
  return (
    <div className="relative max-w-5xl mx-auto px-6 pt-4 pb-2 flex items-center justify-between text-xs md:text-sm">
      <div className="flex items-center gap-2 text-rose-700 font-semibold tracking-[0.14em] uppercase">
        <span className="w-5 h-5 rounded-md bg-rose-600 text-white inline-flex items-center justify-center text-[10px] font-bold">
          SC
        </span>
        AI Tools Assessment
      </div>
      <Link
        href="https://stackconsultingai.com"
        className="text-rose-700/70 hover:text-rose-800 transition-colors"
      >
        stackconsultingai.com
      </Link>
    </div>
  );
}

/* ============================================================
   Sections
   ============================================================ */

function ReportHeader({ assessment }: { assessment: Assessment }) {
  const dateStr = new Date(assessment.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  return (
    <section className="relative px-4 md:px-6 pt-8 md:pt-14 pb-12 md:pb-20 overflow-hidden">
      {/* Abstract tech/analytics backdrop — echo of Gamma hero illustration */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none opacity-60">
        <HeroBackdrop />
      </div>

      <div className="relative max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full bg-rose-600 text-white text-xs font-semibold tracking-[0.15em] uppercase px-4 py-2 mb-8 shadow-[0_6px_20px_-6px_rgba(220,38,38,0.5)]">
          <Sparkles className="w-3.5 h-3.5" />
          Personalized Report
        </div>
        <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-black tracking-[-0.02em] leading-[0.95] text-neutral-900 mb-6">
          {assessment.business.businessName}
        </h1>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm md:text-base text-neutral-700 mb-8 font-medium">
          <span>
            Prepared for{" "}
            <span className="text-neutral-900 font-semibold">
              {assessment.business.callerName}
            </span>
          </span>
          <span className="text-rose-600">·</span>
          <span>{dateStr}</span>
          {assessment.business.industryLabel && (
            <>
              <span className="text-rose-600">·</span>
              <span>{assessment.business.industryLabel}</span>
            </>
          )}
        </div>
        <p className="text-lg md:text-2xl text-neutral-800 leading-relaxed max-w-3xl font-light">
          A targeted evaluation of your current workflow friction points and the
          AI-powered tools that will eliminate them — returning your most
          valuable resource:{" "}
          <span className="text-rose-600 font-semibold">time</span>.
        </p>
      </div>
    </section>
  );
}

function ExecutiveSummary({ assessment }: { assessment: Assessment }) {
  const { executiveSummary, financialImpact, quickWins } = assessment;
  const focusLabel: Record<typeof executiveSummary.focus, string> = {
    efficiency: "Efficiency (Time Savings)",
    revenue: "Revenue Growth",
    cost: "Cost Reduction",
    quality: "Quality & Consistency",
  };
  return (
    <div>
      <SectionHeader title="Executive Summary" />
      <div className="grid md:grid-cols-5 gap-6">
        <div className="md:col-span-3 rounded-[20px] bg-rose-600 text-white p-8 md:p-10 shadow-[0_10px_30px_-10px_rgba(220,38,38,0.5)]">
          <div className="mb-7">
            <div className="text-xs font-bold tracking-[0.16em] uppercase text-white/90 mb-3">
              The Pain
            </div>
            <p className="text-base md:text-lg leading-relaxed text-white">
              {executiveSummary.pain}
            </p>
          </div>
          <div className="h-px bg-white/20 mb-7" />
          <div>
            <div className="text-xs font-bold tracking-[0.16em] uppercase text-white/90 mb-3">
              The Outcome
            </div>
            <p className="text-base md:text-lg leading-relaxed text-white">
              {executiveSummary.outcome}
            </p>
          </div>
        </div>
        <div className="md:col-span-2 flex flex-col gap-8 py-2">
          <div className="text-center md:text-left">
            <div className="text-xs font-semibold text-neutral-600 mb-1">
              The Opportunity at a Glance
            </div>
          </div>
          <StackStat
            valueLabel={`${financialImpact.weeklyHoursReclaimed}+`}
            label="Hours Reclaimed"
            sub="per week through targeted automation"
          />
          <StackStat
            valueLabel={`$${financialImpact.monthlyToolCost}`}
            label="Monthly Tool Cost"
            sub="total investment across all four tools"
          />
          <StackStat
            valueLabel={`${quickWins.length}`}
            label="Quick Wins"
            sub="high-impact, low-effort solutions"
          />
        </div>
      </div>
      <div className="mt-6 rounded-[14px] bg-emerald-50 border border-emerald-200 px-5 py-4 flex items-start gap-3">
        <CheckCircle2 className="w-5 h-5 text-emerald-700 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-emerald-900 leading-relaxed">
          <span className="font-bold">
            Primary focus: {focusLabel[executiveSummary.focus]}
          </span>{" "}
          — every recommendation is chosen to protect your strategic focus time
          and eliminate repetitive manual work.
        </p>
      </div>
    </div>
  );
}

function ImpactEffortMatrix({
  painPoints,
}: {
  painPoints: AssessmentPainPoint[];
}) {
  const quadrants: Record<
    "quick-win" | "major-project" | "fill-in" | "ignore",
    AssessmentPainPoint[]
  > = {
    "quick-win": [],
    "major-project": [],
    "fill-in": [],
    ignore: [],
  };
  for (const p of painPoints) quadrants[p.quadrant].push(p);
  const quickWinItems = quadrants["quick-win"].map((p) => p.area);

  return (
    <div>
      <SectionHeader title="Impact-Effort Matrix" />
      <p className="text-base md:text-lg text-neutral-700 max-w-3xl mb-10 leading-relaxed">
        Your pain points have been analyzed and placed into four quadrants
        based on their business impact and implementation effort. This report
        focuses on the{" "}
        <span className="text-rose-600 font-semibold">Quick Wins</span> — the
        fixes that deliver the highest value with the least effort.
      </p>

      {/* 2D Axis visualization — Gamma-style chart */}
      <div className="relative mx-auto max-w-xl aspect-square mb-10 px-2">
        {/* Y-axis (Impact) */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-neutral-300" />
        <div className="absolute left-1/2 -translate-x-1/2 top-0 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] border-b-neutral-400" />
        <div className="absolute -top-1 left-1/2 translate-x-3 text-[10px] font-bold tracking-[0.12em] uppercase text-neutral-500">
          High Impact
        </div>
        <div className="absolute bottom-1 left-1/2 translate-x-3 text-[10px] font-bold tracking-[0.12em] uppercase text-neutral-500">
          Low Impact
        </div>

        {/* X-axis (Effort) */}
        <div className="absolute top-1/2 left-0 right-0 h-px bg-neutral-300" />
        <div className="absolute top-1/2 -translate-y-1/2 right-0 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[10px] border-l-neutral-400" />
        <div className="absolute top-1/2 -translate-y-6 left-0 text-[10px] font-bold tracking-[0.12em] uppercase text-neutral-500">
          Low Effort
        </div>
        <div className="absolute top-1/2 -translate-y-6 right-4 text-[10px] font-bold tracking-[0.12em] uppercase text-neutral-500">
          High Effort
        </div>

        {/* Quadrant icons — positioned in each quadrant */}
        <QuadrantIcon
          top="18%"
          left="25%"
          emoji="⚡"
          label="Quick Wins"
          count={quadrants["quick-win"].length}
          highlight
        />
        <QuadrantIcon
          top="18%"
          left="75%"
          emoji="🎁"
          label="Major Projects"
          count={quadrants["major-project"].length}
        />
        <QuadrantIcon
          top="78%"
          left="25%"
          emoji="📋"
          label="Fill-Ins"
          count={quadrants["fill-in"].length}
        />
        <QuadrantIcon
          top="78%"
          left="75%"
          emoji="🚫"
          label="Ignore"
          count={quadrants.ignore.length}
        />
      </div>

      {/* 2x2 legend grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 rounded-[16px] overflow-hidden border border-rose-100">
        <QuadrantLegendRow
          emoji="⚡"
          title="Quick Wins"
          subtitle="High Impact, Low Effort"
          description="Act on these immediately. Maximum return for minimum investment of time and money."
          tone="rose-strong"
          items={quadrants["quick-win"].map((p) => p.area)}
        />
        <QuadrantLegendRow
          emoji="🎁"
          title="Major Projects"
          subtitle="High Impact, High Effort"
          description="Worth pursuing after quick wins are stable. Requires planning and setup time."
          tone="rose-strong"
          items={quadrants["major-project"].map((p) => p.area)}
        />
        <QuadrantLegendRow
          emoji="📋"
          title="Fill-Ins"
          subtitle="Low Impact, Low Effort"
          description="Nice to have when bandwidth allows. Not a priority."
          tone="rose-soft"
          items={quadrants["fill-in"].map((p) => p.area)}
        />
        <QuadrantLegendRow
          emoji="🚫"
          title="Ignore"
          subtitle="Low Impact, High Effort"
          description="Skip entirely. Not worth the investment at this stage."
          tone="rose-soft"
          items={quadrants.ignore.map((p) => p.area)}
        />
      </div>

      {quickWinItems.length > 0 && (
        <div className="mt-5 rounded-[12px] bg-sky-50 border border-sky-200 px-5 py-3 flex items-start gap-3">
          <div className="w-5 h-5 rounded-full bg-sky-500 text-white inline-flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">
            i
          </div>
          <p className="text-sm text-sky-900 leading-relaxed">
            <span className="font-bold">Quick Wins Identified:</span>{" "}
            {quickWinItems.join(" · ")}
          </p>
        </div>
      )}
    </div>
  );
}

function RecommendedSolutions({
  quickWins,
}: {
  quickWins: AssessmentToolRecommendation[];
}) {
  const totalCost = quickWins.reduce((sum, q) => {
    const tool = getToolById(q.toolId);
    return sum + (tool?.monthlyCost ?? 0);
  }, 0);
  const totalHours = quickWins.reduce((sum, q) => {
    const tool = getToolById(q.toolId);
    return sum + (tool?.weeklyHoursSaved ?? 0);
  }, 0);

  return (
    <div>
      <SectionHeader title="Recommended Solutions" />
      <p className="text-base md:text-lg text-neutral-700 max-w-3xl mb-10 leading-relaxed">
        {quickWins.length} plug-and-play tools, each matched to a specific
        friction point in your workflow. Together they return{" "}
        <span className="text-rose-600 font-bold">
          {totalHours}+ hours per week
        </span>{" "}
        at a combined cost of just{" "}
        <span className="text-rose-600 font-bold">${totalCost}/month</span>.
      </p>
      <div className="grid sm:grid-cols-2 gap-5">
        {quickWins
          .sort((a, b) => a.priority - b.priority)
          .map((qw) => {
            const tool = getToolById(qw.toolId);
            if (!tool) return null;
            return <ToolCard key={qw.toolId} tool={tool} recommendation={qw} />;
          })}
      </div>
    </div>
  );
}

function FourDayPlan({ plan }: { plan: AssessmentFourDayStep[] }) {
  const sorted = [...plan].sort((a, b) => a.day - b.day);
  return (
    <div>
      <SectionHeader title="Your 4-Day Quick Wins Plan" />
      <p className="text-base md:text-lg text-neutral-700 max-w-3xl mb-12 leading-relaxed">
        Follow this sequence to implement all four tools in one focused week.
        Each day requires 15–120 minutes — no technical expertise needed.
      </p>

      {/* Zig-zag timeline — desktop */}
      <div className="hidden md:block relative">
        {/* Central connector line */}
        <div className="absolute left-1/2 top-6 bottom-6 w-px bg-rose-200" />
        {sorted.map((step, idx) => {
          const tool = getToolById(step.toolId);
          const isLeft = idx % 2 === 0;
          return (
            <div
              key={step.day}
              className="relative grid grid-cols-[1fr_auto_1fr] gap-8 mb-10 last:mb-0 items-start"
            >
              <div className={isLeft ? "text-right pr-4" : "order-3 pl-4"}>
                {isLeft && (
                  <FourDayStepContent step={step} tool={tool} align="right" />
                )}
              </div>
              <div className="col-start-2 relative flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-rose-600 text-white font-heading font-black text-xl flex items-center justify-center shadow-[0_8px_24px_-6px_rgba(220,38,38,0.55)] ring-4 ring-white z-10">
                  {step.day}
                </div>
              </div>
              <div className={isLeft ? "order-3 pl-4" : "text-right pr-4"}>
                {!isLeft && (
                  <FourDayStepContent step={step} tool={tool} align="left" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile — stacked */}
      <ol className="md:hidden space-y-4">
        {sorted.map((step) => {
          const tool = getToolById(step.toolId);
          return (
            <li
              key={step.day}
              className="relative flex gap-4 rounded-[18px] border border-rose-100 bg-rose-50/60 p-5"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-rose-600 text-white font-heading font-black text-xl flex items-center justify-center shadow-[0_6px_16px_-4px_rgba(220,38,38,0.45)]">
                {step.day}
              </div>
              <div className="flex-1 min-w-0">
                <FourDayStepContent step={step} tool={tool} align="left" compact />
              </div>
            </li>
          );
        })}
      </ol>

      <div className="mt-10 rounded-[14px] bg-emerald-50 border border-emerald-200 px-5 py-4 flex items-start gap-3">
        <CheckCircle2 className="w-5 h-5 text-emerald-700 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-emerald-900 leading-relaxed">
          <span className="font-bold">By end of Day 4,</span> all tools are
          live and your first full week of reclaimed time begins automatically.
        </p>
      </div>
    </div>
  );
}

function FourDayStepContent({
  step,
  tool,
  align,
  compact,
}: {
  step: AssessmentFourDayStep;
  tool: Tool | undefined;
  align: "left" | "right";
  compact?: boolean;
}) {
  return (
    <div className={align === "right" ? "md:text-right" : "md:text-left"}>
      <div
        className={`flex flex-wrap items-baseline gap-2 mb-2 ${
          align === "right" ? "md:justify-end" : "md:justify-start"
        }`}
      >
        <span className="text-xs font-bold uppercase tracking-[0.12em] text-rose-700">
          Day {step.day}
        </span>
        {tool && (
          <span className="text-xs text-neutral-600">· Tool: {tool.name}</span>
        )}
        {compact && (
          <span className="ml-auto inline-flex items-center gap-1 text-xs text-neutral-600 font-mono">
            <Clock className="w-3 h-3" />~{step.estimatedMinutes} min
          </span>
        )}
      </div>
      <h3 className="font-heading text-lg md:text-xl font-bold text-neutral-900 mb-2">
        {step.title}
      </h3>
      {!compact && (
        <p className="text-xs text-neutral-500 mb-3 inline-flex items-center gap-1">
          <Clock className="w-3 h-3" />~{step.estimatedMinutes} minutes
        </p>
      )}
      <ul
        className={`space-y-1.5 ${
          align === "right"
            ? "md:ml-auto md:max-w-sm"
            : "md:mr-auto md:max-w-sm"
        }`}
      >
        {step.actionSteps.map((a, i) => (
          <li
            key={i}
            className={`flex items-start gap-2 text-sm text-neutral-700 leading-relaxed ${
              align === "right" ? "md:flex-row-reverse md:text-right" : ""
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <span>{a}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MajorProjects({
  projects,
}: {
  projects: AssessmentMajorProject[];
}) {
  return (
    <div>
      <SectionHeader title="What Comes After Quick Wins" />
      <p className="text-base md:text-lg text-neutral-700 max-w-3xl mb-10 leading-relaxed">
        Once the four quick wins are stable and your time savings are
        confirmed, these{" "}
        <span className="text-rose-600 font-bold">Major Projects</span>{" "}
        represent the next tier of automation — higher effort, significantly
        higher strategic value.
      </p>
      <div className="grid md:grid-cols-3 gap-5">
        {projects.map((p, i) => {
          const tool = getToolById(p.toolId);
          if (!tool) return null;
          return (
            <div
              key={i}
              className="relative rounded-[18px] border border-rose-100 bg-white pt-8 p-6 flex flex-col"
            >
              {/* Gamma-style red underline bar on top */}
              <div className="absolute top-0 left-6 right-6 h-1 rounded-b-full bg-gradient-to-r from-rose-400 to-rose-200" />
              <div className="w-11 h-11 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mb-4 ring-2 ring-white">
                {projectIcon(p.toolId)}
              </div>
              <h3 className="font-heading text-lg font-bold text-neutral-900 mb-3">
                {tool.name}
              </h3>
              <p className="text-sm text-neutral-700 leading-relaxed mb-5 flex-1">
                {p.why}
              </p>
              <div className="pt-4 border-t border-rose-100">
                <span className="text-[10px] uppercase tracking-[0.12em] font-bold text-neutral-500">
                  Estimated cost
                </span>
                <div className="text-sm font-bold text-rose-700 mt-1">
                  {p.estimatedSetupCost}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FinancialImpact({ assessment }: { assessment: Assessment }) {
  const { financialImpact, quickWins } = assessment;
  const rows = quickWins
    .map((qw) => {
      const tool = getToolById(qw.toolId);
      return tool
        ? { name: tool.name, hours: tool.weeklyHoursSaved }
        : null;
    })
    .filter((r): r is { name: string; hours: number } => r !== null);
  const maxHours = Math.max(...rows.map((r) => r.hours), 1);

  return (
    <div>
      <SectionHeader title="Financial Impact" />
      <div className="grid md:grid-cols-5 gap-6">
        <div className="md:col-span-2 bg-rose-600 text-white rounded-[20px] p-8 md:p-10 flex flex-col gap-6 shadow-[0_10px_30px_-10px_rgba(220,38,38,0.5)]">
          <BigStat
            label="Weekly Time Returned"
            value={`${financialImpact.weeklyHoursReclaimed} hrs`}
            sub="across all recommended tools"
          />
          <div className="h-px bg-white/20" />
          <BigStat
            label="Monthly Net ROI"
            value={`$${financialImpact.monthlyNetRoi.toLocaleString()}`}
            sub={`at an effective $${financialImpact.hourlyRateAssumed}/hr rate`}
          />
          <div className="h-px bg-white/20" />
          <BigStat
            label="Monthly Tool Cost"
            value={`$${financialImpact.monthlyToolCost}`}
            sub="total investment across all tools"
          />
        </div>
        <div className="md:col-span-3 bg-white border border-rose-100 rounded-[20px] p-8 md:p-10">
          <h3 className="font-heading text-xl md:text-2xl font-bold text-neutral-900 mb-1">
            Time Savings Breakdown by Tool
          </h3>
          <p className="text-sm text-neutral-600 mb-8">
            Hours saved per week per recommended tool.
          </p>

          {/* Chart — Gamma style with labeled Y-axis and x-axis ticks */}
          <div className="relative pl-24">
            <div className="space-y-3">
              {rows.map((r) => {
                const pct = (r.hours / maxHours) * 100;
                return (
                  <div key={r.name} className="relative flex items-center gap-0">
                    {/* Y-axis label (tool name) */}
                    <span className="absolute -left-24 top-1/2 -translate-y-1/2 text-xs text-neutral-900 font-semibold w-[90px] truncate text-right pr-2">
                      {r.name}
                    </span>
                    {/* Bar */}
                    <div className="flex-1 relative h-7 bg-rose-50 rounded-sm overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-rose-700 to-rose-600 flex items-center justify-end pr-2"
                        style={{ width: `${pct}%` }}
                      >
                        <span className="text-xs font-bold text-white">
                          {r.hours}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {/* X-axis */}
            <div className="mt-2 flex justify-between text-[10px] text-neutral-500 font-mono border-t border-neutral-200 pt-1">
              <span>0</span>
              <span>{Math.round(maxHours / 2)}</span>
              <span>{maxHours}</span>
            </div>
            <div className="text-center text-[10px] uppercase tracking-[0.12em] font-bold text-neutral-500 mt-1">
              Hours Saved / Week
            </div>
          </div>

          <p className="text-xs text-neutral-500 mt-8 leading-relaxed">
            The highest-leverage tool is prioritized first in your 4-Day Plan.
            ROI is calculated using an effective hourly rate of $
            {financialImpact.hourlyRateAssumed}.
          </p>
        </div>
      </div>
    </div>
  );
}

function NextSteps({ assessment }: { assessment: Assessment }) {
  const firstName = assessment.business.callerName?.split(" ")[0];
  return (
    <div>
      <SectionHeader title="Your Next Steps" />
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <NextStepCard
          number={1}
          title="Implement the Quick Wins"
          body="Follow the 4-Day Plan exactly as outlined. Each step is designed to be completed independently — no technical support required. Reclaim your time before scaling further."
        />
        <NextStepCard
          number={2}
          title="Book a 30-minute Review Call"
          body="After your first week with all tools live, we'll review results, validate wins, and decide together if deeper automation — a custom voice agent, a consolidated CRM — is warranted."
        />
      </div>

      <div className="rounded-[20px] bg-gradient-to-br from-rose-600 to-rose-700 text-white p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-[0_12px_32px_-8px_rgba(220,38,38,0.45)]">
        <div>
          <h3 className="font-heading text-2xl md:text-3xl font-bold mb-2 leading-tight">
            Ready to move forward?
          </h3>
          <p className="text-white/90 leading-relaxed max-w-2xl">
            Book your review call and lock in your implementation momentum.
            {firstName ? ` Talk to you soon, ${firstName}.` : ""}
          </p>
        </div>
        <Link
          href="https://stackconsultingai.com/#contact"
          className="inline-flex items-center gap-2 rounded-[12px] bg-white text-rose-700 hover:bg-rose-50 px-6 py-3.5 font-bold transition-colors whitespace-nowrap shadow-[0_6px_20px_-6px_rgba(0,0,0,0.25)]"
        >
          Schedule Review Call
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

function ReportFooter() {
  return (
    <footer className="relative pt-4 pb-12 px-6">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
        <div className="flex items-center gap-2 text-rose-800/80">
          <ShieldCheck className="w-4 h-4 text-rose-600" />
          <span>
            Assessment generated by{" "}
            <Link
              href="https://stackconsultingai.com"
              className="text-neutral-900 font-bold hover:text-rose-700"
            >
              Stack Consulting AI
            </Link>
          </span>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-rose-800/70">
          <Link
            href="https://stackconsultingai.com/#assessment"
            className="hover:text-neutral-900"
          >
            Get your own assessment
          </Link>
          <Link
            href="https://stackconsultingai.com/privacy"
            className="hover:text-neutral-900"
          >
            Privacy
          </Link>
          <Link
            href="https://stackconsultingai.com/terms"
            className="hover:text-neutral-900"
          >
            Terms
          </Link>
        </div>
      </div>
      <div className="max-w-5xl mx-auto flex justify-center md:justify-end mt-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-neutral-900 text-white text-xs font-medium px-4 py-2 shadow-[0_6px_20px_-6px_rgba(0,0,0,0.35)]">
          <span className="text-white/60">Made with</span>
          <span className="font-bold tracking-wide">STACK</span>
        </div>
      </div>
    </footer>
  );
}

/* ============================================================
   Small building blocks
   ============================================================ */

function SectionHeader({ title }: { title: string }) {
  return (
    <h2 className="font-heading text-3xl md:text-5xl font-black tracking-[-0.02em] text-neutral-900 mb-3">
      {title}
    </h2>
  );
}

function StackStat({
  valueLabel,
  label,
  sub,
}: {
  valueLabel: string;
  label: string;
  sub: string;
}) {
  return (
    <div className="text-center">
      <div className="font-heading text-5xl md:text-6xl font-black text-neutral-900 mb-1 tracking-[-0.02em] leading-none">
        {valueLabel}
      </div>
      <div className="text-sm font-bold text-neutral-900">{label}</div>
      <p className="text-xs text-neutral-600 leading-snug mt-1 max-w-[220px] mx-auto">
        {sub}
      </p>
    </div>
  );
}

function BigStat({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div>
      <div className="text-xs font-bold tracking-[0.14em] uppercase text-white/90 mb-2">
        {label}
      </div>
      <div className="font-heading text-4xl md:text-5xl font-black mb-2 tracking-[-0.02em]">
        {value}
      </div>
      <p className="text-sm text-white/80 leading-snug">{sub}</p>
    </div>
  );
}

function QuadrantIcon({
  top,
  left,
  emoji,
  label,
  count,
  highlight,
}: {
  top: string;
  left: string;
  emoji: string;
  label: string;
  count: number;
  highlight?: boolean;
}) {
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1"
      style={{ top, left }}
    >
      <div
        className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center text-xl md:text-2xl shadow-[0_6px_18px_-6px_rgba(220,38,38,0.35)] ${
          highlight
            ? "bg-rose-600 ring-4 ring-rose-200"
            : "bg-white border border-rose-100"
        }`}
      >
        {emoji}
      </div>
      <div
        className={`text-[10px] md:text-xs font-bold tracking-tight text-center whitespace-nowrap ${
          highlight ? "text-rose-700" : "text-neutral-700"
        }`}
      >
        {label}
        {count > 0 && (
          <span className="ml-1 text-neutral-500 font-normal">({count})</span>
        )}
      </div>
    </div>
  );
}

function QuadrantLegendRow({
  emoji,
  title,
  subtitle,
  description,
  items,
  tone,
}: {
  emoji: string;
  title: string;
  subtitle: string;
  description: string;
  items: string[];
  tone: "rose-strong" | "rose-soft";
}) {
  const bg =
    tone === "rose-strong" ? "bg-rose-50" : "bg-white";

  return (
    <div className={`${bg} p-5 border-t border-rose-100 first:border-t-0 md:[&:nth-child(2)]:border-t-0 md:[&:nth-child(-n+2)]:border-t-0`}>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg">{emoji}</span>
        <h3 className="font-heading text-sm md:text-base font-bold text-neutral-900">
          {title}
        </h3>
      </div>
      <p className="text-xs font-semibold text-rose-700 mb-2">{subtitle}</p>
      <p className="text-xs text-neutral-700 leading-relaxed mb-2">
        {description}
      </p>
      {items.length > 0 && (
        <ul className="space-y-0.5 mt-2">
          {items.map((item, i) => (
            <li
              key={i}
              className="flex items-start gap-1.5 text-xs text-neutral-900 font-medium"
            >
              <span className="text-rose-500 flex-shrink-0 mt-0.5">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ToolCard({
  tool,
  recommendation,
}: {
  tool: Tool;
  recommendation: AssessmentToolRecommendation;
}) {
  return (
    <div className="rounded-[18px] border border-rose-100 bg-white p-6 md:p-7 hover:border-rose-300 hover:shadow-[0_10px_30px_-10px_rgba(220,38,38,0.25)] transition-all flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-[10px] bg-rose-600 text-white flex items-center justify-center font-heading font-black shadow-[0_4px_12px_-2px_rgba(220,38,38,0.45)]">
          {recommendation.priority}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-heading text-lg font-bold text-neutral-900 leading-tight truncate">
            {tool.name}
          </h3>
          <p className="text-xs text-neutral-600 italic truncate">
            {tool.tagline}
          </p>
        </div>
      </div>
      <p className="text-sm text-neutral-700 leading-relaxed mb-5 flex-1">
        {recommendation.whyThisToolForYou}
      </p>
      <div className="grid grid-cols-3 gap-3 pt-4 border-t border-rose-100">
        <MetaStat label="Cost" value={tool.costLabel} />
        <MetaStat label="Setup" value={`${tool.setupMinutes} min`} />
        <MetaStat label="Saves" value={`${tool.weeklyHoursSaved} hrs/wk`} />
      </div>
      <Link
        href={tool.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-bold"
      >
        Visit {tool.name}
        <ArrowRight className="w-3 h-3" />
      </Link>
    </div>
  );
}

function MetaStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.1em] text-neutral-500 font-bold">
        {label}
      </div>
      <div className="text-xs text-neutral-900 font-semibold mt-0.5">
        {value}
      </div>
    </div>
  );
}

function NextStepCard({
  number,
  title,
  body,
}: {
  number: number;
  title: string;
  body: string;
}) {
  return (
    <div className="relative rounded-[18px] border border-rose-100 bg-white p-6 md:p-7 pt-10">
      {/* Red numbered badge centered on top edge */}
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-rose-600 text-white flex items-center justify-center font-heading font-black text-sm shadow-[0_4px_12px_-2px_rgba(220,38,38,0.5)] ring-4 ring-white">
        {number}
      </div>
      {/* Red underline bar decoration */}
      <div className="absolute top-0 left-6 right-6 h-1 rounded-b-full bg-gradient-to-r from-rose-500 via-rose-400 to-rose-500" />
      <h3 className="font-heading text-lg md:text-xl font-bold text-neutral-900 mb-3 text-center md:text-left">
        {title}
      </h3>
      <p className="text-sm text-neutral-700 leading-relaxed">{body}</p>
    </div>
  );
}

function projectIcon(toolId: string) {
  const map: Record<string, React.ReactNode> = {
    "freeswitch-ai-ivr": <Phone className="w-5 h-5" />,
    "speed-to-lead-chatbot": <MessageSquare className="w-5 h-5" />,
    "zapier-make-automation": <TrendingUp className="w-5 h-5" />,
    "custom-gpt": <Sparkles className="w-5 h-5" />,
    gohighlevel: <CalendarCheck className="w-5 h-5" />,
    "twenty-crm": <CalendarCheck className="w-5 h-5" />,
    pipedrive: <CalendarCheck className="w-5 h-5" />,
  };
  return map[toolId] ?? <Mail className="w-5 h-5" />;
}

function GridBackground() {
  return (
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern
          id="grid"
          width="48"
          height="48"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 48 0 L 0 0 0 48"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  );
}

/**
 * Abstract "tech/analytics" backdrop for the hero — light rose-tinted
 * SVG pattern of chart widgets, gauges, and data points. No AI imagery,
 * just geometric graphics that echo the Gamma laptop-with-dashboards mood.
 */
function HeroBackdrop() {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 1200 600"
    >
      <defs>
        <radialGradient id="heroGlow" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#fda4af" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#fda4af" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1200" height="600" fill="url(#heroGlow)" />
      {/* Scattered chart tiles — rose-300 outlines at low opacity */}
      <g stroke="#e11d48" strokeOpacity="0.12" strokeWidth="1.2" fill="none">
        {/* Left cluster */}
        <rect x="60" y="70" width="120" height="70" rx="6" />
        <path d="M70 120 L90 95 L110 108 L140 82 L170 100" />
        <circle cx="95" cy="200" r="32" />
        <path d="M95 168 A 32 32 0 0 1 123 216" strokeOpacity="0.25" />
        {/* Top bars */}
        <g transform="translate(220,60)">
          <rect x="0" y="0" width="180" height="6" rx="3" fill="#fecaca" fillOpacity="0.5" stroke="none" />
          <rect x="0" y="14" width="140" height="6" rx="3" fill="#fecaca" fillOpacity="0.35" stroke="none" />
          <rect x="0" y="28" width="90" height="6" rx="3" fill="#fecaca" fillOpacity="0.25" stroke="none" />
        </g>
        {/* Center laptop outline */}
        <g transform="translate(470,190)">
          <rect x="0" y="0" width="260" height="160" rx="10" />
          <line x1="-20" y1="170" x2="280" y2="170" />
          <rect x="20" y="20" width="220" height="120" rx="4" strokeOpacity="0.08" />
          {/* little bars inside */}
          <g strokeOpacity="0.18" fill="#e11d48" fillOpacity="0.08">
            <rect x="40" y="115" width="20" height="20" />
            <rect x="70" y="95" width="20" height="40" />
            <rect x="100" y="75" width="20" height="60" />
            <rect x="130" y="60" width="20" height="75" />
            <rect x="160" y="45" width="20" height="90" />
            <rect x="190" y="55" width="20" height="80" />
          </g>
        </g>
        {/* Right cluster */}
        <rect x="870" y="80" width="140" height="90" rx="6" />
        <path d="M870 140 Q 900 100 940 130 T 1010 120" />
        <circle cx="950" cy="240" r="28" />
        <text
          x="940"
          y="246"
          fontSize="14"
          fill="#e11d48"
          fillOpacity="0.18"
          fontFamily="monospace"
        >
          78%
        </text>
        <g transform="translate(850,330)">
          <rect x="0" y="0" width="180" height="6" rx="3" fill="#fecaca" fillOpacity="0.5" stroke="none" />
          <rect x="0" y="14" width="140" height="6" rx="3" fill="#fecaca" fillOpacity="0.35" stroke="none" />
          <rect x="0" y="28" width="90" height="6" rx="3" fill="#fecaca" fillOpacity="0.25" stroke="none" />
        </g>
        {/* Scatter dots */}
        <g fill="#e11d48" fillOpacity="0.22" stroke="none">
          <circle cx="40" cy="400" r="2" />
          <circle cx="200" cy="420" r="2" />
          <circle cx="320" cy="480" r="2" />
          <circle cx="440" cy="440" r="2" />
          <circle cx="780" cy="470" r="2" />
          <circle cx="1080" cy="420" r="2" />
          <circle cx="1100" cy="300" r="2" />
        </g>
      </g>
    </svg>
  );
}
