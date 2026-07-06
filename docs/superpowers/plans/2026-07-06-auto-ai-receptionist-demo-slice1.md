# Auto AI Receptionist Demo (Slice 1) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make one vertical (Auto) a complete demo loop — prospect picks Auto on `/demos`, consents, reveals the live number, calls the AI receptionist, and the finished call posts back a summary that lands in Supabase and emails Chad.

**Architecture:** Two tracks. **Track A (website, safe, Vercel):** consolidate three funnels into one vertical-aware form with a consent gate; Auto reveals its live DID via the existing SMS start/verify flow, all other verticals capture a "coming soon" lead. **Track B (PBX, production, approval-gated):** wire `fspbx-2` so a completed Auto call POSTs an HMAC-signed transcript to `/api/call-ended`, closing the reporting loop the website already knows how to handle.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Supabase (`demo_leads`, `tool_leads`), Telnyx SMS, Resend, Discord webhook, FreeSWITCH + OpenAI Realtime on `fspbx-2`.

**Design spec:** `docs/superpowers/specs/2026-07-06-auto-ai-receptionist-demo-slice1-design.md`

## Global Constraints

- **No test runner exists.** Verify with `npm run build` (must pass before every commit), `npm run lint`, `curl` against `npm run dev` on `:3000`, manual browser, and — for Track B — a real cellular test call. Do NOT add vitest/jest or write unit-test files; that is out of scope for this repo (CLAUDE.md).
- **Tailwind is v3** — no v4-only syntax. Use existing literals (`navy-900`, `brand`, `brand-soft`, `soft`).
- **Path alias** `@/*` → repo root. Use `@/lib/...`, `@/components/...`, never relative `../../`.
- **Auto is the only "live" vertical this slice.** All other picker verticals show "coming soon" and capture a lead — do NOT reveal their numbers.
- **`demo_leads.vertical` CHECK constraint = hvac|plumbing|auto|medspa only.** Coming-soon leads (incl. dental/general) go to `tool_leads`, never `demo_leads`. No migration.
- **SCA main line 949-749-0001 is Stack-Consulting-only** — never reveal it to a prospect.
- **Consent copy (verbatim):** "This is a live AI demo — you'll be talking to an automated voice assistant, not a person. The call is recorded and processed by AI to run the demo. Please don't share medical, financial, payment, or other sensitive information — this is a demo line only."
- **Branch before implementing.** Do not commit Track work to `main` directly; create `feat/demo-slice1-auto`.
- **Track B touches production PBX.** Do not start Track B until Track A is merged AND Chad explicitly approves the Track B start. Follow provision-phone discipline (validate on the Auto extension only).

---

## File Structure

**Track A — created:**
- `lib/demo-consent.ts` — the consent notice constant (single source of truth).
- `lib/lead-notify.ts` — `notifyChadOfLead()` (Discord + Resend email).
- `app/api/demos/interest/route.ts` — coming-soon lead capture → `tool_leads` + notify.

**Track A — modified:**
- `lib/email.ts` — add generic `sendPlainEmail({to,subject,text})` (reuse existing Resend client).
- `lib/voice-agents/index.ts` — add `DEMO_PICKER` list + `isLiveVertical()`.
- `components/demos/VerticalDemoFunnel.tsx` — add vertical picker + consent gate + live/coming-soon branching.
- `app/demos/page.tsx` — mount the consolidated funnel; remove Demo 01 + static vertical cards.
- `app/api/demos/start/route.ts` — notify Chad on lead creation.

**Track A — removed / redirected:**
- `components/demos/InboundDemoReveal.tsx`, `app/api/demos/reveal/route.ts` (delete).
- `app/try/page.tsx` (redirect to `/demos`), `components/DemoRegister.tsx`, `app/api/try/route.ts` (delete).
- `components/demos/CallMeDemo.tsx`, `app/api/demos/call/route.ts` (delete).

**Track B — modified (on `fspbx-2`, not in repo):**
- The demo post-call handler: `ai-webhook.service` Python at `127.0.0.1:8089` and/or the `ai_assistant_demo.lua` hangup hook — add HMAC-signed POST to `/api/call-ended`.
- Vercel env + `fspbx-2` env: `CALL_WEBHOOK_SECRET`, `DEMO_INTERNAL_SECRET`.

