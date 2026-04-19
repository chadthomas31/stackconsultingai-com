import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  Clock,
  DollarSign,
  Hourglass,
  Info,
  Mail,
  MessageSquare,
  Phone,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
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
    <main className="min-h-screen bg-white text-navy-900">
      <ReportHeader assessment={assessment} />
      <ExecutiveSummary assessment={assessment} />
      <ImpactEffortMatrix painPoints={assessment.painPoints} />
      <RecommendedSolutions quickWins={assessment.quickWins} />
      <FourDayPlan plan={assessment.fourDayPlan} />
      <MajorProjects projects={assessment.majorProjects} />
      <FinancialImpact assessment={assessment} />
      <NextSteps assessment={assessment} />
      <ReportFooter />
    </main>
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
    <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-soft via-white to-white">
      <div className="absolute inset-0 -z-10 opacity-[0.04]">
        <GridBackground />
      </div>
      <div className="max-w-5xl mx-auto px-6 py-16 md:py-24">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-white text-navy-900 text-xs font-medium mb-6">
          <Sparkles className="w-3 h-3 text-brand" />
          <span>AI Tools Assessment · Stack Consulting AI</span>
        </div>
        <h1 className="font-heading text-5xl md:text-7xl font-bold tracking-tight leading-[1.02] mb-4">
          {assessment.business.businessName}
        </h1>
        <p className="text-base md:text-lg text-muted-foreground mb-8">
          Prepared for {assessment.business.callerName} · {dateStr}
        </p>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl leading-relaxed">
          A targeted evaluation of your current workflow friction points and the
          AI-powered tools that will eliminate them — returning your most
          valuable resource: <span className="text-navy-900 font-medium">time</span>.
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
    <section className="bg-soft py-16 md:py-20">
      <div className="max-w-5xl mx-auto px-6">
        <SectionHeader kicker="Summary" title="Executive Summary" />
        <div className="grid md:grid-cols-5 gap-6 mb-8">
          <div className="md:col-span-3 bg-navy-900 text-white rounded-md p-8">
            <div className="mb-6">
              <div className="text-xs uppercase tracking-wider text-brand mb-2 font-medium">
                The Pain
              </div>
              <p className="text-base md:text-lg leading-relaxed">
                {executiveSummary.pain}
              </p>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-brand mb-2 font-medium">
                The Outcome
              </div>
              <p className="text-base md:text-lg leading-relaxed">
                {executiveSummary.outcome}
              </p>
            </div>
          </div>
          <div className="md:col-span-2 flex flex-col gap-4">
            <StatCard
              icon={<Hourglass className="w-5 h-5 text-brand" />}
              label="Hours Reclaimed"
              valueLabel={`${financialImpact.weeklyHoursReclaimed}+`}
              sub="per week through targeted automation"
            />
            <StatCard
              icon={<DollarSign className="w-5 h-5 text-brand" />}
              label="Monthly Tool Cost"
              valueLabel={`$${financialImpact.monthlyToolCost}`}
              sub="total investment across all recommended tools"
            />
            <StatCard
              icon={<Zap className="w-5 h-5 text-brand" />}
              label="Quick Wins"
              valueLabel={`${quickWins.length}`}
              sub="high-impact, low-effort solutions"
            />
          </div>
        </div>
        <div className="rounded-md border border-accent/20 bg-accent/5 px-5 py-3 flex items-start gap-3">
          <Info className="w-4 h-4 text-brand mt-0.5 flex-shrink-0" />
          <p className="text-sm text-navy-900">
            <span className="font-medium">Primary focus:</span>{" "}
            {focusLabel[executiveSummary.focus]} — every recommendation is
            chosen to protect your team&rsquo;s time and eliminate repetitive
            manual work.
          </p>
        </div>
      </div>
    </section>
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

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="max-w-5xl mx-auto px-6">
        <SectionHeader kicker="Diagnosis" title="Impact-Effort Matrix" />
        <p className="text-muted-foreground max-w-3xl mb-10">
          Your pain points, placed into four quadrants based on their business
          impact and implementation effort. This report focuses on the{" "}
          <span className="text-navy-900 font-medium">Quick Wins</span> — the
          fixes that deliver the highest return with the least friction.
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          <QuadrantCard
            tone="positive"
            title="Quick Wins"
            subtitle="High Impact · Low Effort"
            description="Act on these immediately. Maximum return for minimum investment of time and money."
            items={quadrants["quick-win"].map((p) => p.area)}
          />
          <QuadrantCard
            tone="neutral"
            title="Major Projects"
            subtitle="High Impact · High Effort"
            description="Worth pursuing after the quick wins are stable. Requires planning, budget, or a dedicated engagement."
            items={quadrants["major-project"].map((p) => p.area)}
          />
          <QuadrantCard
            tone="muted"
            title="Fill-ins"
            subtitle="Low Impact · Low Effort"
            description="Nice to have when bandwidth allows. Not a priority right now."
            items={quadrants["fill-in"].map((p) => p.area)}
          />
          <QuadrantCard
            tone="muted"
            title="Ignore"
            subtitle="Low Impact · High Effort"
            description="Skip entirely. Not worth the investment at this stage."
            items={quadrants.ignore.map((p) => p.area)}
          />
        </div>
      </div>
    </section>
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
    <section className="bg-soft py-16 md:py-20">
      <div className="max-w-5xl mx-auto px-6">
        <SectionHeader kicker="Quick Wins" title="Recommended Solutions" />
        <p className="text-muted-foreground max-w-3xl mb-10">
          {quickWins.length} plug-and-play tools, each matched to a specific
          friction point in your workflow. Together they return{" "}
          <span className="text-navy-900 font-medium">
            {totalHours}+ hours per week
          </span>{" "}
          at a combined cost of just{" "}
          <span className="text-navy-900 font-medium">${totalCost}/month</span>.
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          {quickWins
            .sort((a, b) => a.priority - b.priority)
            .map((qw) => {
              const tool = getToolById(qw.toolId);
              if (!tool) return null;
              return (
                <ToolCard key={qw.toolId} tool={tool} recommendation={qw} />
              );
            })}
        </div>
      </div>
    </section>
  );
}

