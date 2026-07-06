import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { extractAssessment } from "@/lib/claude-extract";
import { saveAssessment, markEmailSent } from "@/lib/assessments-db";
import { sendAssessmentEmail, isResendConfigured } from "@/lib/email";
import {
  findRecentLeadByMobile,
  findRecentLeadByMobileAndDid,
} from "@/lib/demo-leads-db";
import { handleDemoCallEnded } from "@/lib/handle-demo-call";
import { normalizeToE164 } from "@/lib/sms";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Claude extraction + DB + email can legitimately take 30-60s.
export const maxDuration = 90;

interface CallEndedPayload {
  uuid?: string;
  industryId?: string;
  transcript?: string;
  recordingUrl?: string;
  callerPhoneNumber?: string;
  durationSeconds?: number;
  vertical?: string;
  didDialed?: string;
}

/** Verify FreeSWITCH HMAC — returns true if signature matches or no secret configured. */
function verifySignature(rawBody: string, signatureHeader: string | null) {
  const secret = process.env.CALL_WEBHOOK_SECRET;
  if (!secret) {
    // Dev mode: allow unsigned requests so local testing works.
    return true;
  }
  if (!signatureHeader) return false;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");
  const provided = signatureHeader.replace(/^sha256=/, "").trim();
  if (!/^[a-f0-9]{64}$/i.test(provided)) return false;
  if (expected.length !== provided.length) return false;
  return crypto.timingSafeEqual(
    Buffer.from(expected, "hex"),
    Buffer.from(provided, "hex")
  );
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-signature");
  if (!verifySignature(rawBody, signature)) {
    return NextResponse.json(
      { ok: false, error: "Invalid signature" },
      { status: 401 }
    );
  }

  let payload: CallEndedPayload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON" },
      { status: 400 }
    );
  }

  const transcript = payload.transcript?.trim();
  const industryId = payload.industryId || "other";
  if (!transcript) {
    return NextResponse.json(
      { ok: false, error: "Missing transcript" },
      { status: 400 }
    );
  }

  // ===== Demo branch =====
  // If the caller matches a recently-verified demo lead, route to the
  // vertical-demo summarizer + report email and skip the generic assessment path.
  if (payload.callerPhoneNumber) {
    const mobileE164 = normalizeToE164(payload.callerPhoneNumber);
    if (mobileE164) {
      const lead = payload.didDialed
        ? await findRecentLeadByMobileAndDid(mobileE164, payload.didDialed)
        : await findRecentLeadByMobile(mobileE164);
      // If the payload names a vertical, the matched lead must agree — else this is
      // a cross-vertical mismatch; skip the demo branch rather than mis-attribute.
      if (lead && payload.vertical && lead.vertical !== payload.vertical) {
        console.warn("[call-ended] vertical mismatch, skipping demo attribution");
      } else if (lead) {
        try {
          const result = await handleDemoCallEnded({
            lead,
            transcript,
            durationSeconds: payload.durationSeconds,
            callUuid: payload.uuid,
          });
          if (result.ok) {
            return NextResponse.json({
              ok: true,
              path: "demo",
              vertical: lead.vertical,
              leadId: lead.id,
              emailed: result.emailed,
            });
          }
          return NextResponse.json(
            { ok: false, path: "demo", error: result.error },
            { status: 500 }
          );
        } catch (err) {
          console.error("[call-ended] demo branch failed:", err);
          return NextResponse.json(
            {
              ok: false,
              path: "demo",
              error: err instanceof Error ? err.message : String(err),
            },
            { status: 500 }
          );
        }
      }
    }
  }
  // ===== /Demo branch =====

  // 1. Extract structured assessment via Claude
  let assessment;
  try {
    assessment = await extractAssessment({
      transcript,
      industryId,
      callerPhoneNumber: payload.callerPhoneNumber,
      callDurationSeconds: payload.durationSeconds,
    });
  } catch (err) {
    console.error("[call-ended] extractAssessment failed:", err);
    return NextResponse.json(
      {
        ok: false,
        stage: "extract",
        error: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }

  // 2. Persist to Supabase (authoritative id is the DB row's id)
  const save = await saveAssessment({
    assessment,
    rawTranscript: transcript,
    modelUsed: assessment.modelUsed,
  });
  if (!save.id) {
    console.error("[call-ended] saveAssessment failed:", save.error);
    return NextResponse.json(
      { ok: false, stage: "save", error: save.error },
      { status: 500 }
    );
  }

  // 3. Email the caller if we have an address + Resend configured
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
    } else if (emailResult.error) {
      console.error("[call-ended] email failed:", emailResult.error);
    }
  }

  return NextResponse.json({
    ok: true,
    assessmentId: save.id,
    reportUrl: `/assessment/${save.id}`,
    emailed: Boolean(emailResult.id),
    emailError: emailResult.error,
  });
}