---

## Track A — Website consolidation (safe, Vercel)

### Task A0: Branch

- [ ] **Step 1: Create the feature branch**

Run:
```bash
cd /home/runninja/stackconsultingai-com
git checkout -b feat/demo-slice1-auto
```
Expected: `Switched to a new branch 'feat/demo-slice1-auto'`

---

### Task A1: Picker registry + live-vertical helper

**Files:**
- Modify: `lib/voice-agents/index.ts`

**Interfaces:**
- Consumes: nothing new.
- Produces: `DEMO_PICKER: { id: string; displayName: string; live: boolean }[]`, `isLiveVertical(id: string): boolean`. Auto is the only `live: true` entry.

- [ ] **Step 1: Append the picker list and helper to `lib/voice-agents/index.ts`**

Add at the end of the file (after `formatDialString`):
```ts
/**
 * The verticals shown in the /demos picker. This is a SUPERSET of VERTICAL_AGENTS:
 * it includes dental + general which have no agent/DID yet.
 * `live: true` means the vertical reveals a real DID; false means "coming soon"
 * (capture a lead, reveal nothing). Flip a vertical live by setting live: true AND
 * ensuring its DID env var is set (and, for dental/general, adding an agent module).
 */
export const DEMO_PICKER: { id: string; displayName: string; live: boolean }[] = [
  { id: "auto", displayName: "Auto Repair", live: true },
  { id: "hvac", displayName: "HVAC", live: false },
  { id: "plumbing", displayName: "Plumbing", live: false },
  { id: "medspa", displayName: "Med Spa / Aesthetics", live: false },
  { id: "dental", displayName: "Dental", live: false },
  { id: "general", displayName: "General Local Service", live: false },
];

/** True only for verticals that reveal a real DID this slice (Auto). */
export function isLiveVertical(id: string): boolean {
  return DEMO_PICKER.some((v) => v.id === id && v.live);
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: PASS (compiles, no type errors).

- [ ] **Step 3: Commit**

```bash
git add lib/voice-agents/index.ts
git commit -m "feat(demos): add DEMO_PICKER registry + isLiveVertical helper"
```

---

### Task A2: Consent constant + lead-notify helper

**Files:**
- Modify: `lib/email.ts`
- Create: `lib/demo-consent.ts`
- Create: `lib/lead-notify.ts`

**Interfaces:**
- Produces: `DEMO_CONSENT_NOTICE: string`; `sendPlainEmail({ to, subject, text }): Promise<{ id: string | null; error?: string }>` (in `lib/email.ts`); `notifyChadOfLead(lead: LeadNotice): Promise<void>` where `LeadNotice = { vertical: string; firstName?: string; bizName?: string; email: string; mobile?: string; comingSoon: boolean }`.
- Notify address comes from `process.env.LEAD_NOTIFY_EMAIL ?? "chad@stackconsultingai.com"` (same convention as `/api/demos/notify`).

- [ ] **Step 1: Create `lib/demo-consent.ts`**

```ts
/** CIPA-safe consent notice shown before revealing a demo number or capturing a lead. */
export const DEMO_CONSENT_NOTICE =
  "This is a live AI demo — you'll be talking to an automated voice assistant, not a person. The call is recorded and processed by AI to run the demo. Please don't share medical, financial, payment, or other sensitive information — this is a demo line only.";