function FourDayPlan({ plan }: { plan: AssessmentFourDayStep[] }) {
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="max-w-5xl mx-auto px-6">
        <SectionHeader kicker="Plan" title="Your 4-Day Quick Wins Plan" />
        <p className="text-muted-foreground max-w-3xl mb-10">
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
                  className="group relative flex gap-5 rounded-md border border-border bg-white p-6 transition-all hover:border-navy-900 hover:shadow-[0_8px_32px_rgba(0,18,46,0.08)]"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-md bg-brand text-white font-heading font-bold text-xl flex items-center justify-center">
                    {step.day}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-baseline gap-2 mb-2">
                      <span className="text-xs uppercase tracking-wider text-brand font-medium">
                        Day {step.day}
                      </span>
                      {tool && (
                        <span className="text-xs text-muted-foreground">
                          · Tool: {tool.name}
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground ml-auto inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" />~{step.estimatedMinutes} min
                      </span>
                    </div>
                    <h3 className="font-heading text-lg md:text-xl font-semibold text-navy-900 mb-3">
                      {step.title}
                    </h3>
                    <ul className="space-y-1.5">
                      {step.actionSteps.map((a, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <CheckCircle2 className="w-4 h-4 text-brand flex-shrink-0 mt-0.5" />
                          <span>{a}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              );
            })}
        </ol>
        <div className="mt-6 rounded-md border border-accent/20 bg-accent/5 px-5 py-3 flex items-start gap-3">
          <CheckCircle2 className="w-4 h-4 text-brand mt-0.5 flex-shrink-0" />
          <p className="text-sm text-navy-900">
            <span className="font-medium">By end of Day 4,</span> all tools are
            live and your first full week of reclaimed time begins
            automatically.
          </p>
        </div>
      </div>
    </section>
  );
}

