/**
 * Demo call-report email — Resend wrapper.
 *
 * Sent by /api/call-ended after a vertical-demo call hangs up.
 * Brand-correct HTML (light, navy headings, brand-blue accents).
 */

import { Resend } from "resend";

const FROM_ADDRESS = "Stack Consulting AI <stacks@stackconsultingai.com>";
const REPLY_TO = "hello@stackconsultingai.com";

export function isResendConfigured() {
  return Boolean(process.env.RESEND_API_KEY);
}

export interface DemoCallActions {
  captured_fields?: Record<string, string | number | boolean | null>;
  emergency_flagged?: boolean;
  booked_slot?: string | null; // ISO timestamp the agent booked
  alternate_slot_offered?: string | null; // ISO — the +1h fallback when first was busy
  service_type?: string | null;
  zip_code?: string | null;
  notes?: string;
}

export interface DemoReportInput {
  to: string;
  firstName: string | null;
  bizName: string | null;
  vertical: string;
  verticalDisplay: string;
  durationSeconds: number | null;
  summary: string;
  actions: DemoCallActions;
  transcript: string;
}

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://stackconsultingai.com";

export async function sendDemoReportEmail(
  input: DemoReportInput,
): Promise<{ id: string | null; error: string | null }> {
  if (!isResendConfigured()) {
    return {
      id: null,
      error: "Resend not configured (missing RESEND_API_KEY)",
    };
  }
  const resend = new Resend(process.env.RESEND_API_KEY);
  const subject = `Your ${input.verticalDisplay} AI demo: here's what the agent did`;
  const html = renderHtml(input);

  const res = await resend.emails.send({
    from: FROM_ADDRESS,
    to: input.to,
    subject,
    html,
    replyTo: REPLY_TO,
  });

  if ("error" in res && res.error) {
    return { id: null, error: res.error.message };
  }
  return { id: ("data" in res && res.data?.id) || null, error: null };
}

function renderHtml(input: DemoReportInput): string {
  const firstName = input.firstName?.split(" ")[0] || "there";
  const verticalDisplay = escape(input.verticalDisplay);
  const duration =
    input.durationSeconds != null
      ? `${Math.round(input.durationSeconds)}s`
      : "&mdash;";
  const summary = escape(input.summary || "(no summary available)");
  const transcriptHtml = formatTranscript(input.transcript);

  const fields = input.actions.captured_fields ?? {};
  const fieldRows = Object.entries(fields)
    .filter(([, v]) => v !== null && v !== undefined && v !== "")
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px 6px 0;color:#00122e80;font-size:13px;text-transform:uppercase;letter-spacing:.04em;width:160px;">${escape(
          k.replace(/_/g, " "),
        )}</td><td style="padding:6px 0;color:#00122e;font-size:14px;">${escape(
          String(v),
        )}</td></tr>`,
    )
    .join("");

  const actionsList: string[] = [];
  if (input.actions.zip_code) {
    actionsList.push(`Captured ZIP ${escape(input.actions.zip_code)}`);
  }
  if (input.actions.service_type) {
    actionsList.push(
      `Identified service: ${escape(input.actions.service_type)}`,
    );
  }
  if (input.actions.emergency_flagged) {
    actionsList.push(`<strong>Flagged as emergency</strong> — top priority`);
  }
  if (input.actions.alternate_slot_offered) {
    actionsList.push(
      `Detected first slot was booked &rarr; offered ${escape(
        input.actions.alternate_slot_offered,
      )}`,
    );
  }
  if (input.actions.booked_slot) {
    actionsList.push(`Booked slot at ${escape(input.actions.booked_slot)}`);
  }
  actionsList.push("Sent SMS confirmation to the caller (demo mode)");

  const actionsHtml = actionsList
    .map(
      (a) =>
        `<li style="margin:0 0 8px 0;padding:0;line-height:1.5;">${a}</li>`,
    )
    .join("");

  return `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Your ${verticalDisplay} AI demo report</title>
</head>
<body style="margin:0;padding:0;background:#f5f5fa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Inter,Arial,sans-serif;color:#00122e;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5fa;padding:40px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;background:#ffffff;border:1px solid #e2e2e2;border-radius:6px;overflow:hidden;">
        <tr><td style="padding:32px 32px 8px 32px;">
          <div style="font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:#3e6aef;font-weight:600;margin-bottom:8px;">
            ${verticalDisplay} demo · ${duration} call
          </div>
          <h1 style="margin:0 0 12px 0;font-size:26px;line-height:1.2;color:#00122e;font-weight:700;letter-spacing:-0.01em;">
            Hi ${escape(firstName)} &mdash; here&rsquo;s the 90-second call your business just received.
          </h1>
          <p style="margin:0 0 24px 0;font-size:15px;line-height:1.55;color:#00122eb3;">
            Below is what the AI agent did on your demo call. Imagine this happening every time your phone rings.
          </p>
        </td></tr>

        <tr><td style="padding:8px 32px 0 32px;">
          <h2 style="margin:24px 0 12px 0;font-size:18px;color:#00122e;font-weight:700;">What the agent did</h2>
          <ul style="margin:0;padding-left:20px;color:#00122e;font-size:14.5px;">
            ${actionsHtml}
          </ul>
        </td></tr>

        ${
          fieldRows
            ? `<tr><td style="padding:8px 32px 0 32px;">
          <h2 style="margin:24px 0 12px 0;font-size:18px;color:#00122e;font-weight:700;">Captured intake fields</h2>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5fa;border:1px solid #e2e2e2;border-radius:6px;padding:8px 16px;">
            ${fieldRows}
          </table>
        </td></tr>`
            : ""
        }

        <tr><td style="padding:8px 32px 0 32px;">
          <h2 style="margin:24px 0 12px 0;font-size:18px;color:#00122e;font-weight:700;">Summary</h2>
          <p style="margin:0;font-size:14.5px;line-height:1.6;color:#00122ed9;">${summary}</p>
        </td></tr>

        <tr><td style="padding:8px 32px 0 32px;">
          <h2 style="margin:24px 0 12px 0;font-size:18px;color:#00122e;font-weight:700;">Transcript</h2>
          <div style="background:#f5f5fa;border:1px solid #e2e2e2;border-radius:6px;padding:16px;font-size:13.5px;line-height:1.6;color:#00122ed9;white-space:pre-wrap;">
${transcriptHtml}
          </div>
        </td></tr>

        <tr><td style="padding:24px 32px 32px 32px;">
          <div style="background:#00122e;border-radius:6px;padding:24px;text-align:center;">
            <p style="margin:0 0 16px 0;color:#ffffffd9;font-size:15px;line-height:1.55;">
              Want one of these trained on YOUR services, calendar, and pricing?
            </p>
            <a href="${SITE_URL}/ai-os" style="display:inline-block;background:#3e6aef;color:#ffffff;text-decoration:none;font-weight:600;padding:12px 24px;border-radius:6px;font-size:15px;">
              Book a 15-minute fit call &rarr;
            </a>
          </div>
        </td></tr>

        <tr><td style="padding:0 32px 24px 32px;border-top:1px solid #e2e2e2;">
          <p style="margin:16px 0 0 0;font-size:12px;color:#00122e80;line-height:1.5;">
            Stack Consulting AI &middot; Southern California &middot;
            <a href="${SITE_URL}" style="color:#3e6aef;text-decoration:none;">stackconsultingai.com</a>
            <br>
            This report was generated automatically from your demo call.
            Calls are recorded under California two-party consent (you agreed on the call).
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

function escape(s: string): string {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatTranscript(raw: string): string {
  return escape(raw.trim());
}