```

- [ ] **Step 2: Add a generic sender to `lib/email.ts`**

`lib/email.ts` currently only exports `sendAssessmentEmail` (assessment-shaped, wrong signature). It has a module const `FROM_ADDRESS = "Stack Consulting AI <stacks@stackconsultingai.com>"` and `isResendConfigured()`, and creates the client inline with `new Resend(process.env.RESEND_API_KEY)`. Add a generic sender that reuses those (no second client):
```ts
export async function sendPlainEmail(opts: {
  to: string;
  subject: string;
  text: string;
}): Promise<{ id: string | null; error?: string }> {
  if (!isResendConfigured()) {
    return { id: null, error: "Resend not configured (missing RESEND_API_KEY)" };
  }
  const resend = new Resend(process.env.RESEND_API_KEY);
  const result = await resend.emails.send({
    from: FROM_ADDRESS,
    to: opts.to,
    subject: opts.subject,
    text: opts.text,
  });
  return { id: result.data?.id ?? null, error: result.error?.message };
}
```
(`FROM_ADDRESS`, `isResendConfigured`, and `Resend` are already in-module — no new imports.)

- [ ] **Step 3: Create `lib/lead-notify.ts`**

```ts
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
```

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: PASS. If the `@/lib/email` import name is wrong, the build fails with a clear error — fix the import to match the real export and rebuild.

- [ ] **Step 5: Commit**

```bash
git add lib/email.ts lib/demo-consent.ts lib/lead-notify.ts
git commit -m "feat(demos): generic sendPlainEmail + consent notice + Chad lead-notify helper"
```

---

### Task A3: Coming-soon lead capture route

**Files:**
- Create: `app/api/demos/interest/route.ts`

**Interfaces:**
- Consumes: `notifyChadOfLead` (A2), `supabaseAdmin`/`isSupabaseConfigured` (`@/lib/supabase`).
- Produces: `POST /api/demos/interest` accepting `{ vertical, firstName?, bizName?, email, mobile?, consent }` → inserts a `tool_leads` row (`tool_name = "demo-comingsoon"`) and notifies Chad. Returns `{ ok: true, comingSoon: true }`.

- [ ] **Step 1: Create `app/api/demos/interest/route.ts`**

```ts
import { NextRequest, NextResponse } from "next/server";

import { notifyChadOfLead } from "@/lib/lead-notify";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface InterestBody {
  vertical?: string;
  firstName?: string;
  bizName?: string;
  email?: string;
  mobile?: string;
  consent?: boolean;
}

export async function POST(req: NextRequest) {
  let body: InterestBody = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.vertical || !body.email) {
    return NextResponse.json({ error: "Vertical and email required" }, { status: 400 });
  }
  if (!body.consent) {
    return NextResponse.json({ error: "Consent required" }, { status: 400 });
  }

  // Store coming-soon interest in tool_leads (demo_leads.vertical CHECK excludes dental/general).
  if (isSupabaseConfigured()) {
    const { error } = await supabaseAdmin.from("tool_leads").insert({
      tool_name: "demo-comingsoon",
      tool_data: {
        vertical: body.vertical,
        first_name: body.firstName ?? null,
        biz_name: body.bizName ?? null,
        email: body.email,
        mobile: body.mobile ?? null,
      },
      email: body.email,
    });
    if (error) {
      console.error("[demos/interest] insert failed:", error.message);
      return NextResponse.json({ error: "Could not save lead" }, { status: 500 });
    }
  }

  await notifyChadOfLead({
    vertical: body.vertical,
    firstName: body.firstName,
    bizName: body.bizName,
    email: body.email,
    mobile: body.mobile,
    comingSoon: true,
  });

  return NextResponse.json({ ok: true, comingSoon: true });
}
```

Note: confirm the `tool_leads` column names (`tool_name`, `tool_data`, `email`) against `migrations/001_create_tools_tables.sql` before finalizing; adjust the insert keys if they differ.

- [ ] **Step 2: Verify build + local POST**

Run: `npm run build` → PASS. Then with `npm run dev` running:
```bash
curl -s -X POST localhost:3000/api/demos/interest \
  -H 'Content-Type: application/json' \
  -d '{"vertical":"dental","email":"t@example.com","bizName":"Test Dental","consent":true}'
