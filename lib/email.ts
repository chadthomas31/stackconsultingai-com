import { Resend } from "resend";
import type { Assessment } from "./assessment-schema";

const FROM_ADDRESS = "Stack Consulting AI <stacks@stackconsultingai.com>";
const REPLY_TO = "hello@stackconsultingai.com";

export function isResendConfigured() {
  return Boolean(process.env.RESEND_API_KEY);
}

function buildReportUrl(assessmentId: string) {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://stackconsultingai.com";
  return `${base.replace(/\/$/, "")}/assessment/${assessmentId}`;
}

/** Branded transactional email — link to the rendered assessment. */
export async function sendAssessmentEmail(opts: {
  to: string;
  assessmentId: string;
  assessment: Assessment;
}): Promise<{ id: string | null; error: string | null }> {
  if (!isResendConfigured()) {
    return { id: null, error: "Resend not configured (missing RESEND_API_KEY)" };
  }
  const resend = new Resend(process.env.RESEND_API_KEY);
  const reportUrl = buildReportUrl(opts.assessmentId);
  const { business, financialImpact, quickWins } = opts.assessment;
  const firstName = business.callerName?.split(" ")[0] || "there";

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Your AI Tools Assessment is ready</title>
</head>
<body style="margin:0;padding:0;background:#f5f5fa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Inter,Arial,sans-serif;color:#00122e;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5fa;padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#fff;border:1px solid #e2e2e2;border-radius:8px;overflow:hidden;">
          <tr>
            <td style="padding:32px 32px 8px 32px;">
              <div style="font-size:12px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;color:#3e6aef;margin-bottom:8px;">Stack Consulting AI</div>
              <h1 style="margin:0 0 16px 0;font-size:28px;line-height:1.15;color:#00122e;font-weight:700;letter-spacing:-0.02em;">
                ${escapeHtml(firstName)}, your AI Tools Assessment is ready.
              </h1>
              <p style="margin:0 0 20px 0;font-size:16px;line-height:1.55;color:#4b5563;">
                We took the conversation you had with Stacks, pulled out every pain point, mapped them to the right tools, and drafted a 4-day implementation plan. The whole thing is laid out below.
              </p>
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 24px 0;">
                <tr>
                  <td style="padding:14px 20px;background:#00122e;color:#fff;border-radius:6px;">
                    <a href="${reportUrl}" style="color:#fff;text-decoration:none;font-weight:600;font-size:15px;">View your personalized report →</a>
                  </td>
                </tr>
              </table>
              <div style="background:#f5f5fa;border:1px solid #e2e2e2;border-radius:6px;padding:18px 20px;margin-bottom:24px;">
                <div style="font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#3e6aef;margin-bottom:8px;">At a glance</div>
                <div style="font-size:14px;line-height:1.7;color:#00122e;">
                  <strong>${financialImpact.weeklyHoursReclaimed}+ hrs/wk</strong> reclaimed &nbsp;·&nbsp;
                  <strong>${quickWins.length} quick wins</strong> identified &nbsp;·&nbsp;
                  <strong>$${financialImpact.monthlyToolCost}/mo</strong> total tool cost
                </div>
              </div>
              <p style="margin:0 0 8px 0;font-size:14px;line-height:1.6;color:#4b5563;">
                Reply to this email if anything doesn't match what you told Stacks — or if you'd rather have us implement the plan for you.
              </p>
              <p style="margin:0;font-size:14px;line-height:1.6;color:#4b5563;">
                — Chad &amp; the Stack Consulting AI team
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px;border-top:1px solid #e2e2e2;background:#fafafa;font-size:12px;color:#6b7280;line-height:1.5;">
              Stack Consulting AI · Southern California<br>
              <a href="https://stackconsultingai.com" style="color:#3e6aef;text-decoration:none;">stackconsultingai.com</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `${firstName}, your AI Tools Assessment is ready.

We took the conversation you had with Stacks and turned it into a personalized report:
- ${financialImpact.weeklyHoursReclaimed}+ hrs/week reclaimed
- ${quickWins.length} quick wins identified
- $${financialImpact.monthlyToolCost}/month total tool cost

View your report: ${reportUrl}

Reply if anything doesn't match what you told Stacks — or if you'd rather have us implement the plan for you.

— Chad & the Stack Consulting AI team
stackconsultingai.com`;

  try {
    const result = await resend.emails.send({
      from: FROM_ADDRESS,
      to: opts.to,
      replyTo: REPLY_TO,
      subject: `Your AI Tools Assessment for ${business.businessName || "your business"}`,
      html,
      text,
    });
    if (result.error) {
      return { id: null, error: result.error.message || String(result.error) };
    }
    return { id: result.data?.id ?? null, error: null };
  } catch (err) {
    return { id: null, error: err instanceof Error ? err.message : String(err) };
  }
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
