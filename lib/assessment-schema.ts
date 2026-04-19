/**
 * AI Tools Assessment — the structured output Claude produces from a
 * transcript, and the shape the /assessment/[uuid] report page renders.
 *
 * Mirror this schema in the Claude system prompt so extraction is
 * deterministic. See /lib/claude-extract.ts.
 */

import type { Tier } from "./tool-catalog";

export interface AssessmentBusinessProfile {
  callerName: string;
  businessName: string;
  /** Matches an id in INDUSTRY_SCRIPTS */
  industryId: string;
  industryLabel: string;
  yearsInBusiness: number | null;
  teamSize: number | null;
  email: string | null;
}

export interface AssessmentPainPoint {
  /** Matches a question id from the interview (e.g. "auto.after_hours") */
  sourceQuestionId: string;
  /** Human-readable area label ("After-hours calls") */
  area: string;
  /** What the caller said, summarized in one sentence */
  currentState: string;
  /** Estimated hours per week this costs — caller-stated or inferred */
  estimatedHoursPerWeek: number;
  /** 1-5, where 5 = mentioned multiple times with emotion */
  impactScore: 1 | 2 | 3 | 4 | 5;
  /** 1-5, where 5 = requires big process change */
  effortScore: 1 | 2 | 3 | 4 | 5;
  /** Which quadrant of the matrix this lands in */
  quadrant: Tier;
}

export interface AssessmentToolRecommendation {
  /** Matches a tool id in /lib/tool-catalog.ts */
  toolId: string;
  /** Which pain points this tool addresses (refs AssessmentPainPoint) */
  solvesPainAreas: string[];
  /** Why THIS tool for THIS caller — tailored copy from Claude */
  whyThisToolForYou: string;
  /** Ordered position in the Quick Wins list (1-based) */
  priority: number;
}

export interface AssessmentFourDayStep {
  day: 1 | 2 | 3 | 4;
  toolId: string;
  title: string;
  actionSteps: string[];
  estimatedMinutes: number;
}

export interface AssessmentFinancialImpact {
  weeklyHoursReclaimed: number;
  monthlyToolCost: number;
  /** Optional — uses assumed $150/hr effective if not provided by caller */
  hourlyRateAssumed: number;
  monthlyValueReclaimed: number;
  monthlyNetRoi: number;
}

export interface AssessmentMajorProject {
  toolId: string;
  why: string;
  estimatedSetupCost: string;
}

export interface Assessment {
  /** UUID — primary key, used as /assessment/[uuid] slug */
  id: string;
  createdAt: string;

  business: AssessmentBusinessProfile;

  /** One-paragraph exec summary — pain + outcome */
  executiveSummary: {
    pain: string;
    outcome: string;
    focus: "efficiency" | "revenue" | "cost" | "quality";
  };

  painPoints: AssessmentPainPoint[];

  /** 4 top Quick Wins — prioritized, tailored */
  quickWins: AssessmentToolRecommendation[];

  /** Day-by-day implementation plan */
  fourDayPlan: AssessmentFourDayStep[];

  financialImpact: AssessmentFinancialImpact;

  /** After Quick Wins land, upsell candidates */
  majorProjects: AssessmentMajorProject[];

  /** Raw data for debugging / agents iterating on extraction */
  rawTranscript?: string;

  /** Metadata */
  callDurationSeconds?: number;
  callerPhoneNumber?: string;
  modelUsed?: string;
}