```
Expected: `{"ok":true,"comingSoon":true}`. A request with `"consent":false` → 400.

- [ ] **Step 3: Commit**

```bash
git add app/api/demos/interest/route.ts
git commit -m "feat(demos): coming-soon interest capture route -> tool_leads + notify"
```

---

### Task A4: Notify Chad on live (Auto) lead creation

**Files:**
- Modify: `app/api/demos/start/route.ts`

**Interfaces:**
- Consumes: `notifyChadOfLead` (A2).

- [ ] **Step 1: Import the helper**

At the top of `app/api/demos/start/route.ts`, add:
```ts
import { notifyChadOfLead } from "@/lib/lead-notify";
```

- [ ] **Step 2: Notify after the lead is saved**

Immediately after the `createDemoLead` success check (after the block that returns 500 when `!inserted.id`, around line 181) and before `sendVerificationCode`, add:
```ts
  await notifyChadOfLead({
    vertical: body.vertical,
    firstName: body.firstName,
    bizName: body.bizName,
    email: body.email,
    mobile: mobileE164,
    comingSoon: false,
  });
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add app/api/demos/start/route.ts
git commit -m "feat(demos): notify Chad when a live demo lead is created"
```

---

### Task A5: Consolidated funnel UI (picker + consent gate + branching)

**Files:**
- Modify: `components/demos/VerticalDemoFunnel.tsx`

**Interfaces:**
- Consumes: `DEMO_PICKER`, `isLiveVertical` (A1); `DEMO_CONSENT_NOTICE` (A2).
- Produces: a single funnel where the user picks a vertical, checks consent, and submits. Live vertical → existing `/api/demos/start` → `/api/demos/verify` reveal path. Coming-soon vertical → `/api/demos/interest` → "we'll reach out" confirmation.

- [ ] **Step 1: Read the current component**

Run: `sed -n '1,220p' components/demos/VerticalDemoFunnel.tsx` — note how it currently takes `vertical` as a prop, its form state, and where it POSTs to `/api/demos/start` and `/api/demos/verify`.

- [ ] **Step 2: Add picker + consent state**

Make the component self-contained (no longer requires a `vertical` prop; default it to a state value). Add near the top of the component body:
```tsx
import { DEMO_PICKER, isLiveVertical } from "@/lib/voice-agents";
import { DEMO_CONSENT_NOTICE } from "@/lib/demo-consent";
// ...
const [vertical, setVertical] = useState<string>("auto");
const [consent, setConsent] = useState(false);
```

- [ ] **Step 3: Render the picker + consent gate above the submit button**

```tsx
<label className="block text-sm font-medium text-navy-900">Your industry</label>
<select
  value={vertical}
  onChange={(e) => setVertical(e.target.value)}
  className="w-full rounded-md border border-[#e2e2e2] px-3 py-2"
>
  {DEMO_PICKER.map((v) => (
    <option key={v.id} value={v.id}>
      {v.displayName}
      {v.live ? "" : " (coming soon)"}
    </option>
  ))}
</select>

<label className="mt-4 flex items-start gap-2 text-sm text-navy-700">
  <input
    type="checkbox"
    checked={consent}
    onChange={(e) => setConsent(e.target.checked)}
    className="mt-1"
  />
  <span>{DEMO_CONSENT_NOTICE}</span>
</label>
```

The submit button must be `disabled={!consent}`.

- [ ] **Step 4: Branch the submit handler by vertical availability**

In the submit handler, before the existing start/verify logic:
```tsx
if (!consent) return;

if (!isLiveVertical(vertical)) {
  const res = await fetch("/api/demos/interest", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ vertical, firstName, bizName, email, mobile, consent }),
  });
  if (res.ok) {
    setComingSoon(true); // add a `comingSoon` state; render: "Thanks — that line isn't live yet. Chad will reach out to set up your demo."
  } else {
    setError("Something went wrong — try again.");
  }
  return;
}
// else: fall through to the existing /api/demos/start flow, passing `vertical` in the body.
```
Ensure the existing `/api/demos/start` POST body includes `vertical` (the state value) instead of the old prop.

- [ ] **Step 5: Preserve Turnstile on the live branch**

The current funnel wires `TurnstileWidget` into the `/api/demos/start` submit (bot protection). The "make self-contained" rewrite must NOT drop it. Keep the `TurnstileWidget` render and pass `turnstileToken` in the `/api/demos/start` body on the **live (Auto)** branch exactly as before. The **coming-soon branch** (`/api/demos/interest`) does not need Turnstile — skip it there. After editing, grep to confirm it survived:
```bash
grep -n "Turnstile\|turnstileToken" components/demos/VerticalDemoFunnel.tsx
```
Expected: still present, referenced in the live-branch submit.

- [ ] **Step 6: Verify build + manual browser**

Run: `npm run build` → PASS. Then `npm run dev`, open `localhost:3000/demos`:
- Submit disabled until consent checked.
- Pick **Auto** + consent + fill form → sends SMS start flow (dev stub logs the code to console).
- Pick **Dental** + consent → "coming soon" confirmation, no number.

- [ ] **Step 7: Commit**

```bash
git add components/demos/VerticalDemoFunnel.tsx
git commit -m "feat(demos): consolidated funnel — vertical picker, consent gate, live/coming-soon branch"
```

---

### Task A6: Mount consolidated funnel on /demos, remove Demo 01 + static cards

**Files:**
- Modify: `app/demos/page.tsx`

- [ ] **Step 1: Read the page**

Run: `sed -n '1,300p' app/demos/page.tsx` — locate the `<InboundDemoReveal />` usage (`#demo-call`) and the static vertical `<Link>` card grid (`#demo-verticals`, ~lines 246-266).