function MajorProjects({
  projects,
}: {
  projects: AssessmentMajorProject[];
}) {
  return (
    <section className="bg-soft py-16 md:py-20">
      <div className="max-w-5xl mx-auto px-6">
        <SectionHeader kicker="Roadmap" title="What Comes After Quick Wins" />
        <p className="text-muted-foreground max-w-3xl mb-10">
          Once the four quick wins are stable and your time savings are
          confirmed, these{" "}
          <span className="text-navy-900 font-medium">Major Projects</span>{" "}
          represent the next tier of automation — higher effort, significantly
          higher strategic value.
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          {projects.map((p, i) => {
            const tool = getToolById(p.toolId);
            if (!tool) return null;
            return (
              <div
                key={i}
                className="rounded-md border border-border bg-white p-6 flex flex-col"
              >
                <div className="w-10 h-10 rounded-md bg-navy-900 text-white flex items-center justify-center mb-4">
                  {projectIcon(p.toolId)}
                </div>
                <h3 className="font-heading text-lg font-semibold text-navy-900 mb-2">
                  {tool.name}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">
                  {p.why}
                </p>
                <div className="pt-4 border-t border-border">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">
                    Estimated cost
                  </span>
                  <div className="text-sm font-medium text-navy-900 mt-1">
                    {p.estimatedSetupCost}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FinancialImpact({ assessment }: { assessment: Assessment }) {
  const { financialImpact, quickWins } = assessment;
  // Build per-tool savings for the bar chart
  const rows = quickWins
    .map((qw) => {
      const tool = getToolById(qw.toolId);
      return tool
        ? {
            name: tool.name,
            hours: tool.weeklyHoursSaved,
          }
        : null;
    })
    .filter((r): r is { name: string; hours: number } => r !== null);
  const maxHours = Math.max(...rows.map((r) => r.hours), 1);

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="max-w-5xl mx-auto px-6">
        <SectionHeader kicker="ROI" title="Financial Impact" />
        <div className="grid md:grid-cols-5 gap-6">
          <div className="md:col-span-2 bg-navy-900 text-white rounded-md p-8 flex flex-col gap-6">
            <BigStat
              label="Weekly Time Returned"
              value={`${financialImpact.weeklyHoursReclaimed} hrs`}
              sub="across all recommended tools"
            />
            <BigStat
              label="Monthly Net ROI"
              value={`$${financialImpact.monthlyNetRoi.toLocaleString()}`}
              sub={`based on an effective $${financialImpact.hourlyRateAssumed}/hr rate`}
            />
            <BigStat
              label="Monthly Tool Cost"
              value={`$${financialImpact.monthlyToolCost}`}
              sub="total investment across all tools"
            />
          </div>
          <div className="md:col-span-3 bg-white border border-border rounded-md p-8">
            <h3 className="font-heading text-xl font-semibold text-navy-900 mb-1">
              Time Savings Breakdown by Tool
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Hours saved per week per recommended tool.
            </p>
            <div className="space-y-3">
              {rows.map((r) => (
                <div key={r.name}>
                  <div className="flex justify-between items-baseline mb-1.5">
                    <span className="text-sm text-navy-900 font-medium">
                      {r.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {r.hours} hrs/wk
                    </span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-soft overflow-hidden">
                    <div
                      className="h-full bg-brand rounded-full"
                      style={{ width: `${(r.hours / maxHours) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-6 leading-relaxed">
              The single highest-leverage tool is prioritized first in your
              4-Day Plan. ROI is calculated using an effective hourly rate of
              ${financialImpact.hourlyRateAssumed} — adjust up or down to match
              your team&rsquo;s fully-loaded cost.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function NextSteps({ assessment }: { assessment: Assessment }) {
  return (
    <section className="bg-soft py-16 md:py-20">
      <div className="max-w-5xl mx-auto px-6">
        <SectionHeader kicker="Action" title="Your Next Steps" />
        <div className="grid md:grid-cols-2 gap-4 mb-6">
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

        <div className="rounded-md bg-navy-900 text-white p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h3 className="font-heading text-2xl md:text-3xl font-semibold mb-2">
              Ready to move forward?
            </h3>
            <p className="text-white/80 leading-relaxed max-w-2xl">
              Book your review call below and lock in your implementation
              momentum. {assessment.business.callerName
                ? `Talk to you soon, ${assessment.business.callerName.split(" ")[0]}.`
                : ""}
            </p>
          </div>
          <Link
            href="https://stackconsultingai.com/#contact"
            className="inline-flex items-center gap-2 rounded-md bg-brand hover:bg-brand-hover px-6 py-3 text-white font-medium transition-colors whitespace-nowrap"
          >
            Schedule Review Call
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function ReportFooter() {
  return (
    <footer className="border-t border-border bg-white py-10">
      <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-brand" />
          <span>
            Assessment generated by{" "}
            <Link
              href="https://stackconsultingai.com"
              className="text-navy-900 font-medium hover:text-brand"
            >
              Stack Consulting AI
            </Link>
          </span>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <Link href="https://stackconsultingai.com/#assessment" className="hover:text-navy-900">
            Get your own assessment
          </Link>
          <Link href="https://stackconsultingai.com/privacy" className="hover:text-navy-900">
            Privacy
          </Link>
          <Link href="https://stackconsultingai.com/terms" className="hover:text-navy-900">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}

/* ============================================================
   Small building blocks
   ============================================================ */

function SectionHeader({
  kicker,
  title,
}: {
  kicker: string;
  title: string;
}) {
  return (
    <div className="mb-3">
      <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-brand font-medium">
        <span className="w-6 h-px bg-brand" />
        {kicker}
      </span>
      <h2 className="mt-3 font-heading text-3xl md:text-5xl font-bold text-navy-900 tracking-tight">
        {title}
      </h2>
    </div>
  );
}

function StatCard({
  icon,
  label,
  valueLabel,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  valueLabel: string;
  sub: string;
}) {
  return (
    <div className="rounded-md border border-border bg-white p-5">
      <div className="flex items-center gap-2 mb-2 text-xs uppercase tracking-wider text-muted-foreground font-medium">
        {icon}
        <span>{label}</span>
      </div>
      <div className="font-heading text-3xl md:text-4xl font-bold text-navy-900 mb-1">
        {valueLabel}
      </div>
      <p className="text-xs text-muted-foreground leading-snug">{sub}</p>
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
      <div className="text-xs uppercase tracking-wider text-brand font-medium mb-2">
        {label}
      </div>
      <div className="font-heading text-4xl md:text-5xl font-bold mb-2">
        {value}
      </div>
      <p className="text-sm text-white/70 leading-snug">{sub}</p>
    </div>
  );
}

function QuadrantCard({
  tone,
  title,
  subtitle,
  description,
  items,
}: {
  tone: "positive" | "neutral" | "muted";
  title: string;
  subtitle: string;
  description: string;
  items: string[];
}) {
  const styles = {
    positive: {
      wrapper:
        "border-accent/30 bg-accent/5 hover:bg-accent/10 hover:border-accent/50",
      badge: "bg-brand text-white",
    },
    neutral: {
      wrapper: "border-navy-900/20 bg-navy-900/5 hover:border-navy-900/40",
      badge: "bg-navy-900 text-white",
    },
    muted: {
      wrapper: "border-border bg-white hover:border-navy-900/20",
      badge: "bg-soft text-navy-900 border border-border",
    },
  }[tone];
  return (
    <div
      className={`rounded-md border p-6 transition-all ${styles.wrapper}`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h3 className="font-heading text-lg font-semibold text-navy-900">
            {title}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
        </div>
        <span
          className={`text-xs px-2 py-1 rounded-md font-medium ${styles.badge}`}
        >
          {items.length}
        </span>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
        {description}
      </p>
      {items.length === 0 ? (
        <p className="text-xs text-muted-foreground italic">
          Nothing identified in this quadrant.
        </p>
      ) : (
        <ul className="space-y-1.5">
          {items.map((item, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-sm text-navy-900"
            >
              <Target className="w-3.5 h-3.5 text-brand mt-0.5 flex-shrink-0" />
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
    <div className="rounded-md border border-border bg-white p-6 hover:border-navy-900 hover:shadow-[0_8px_32px_rgba(0,18,46,0.08)] transition-all flex flex-col">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-brand/10 text-brand flex items-center justify-center font-heading font-bold">
            {recommendation.priority}
          </div>
          <div>
            <h3 className="font-heading text-lg font-semibold text-navy-900">
              {tool.name}
            </h3>
            <p className="text-xs text-muted-foreground">{tool.tagline}</p>
          </div>
        </div>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">
        {recommendation.whyThisToolForYou}
      </p>
      <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border">
        <MetaStat label="Cost" value={tool.costLabel} />
        <MetaStat label="Setup" value={`${tool.setupMinutes} min`} />
        <MetaStat label="Saves" value={`${tool.weeklyHoursSaved} hrs/wk`} />
      </div>
      <Link
        href={tool.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center gap-1 text-xs text-brand hover:text-brand-hover font-medium"
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
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
        {label}
      </div>
      <div className="text-xs text-navy-900 font-medium mt-0.5">{value}</div>
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
    <div className="rounded-md border border-border bg-white p-6">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center font-heading font-bold text-sm">
          {number}
        </div>
        <h3 className="font-heading text-lg font-semibold text-navy-900 pt-0.5">
          {title}
        </h3>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
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
  // Subtle SVG grid — no AI imagery, no orbs
  return (
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern
          id="grid"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 40 0 L 0 0 0 40"
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
