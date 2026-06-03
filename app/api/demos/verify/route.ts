import { NextRequest, NextResponse } from "next/server";

import {
  formatDialString,
  getVerticalDid,
  isVertical,
  type Vertical,
} from "@/lib/voice-agents";
import { verifySmsCode, findRecentLeadByMobile } from "@/lib/demo-leads-db";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { sendDidReveal } from "@/lib/sms";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface VerifyBody {
  leadId?: string;
  code?: string;
}

/** Read the vertical + mobile that belong to a lead row so we know which DID to reveal. */
async function readLeadCore(
  leadId: string,
): Promise<{ vertical: Vertical; mobile: string } | null> {
  if (!isSupabaseConfigured()) {
    // Dev stub — pretend it's an hvac lead so the UI flow works locally.
    return { vertical: "hvac", mobile: "+15555550000" };
  }
  const { data, error } = await supabaseAdmin
    .from("demo_leads")
    .select("vertical, mobile_e164")
    .eq("id", leadId)
    .maybeSingle();
  if (error || !data) return null;
  if (!isVertical(data.vertical)) return null;
  return { vertical: data.vertical as Vertical, mobile: data.mobile_e164 };
}

export async function POST(req: NextRequest) {
  let body: VerifyBody = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.leadId || !body.code) {
    return NextResponse.json(
      { error: "leadId and code required" },
      { status: 400 },
    );
  }

  const core = await readLeadCore(body.leadId);
  if (!core) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  const did = getVerticalDid(core.vertical);
  if (!did) {
    // DID not configured for this vertical (env not set yet). Surface clearly.
    return NextResponse.json(
      {
        error:
          "Demo line for this vertical is not provisioned yet — try another vertical or check back shortly.",
      },
      { status: 503 },
    );
  }

  const verify = await verifySmsCode({
    leadId: body.leadId,
    code: body.code,
    didDialed: did,
  });
  if (!verify.ok) {
    return NextResponse.json(
      { error: verify.error ?? "Verify failed" },
      { status: 400 },
    );
  }

  // Belt-and-suspenders: also push the DID to the mobile so they have it in messages.
  await sendDidReveal(core.mobile, did, core.vertical).catch(() => {
    /* non-fatal */
  });

  return NextResponse.json({
    did,
    dialString: formatDialString(did),
  });
}

/** Optional GET — internal: surface the most recent verified lead for the given mobile.
 * Used by the FreeSWITCH bridge to confirm a caller is a known demo lead before
 * routing them to the vertical agent. Requires a shared secret header.
 */
export async function GET(req: NextRequest) {
  const secret = process.env.DEMO_INTERNAL_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }
  if (req.headers.get("x-internal-secret") !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const mobile = req.nextUrl.searchParams.get("mobile");
  if (!mobile) {
    return NextResponse.json({ error: "mobile required" }, { status: 400 });
  }
  const lead = await findRecentLeadByMobile(mobile);
  if (!lead) {
    return NextResponse.json({ lead: null }, { status: 200 });
  }
  return NextResponse.json({
    lead: {
      id: lead.id,
      vertical: lead.vertical,
      first_name: lead.first_name,
      biz_name: lead.biz_name,
      verified_at: lead.sms_verified_at,
    },
  });
}