- [ ] **Step 2: Replace the Demo 01 section with the consolidated funnel**

Import and render `VerticalDemoFunnel` (now self-contained) in the `#demo-call` section. Remove the `<InboundDemoReveal />` import and usage, and remove the static 4-card `#demo-verticals` grid (the picker replaces it). Leave the lead-agent (`#demo-lead`) and KB (`#demo-kb`) demo sections intact.

- [ ] **Step 3: Verify build + browser**

Run: `npm run build` → PASS. `npm run dev` → `/demos` shows one funnel with the picker; no hardcoded number appears anywhere on the page.

- [ ] **Step 4: Commit**

```bash
git add app/demos/page.tsx
git commit -m "feat(demos): mount consolidated funnel on /demos, drop Demo 01 stub + static cards"
```

---

### Task A7: Retire duplicate + dead paths

**Files:**
- Delete: `components/demos/InboundDemoReveal.tsx`, `app/api/demos/reveal/route.ts`
- Delete: `components/DemoRegister.tsx`, `app/api/try/route.ts`
- Modify: `app/try/page.tsx` → redirect to `/demos`
- Delete: `components/demos/CallMeDemo.tsx`, `app/api/demos/call/route.ts`

- [ ] **Step 1: Confirm no live importers remain**

Run:
```bash
grep -rn "InboundDemoReveal\|DemoRegister\|CallMeDemo\|api/demos/reveal\|api/demos/call\|api/try" app components | grep -v "app/try/page.tsx"
```
Expected: no results (Task A6 already removed the `InboundDemoReveal` import). Fix any stragglers before deleting.

- [ ] **Step 2: Replace `app/try/page.tsx` with a redirect**

```tsx
import { redirect } from "next/navigation";

export default function TryRedirect() {
  redirect("/demos");
}
```

- [ ] **Step 3: Delete the dead files**

```bash
git rm components/demos/InboundDemoReveal.tsx app/api/demos/reveal/route.ts \
       components/DemoRegister.tsx app/api/try/route.ts \
       components/demos/CallMeDemo.tsx app/api/demos/call/route.ts
```

- [ ] **Step 4: Verify build + lint**

