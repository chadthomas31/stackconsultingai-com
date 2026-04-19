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
    <section className="relative px-4 md:px-6 pt-8 md:pt-14 pb-10 md:pb-16">
      <div className="max-w-5xl mx-auto">
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
        <div className="md:col-span-2 flex flex-col gap-4">
          <GlanceStat
            valueLabel={`${financialImpact.weeklyHoursReclaimed}+`}
            label="Hours Reclaimed"
            sub="per week through targeted automation"
          />
          <GlanceStat
            valueLabel={`$${financialImpact.monthlyToolCost}`}
            label="Monthly Tool Cost"
            sub="total investment across all four tools"
          />
          <GlanceStat
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
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        <QuadrantCard
          emoji="⚡"
          title="Quick Wins"
          subtitle="High Impact, Low Effort"
          description="Act on these immediately. Maximum return for minimum investment of time and money."
          tone="rose-strong"
          items={quadrants["quick-win"].map((p) => p.area)}
        />
        <QuadrantCard
          emoji="🎁"
          title="Major Projects"
          subtitle="High Impact, High Effort"
          description="Worth pursuing after quick wins are stable. Requires planning and setup time."
          tone="rose-soft"
          items={quadrants["major-project"].map((p) => p.area)}
        />
        <QuadrantCard
          emoji="📋"
          title="Fill-Ins"
          subtitle="Low Impact, Low Effort"
          description="Nice to have when bandwidth allows. Not a priority."
          tone="neutral"
          items={quadrants["fill-in"].map((p) => p.area)}
        />
        <QuadrantCard
          emoji="🚫"
          title="Ignore"
          subtitle="Low Impact, High Effort"
          description="Skip entirely. Not worth the investment at this stage."
          tone="neutral"
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
  return (
    <div>
      <SectionHeader title="Your 4-Day Quick Wins Plan" />
      <p className="text-base md:text-lg text-neutral-700 max-w-3xl mb-10 leading-relaxed">
        Follow this sequence to implement all four tools in one focused week.
        Each day requires 15–120 minutes — no technical expertise needed.
      </p>
      <ol className="space-y-4">
        {plan
          .sort((a, b) => a.day - b.day)
          .map((step) => {
            const tool = getToolById(step.toolId);
            return (
              <li
                key={step.day}
                className="group relative flex gap-5 rounded-[18px] border border-rose-100 bg-rose-50/60 p-6 transition-all hover:bg-rose-50 hover:border-rose-200"
              >
                <div className="flex-shrink-0 w-14 h-14 rounded-[14px] bg-rose-600 text-white font-heading font-black text-2xl flex items-center justify-center shadow-[0_6px_16px_-4px_rgba(220,38,38,0.45)]">
                  {step.day}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-baseline gap-2 mb-2">
                    <span className="text-xs font-bold uppercase tracking-[0.12em] text-rose-700">
                      Day {step.day}
                    </span>
                    {tool && (
                      <span className="text-xs text-neutral-600">
                        · Tool: {tool.name}
                      </span>
                    )}
                    <span className="ml-auto inline-flex items-center gap-1 text-xs text-neutral-600 font-mono">
                      <Clock className="w-3 h-3" />~{step.estimatedMinutes} min
                    </span>
                  </div>
                  <h3 className="font-heading text-lg md:text-xl font-bold text-neutral-900 mb-3">
                    {step.title}
                  </h3>
                  <ul className="space-y-1.5">
                    {step.actionSteps.map((a, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-neutral-700 leading-relaxed"
                      >
                        <CheckCircle2 className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                        <span>{a}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            );
          })}
      </ol>
      <div className="mt-6 rounded-[14px] bg-emerald-50 border border-emerald-200 px-5 py-4 flex items-start gap-3">
        <CheckCircle2 className="w-5 h-5 text-emerald-700 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-emerald-900 leading-relaxed">
          <span className="font-bold">By end of Day 4,</span> all tools are
          live and your first full week of reclaimed time begins automatically.
        </p>
      </div>
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
              className="rounded-[18px] border border-rose-100 bg-rose-50/40 p-6 flex flex-col"
            >
              <div className="w-12 h-12 rounded-[12px] bg-rose-600 text-white flex items-center justify-center mb-5 shadow-[0_6px_16px_-4px_rgba(220,38,38,0.45)]">
                {projectIcon(p.toolId)}
              </div>
              <h3 className="font-heading text-lg font-bold text-neutral-900 mb-3">
                {tool.name}
              </h3>
              <p className="text-sm text-neutral-700 leading-relaxed mb-5 flex-1">
                {p.why}
              </p>
              <div className="pt-4 border-t border-rose-200/60">
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
            Time Savings Breakdown
          </h3>
          <p className="text-sm text-neutral-600 mb-6">
            Hours saved per week per recommended tool.
          </p>
          <div className="space-y-4">
            {rows.map((r) => (
              <div key={r.name}>
                <div className="flex justify-between items-baseline mb-1.5">
                  <span className="text-sm text-neutral-900 font-semibold">
                    {r.name}
                  </span>
                  <span className="text-xs text-neutral-600 font-mono">
                    {r.hours} hrs/wk
                  </span>
                </div>
                <div className="h-3 w-full rounded-full bg-rose-50 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-rose-500 to-rose-600 rounded-full"
                    style={{ width: `${(r.hours / maxHours) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-neutral-500 mt-6 leading-relaxed">
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

function GlanceStat({
  valueLabel,
  label,
  sub,
}: {
  valueLabel: string;
  label: string;
  sub: string;
}) {
  return (
    <div className="rounded-[18px] border border-rose-100 bg-white p-6 text-center flex-1 flex flex-col justify-center">
      <div className="font-heading text-4xl md:text-5xl font-black text-neutral-900 mb-2 tracking-[-0.02em]">
        {valueLabel}
      </div>
      <div className="text-sm font-bold text-neutral-900 mb-1">{label}</div>
      <p className="text-xs text-neutral-600 leading-snug">{sub}</p>
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

function QuadrantCard({
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
  tone: "rose-strong" | "rose-soft" | "neutral";
}) {
  const styles = {
    "rose-strong": "bg-rose-100/80 border-rose-200",
    "rose-soft": "bg-rose-50 border-rose-100",
    neutral: "bg-neutral-50 border-neutral-200",
  }[tone];

  return (
    <div
      className={`rounded-[16px] border p-4 md:p-5 transition-all ${styles}`}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="text-base md:text-lg">{emoji}</span>
        <h3 className="font-heading text-sm md:text-base font-bold text-neutral-900">
          {title}
        </h3>
      </div>
      <p className="text-xs font-semibold text-neutral-700 mb-2">{subtitle}</p>
      <p className="text-xs text-neutral-600 leading-relaxed mb-3">
        {description}
      </p>
      {items.length > 0 && (
        <ul className="space-y-1">
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
    <div className="rounded-[18px] border border-rose-100 bg-white p-6 md:p-7">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-9 h-9 rounded-full bg-rose-600 text-white flex items-center justify-center font-heading font-black text-sm flex-shrink-0 shadow-[0_4px_12px_-2px_rgba(220,38,38,0.45)]">
          {number}
        </div>
        <h3 className="font-heading text-lg md:text-xl font-bold text-neutral-900 pt-1">
          {title}
        </h3>
      </div>
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
