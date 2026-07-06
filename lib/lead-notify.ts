import { sendPlainEmail } from "@/lib/email";

export interface LeadNotice {
  vertical: string;
  firstName?: string;
  bizName?: string;
  email: string;
  mobile?: string;
  comingSoon: boolean;
}

const CHAD_NOTIFY_ADDRESS =
  process.env.LEAD_NOTIFY_EMAIL ?? "chad@stackconsultingai.com";

/** Notify Chad of a new demo lead via Discord + email. Best-effort, never throws. */
export async function notifyChadOfLead(lead: LeadNotice): Promise<void> {
  const tag = lead.comingSoon ? "COMING-SOON" : "LIVE";
  const line = `New ${tag} demo lead — ${lead.vertical} · ${lead.bizName ?? "(no business)"} · ${lead.firstName ?? ""} <${lead.email}>${lead.mobile ? " · " + lead.mobile : ""}`;

  const discordUrl = process.env.DISCORD_WEBHOOK_URL;
  const jobs: Promise<unknown>[] = [];
  if (discordUrl) {
    jobs.push(
      fetch(discordUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: line }),
      }).catch(() => {}),
    );
  }
  jobs.push(
    sendPlainEmail({
      to: CHAD_NOTIFY_ADDRESS,
      subject: `Demo lead (${tag}): ${lead.vertical}`,
      text: line,
    }).catch(() => {}),
  );
  await Promise.all(jobs);
}