Run: `npm run build && npm run lint`
Expected: PASS, no unresolved imports. Manually hit `localhost:3000/try` → redirects to `/demos`.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore(demos): retire /try duplicate, Demo 01 stub, and orphaned CallMeDemo"
```

---

### Task A8: Deploy Track A + live smoke test

- [ ] **Step 1: Pre-flight — dial the Auto line before trusting it**

`.env.local` and the spec say Auto (949-239-7925) is live, but a stale Jun-12 note flagged a dead number. **Actually call 949-239-7925 from a phone and confirm the AI auto-receptionist answers** before shipping a reveal that points at it. If it does NOT answer, STOP and escalate — do not deploy a funnel that reveals a dead line.

- [ ] **Step 2: Confirm env vars in Vercel**

In the Vercel dashboard (Strategic-Sync team → `stackconsultingai-com` → Settings → Environment Variables):
- Confirm `DEMO_DID_AUTO` = `+19492397925` (E.164; matches `.env.local`). If missing, set it.
- Set `CALL_WEBHOOK_SECRET` now (Production) even though the PBX side lands in Track B. Today `/api/call-ended` accepts **unsigned** POSTs when the secret is unset; setting it here closes that gap while Track A is live. Use `openssl rand -hex 32`; record the value for Track B B1 (the box must use the same one). Nothing legitimately POSTs to `/api/call-ended` yet, so setting it early breaks nothing.

- [ ] **Step 3: Merge and push**

```bash
git checkout main
git pull --rebase origin main
git merge --no-ff feat/demo-slice1-auto
npm run build   # final gate — PASS required
git push origin main
```
Expected: Vercel auto-deploys.

- [ ] **Step 4: Live smoke test**

On the deployed site:
- `/demos` → pick **Auto** + consent + real email/mobile → receive SMS code → verify → **949-239-7925 revealed**.
- Pick **Dental** + consent → "coming soon", no number, and Chad gets a Discord + email notice.
- Confirm `/try` redirects to `/demos`.

- [ ] **Step 5: Record Track A complete**

Note in the progress ledger: Track A done. **Stop here and get Chad's explicit approval before starting Track B (production PBX).**

---

## Track B — PBX return-leg (production `fspbx-2`, approval-gated)

> Do not start until Track A is deployed AND Chad approves the Track B start. All work is over SSH to `fspbx-2` (`ssh fspbx-2`, `100.117.67.62`). Validate on the Auto extension only. Keep the existing local-file + Postfix fallback intact.

### Task B1: Set shared secrets on both sides

**Files:** Vercel env + `fspbx-2` env.

- [ ] **Step 1: Reuse the A8 secret; generate the internal one**

`CALL_WEBHOOK_SECRET` was already set in Vercel during Track A (A8 Step 2) — use that exact value on the box. Generate `DEMO_INTERNAL_SECRET` with `openssl rand -hex 32`.

- [ ] **Step 2: Set `DEMO_INTERNAL_SECRET` in Vercel**

Vercel → `stackconsultingai-com` → Settings → Environment Variables: add `DEMO_INTERNAL_SECRET` (Production). Redeploy so it takes effect. (`CALL_WEBHOOK_SECRET` is already there from A8.)

- [ ] **Step 3: Set on `fspbx-2`**

Add the same `CALL_WEBHOOK_SECRET` (and `DEMO_INTERNAL_SECRET` if the bridge uses the internal GET) to the environment the post-call handler reads (e.g. the `ai-webhook.service` unit's `Environment=` / `EnvironmentFile=`). Do not restart FreeSWITCH; restart only the webhook service if required.

- [ ] **Step 4: Verify HMAC is now enforced**

```bash
curl -s -o /dev/null -w "%{http_code}" -X POST https://stackconsultingai.com/api/call-ended \
  -H 'Content-Type: application/json' -H 'x-signature: bogus' \
  -d '{"transcript":"x","callerPhoneNumber":"+19495550000"}'
```
Expected: `401` (bad signature rejected — previously would have passed unsigned).

---

### Task B2: POST the finished Auto call to /api/call-ended (HMAC-signed)

**Files:** the demo post-call handler on `fspbx-2` (`ai-webhook.service` Python and/or `ai_assistant_demo.lua` hangup hook).

**Contract the website already enforces** (`app/api/call-ended/route.ts`): header `x-signature` = hex `HMAC-SHA256(rawBody, CALL_WEBHOOK_SECRET)`; JSON body `{ transcript: string, callerPhoneNumber: string, durationSeconds?: number, recordingUrl?: string }`. The route matches `callerPhoneNumber` → `findRecentLeadByMobile` → `handleDemoCallEnded` → updates `demo_leads` + emails via `sendDemoReportEmail`.

- [ ] **Step 1: Locate the current post-call write**

On `fspbx-2`, find where demo calls currently write `/var/lib/freeswitch/ai_leads` + trigger Postfix (grep the webhook service + `ai_assistant_demo.lua`). This is where the new POST is added — **in addition to**, not replacing, the local write.

- [ ] **Step 2: Add the signed POST (Auto path only)**

In the handler, after the transcript/summary is assembled, add an HMAC-signed POST. Python reference:
```python
import hmac, hashlib, json, os, urllib.request

