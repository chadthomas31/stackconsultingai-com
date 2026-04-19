import { NextRequest, NextResponse } from "next/server";
import { extractAssessment, SAMPLE_BOUTIQUE_HOTEL_TRANSCRIPT } from "@/lib/claude-extract";
import { saveAssessment, markEmailSent } from "@/lib/assessments-db";
import { sendAssessmentEmail, isResendConfigured } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 90;

/**
 * Dev/QA endpoint — runs the full pipeline against the baked-in boutique hotel
 * transcript so we can verify extract + DB + email without needing a real call.
 *
 * Protected by CALL_WEBHOOK_SECRET when set — pass ?secret=... to bypass auth.
 * Use ?email=foo@bar.com to override the sample's email (useful for live tests).
 */
export async function POST(req: NextRequest) {
  return runTest(req);
}

export async function GET(req: NextRequest) {
  return runTest(req);
}

async function runTest(req: NextRequest) {
  const url = new URL(req.url);
  const secret = process.env.CALL_WEBHOOK_SECRET;
  if (secret && url.searchParams.get("secret") !== secret) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized — pass ?secret=..." },
      { status: 401 }
    );
  }
  const overrideEmail = url.searchParams.get("email");

  let assessment;
  try {
    assessment = await extractAssessment({
      transcript: SAMPLE_BOUTIQUE_HOTEL_TRANSCRIPT,
      industryId: "boutique-hotel",
      callerPhoneNumber: "+17605550199",
      callDurationSeconds: 900,
    });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        stage: "extract",
        error: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }

  if (overrideEmail) {
    assessment = { ...assessment, business: { ...assessment.business, email: overrideEmail } };
  }

  const save = await saveAssessment({
    assessment,
    rawTranscript: SAMPLE_BOUTIQUE_HOTEL_TRANSCRIPT,
    modelUsed: assessment.modelUsed,
  });
  if (!save.id) {
    return NextResponse.json(
      { ok: false, stage: "save", error: save.error },
      { status: 500 }
    );
  }

  let emailResult: { id: string | null; error: string | null } = {
    id: null,
    error: null,
  };
  const email = assessment.business.email;
  if (email && isResendConfigured()) {
    emailResult = await sendAssessmentEmail({
      to: email,
      assessmentId: save.id,
      assessment: { ...assessment, id: save.id },
    });
    if (emailResult.id) {
      await markEmailSent(save.id, emailResult.id);
    }
  }

  return NextResponse.json({
    ok: true,
    assessmentId: save.id,
    reportUrl: `/assessment/${save.id}`,
    email: email || null,
    emailed: Boolean(emailResult.id),
    emailError: emailResult.error,
    note: "Open the reportUrl in a browser to see the rendered Gamma-style page.",
  });
}