def post_call_ended(transcript, caller_e164, duration_s):
    secret = os.environ["CALL_WEBHOOK_SECRET"].encode()
    payload = {
        "transcript": transcript,
        "callerPhoneNumber": caller_e164,
        "durationSeconds": duration_s,
    }
    raw = json.dumps(payload).encode()
    sig = hmac.new(secret, raw, hashlib.sha256).hexdigest()
    req = urllib.request.Request(
        "https://stackconsultingai.com/api/call-ended",
        data=raw,
        headers={"Content-Type": "application/json", "x-signature": sig},
        method="POST",
    )
    try:
        urllib.request.urlopen(req, timeout=10).read()
    except Exception as e:
        # Non-fatal: local /var/lib/freeswitch/ai_leads + Postfix already fired.
        print(f"[call-ended POST failed] {e}")
```
Gate this call so it only fires for the **Auto** extension (5005) this slice.

- [ ] **Step 3: Reload deliberately**

If a Lua change was needed: `fs_cli -x reloadxml`. If only the Python service changed: restart just that service. Follow provision-phone — do not push to other extensions.

- [ ] **Step 4: Signed-POST self-test from the box**

Run the `post_call_ended` function once with a dummy transcript and a known test mobile, then check that `/api/call-ended` returned 200 and (if that mobile has a recent `demo_leads` row) the row got a `call_summary`.

---

### Task B3: End-to-end verification + handoff doc

- [ ] **Step 1: Full loop, real cellular call**

From a **real cell phone** (not a softphone/landline — cellular audio is the true test): complete the `/demos` Auto flow to reveal 949-239-7925, call it, talk to the AI receptionist through a full intake, hang up.

- [ ] **Step 2: Confirm the loop closed**

Within ~1 minute confirm:
- The caller's `demo_leads` row now has `call_summary`, `call_duration_s`, `transcript` populated.
- Chad received the branded call-report email (`sendDemoReportEmail`).

- [ ] **Step 3: Update the handoff doc**

Append to `docs/phone-handoff-2026-07-05.md` (or a new dated handoff): Auto return-leg wired; `/api/call-ended` now receives demo transcripts; `CALL_WEBHOOK_SECRET` set both sides; local `ai_leads` fallback retained. Commit:
```bash
git add docs/phone-handoff-2026-07-05.md
git commit -m "docs(pbx): Auto demo return-leg wired to /api/call-ended"
git push origin main
```

- [ ] **Step 4: Record complete**

Ledger: Track B done. Slice 1 definition-of-done met.

---

## Self-Review

**Spec coverage:** §5 website consolidation → A1,A5,A6,A7; consent gate → A2,A5; live reveal → existing start/verify + A8; coming-soon capture → A3,A5; notify → A2,A4; §6 PBX return-leg → B1,B2; §7 secrets → B1; §8 data (no migration; tool_leads for coming-soon) → A3; §9 HMAC → B1,B2; §11 test checklist → A8,B3; retirements → A7. Covered.

**Placeholder scan:** All code steps contain real code. The one remaining "confirm against source" point is the `tool_leads` column set (A3 note) — an existing-code fact the implementer verifies against `migrations/001_create_tools_tables.sql`, not an invented value. The email sender is now concrete (`sendPlainEmail` added to `lib/email.ts` reusing `FROM_ADDRESS`/`isResendConfigured`/`new Resend`), notify address from `LEAD_NOTIFY_EMAIL`.

**Review fix-ups folded in (2026-07-06 plan review):** (1) 🔴 real gap — `lib/email.ts` has no `sendEmailToChad`; replaced with a concrete `sendPlainEmail` + explicit notify address (A2). (2) 🟡 Turnstile bot-gate preserved on the live Auto branch (A5 Step 5). (3) 🟡 DID-liveness pre-flight dial before deploy (A8 Step 1); `CALL_WEBHOOK_SECRET` moved into Track A (A8 Step 2) to close the unsigned-`/api/call-ended` gap while A is live, reconciled in B1.

**Type consistency:** `notifyChadOfLead(LeadNotice)` used identically in A2/A3/A4. `isLiveVertical`/`DEMO_PICKER` defined in A1, consumed in A3/A5. `x-signature`/`CALL_WEBHOOK_SECRET`/`callerPhoneNumber`/`durationSeconds` match the route contract read from `app/api/call-ended/route.ts`.
