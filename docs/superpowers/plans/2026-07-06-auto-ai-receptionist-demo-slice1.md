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
- **`.env.local.example` DIDs are stale for non-Auto verticals** (Finding 5): it maps `HVAC=7923`/`MEDSPA=7926`, but the Jul-05 handoff says 7923=medspa, 7926=hvac, plumbing=7922, Woods=7924. **`DEMO_DID_AUTO=+19492397925` is correct.** Do NOT trust the example file when flipping any other vertical live — fix it first (a later slice). This slice only touches Auto.

---

## File Structure

**Track A — created:**
- `lib/demo-consent.ts` — the consent notice constant (single source of truth).
- `lib/lead-notify.ts` — `notifyChadOfLead()` (Discord + Resend email).
- `app/api/demos/interest/route.ts` — coming-soon lead capture → `tool_leads` + notify.

**Track A — modified:**
- `lib/email.ts` — add generic `sendPlainEmail({to,subject,text})` (reuse existing Resend client).
- `lib/voice-agents/index.ts` — add `DEMO_PICKER` list + `isLiveVertical()`.
- `components/demos/VerticalDemoFunnel.tsx` — add vertical picker + consent gate + live/coming-soon branching (preserve Turnstile on live branch).
- `app/demos/page.tsx` — mount the consolidated funnel; remove Demo 01 + static vertical cards.
- `app/api/demos/start/route.ts` — notify Chad on lead creation.
- `app/api/call-ended/route.ts` — hex-validate signature; did-scoped demo attribution (A8).
- `lib/demo-leads-db.ts` — add `findRecentLeadByMobileAndDid` (A8).

**Track A — removed / redirected:**
- `components/demos/InboundDemoReveal.tsx`, `app/api/demos/reveal/route.ts` (delete).
- `app/try/page.tsx` (redirect to `/demos`), `components/DemoRegister.tsx`, `app/api/try/route.ts` (delete).
- `components/demos/CallMeDemo.tsx`, `app/api/demos/call/route.ts` (delete).

**Track B — modified (on `fspbx-2`, not in repo):**
- The **existing 5003 assessment sender** — add HMAC signing (must sign before the secret is enforced, or the live assessment path 401s).
- The demo post-call handler: `ai-webhook.service` Python at `127.0.0.1:8089` and/or the `ai_assistant_demo.lua` hangup hook — add HMAC-signed POST to `/api/call-ended` with `vertical`+`didDialed`.
- Vercel env + `fspbx-2` env: `CALL_WEBHOOK_SECRET` (enforced only after both senders sign), `DEMO_INTERNAL_SECRET`.

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
import { DEMO_PICKER } from "@/lib/voice-agents";

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

  // Finding 4 — validate + rate-limit before emailing Chad (spam guard).
  const vertical = String(body.vertical ?? "");
  const email = String(body.email ?? "").trim().toLowerCase();

  if (!DEMO_PICKER.some((v) => v.id === vertical)) {
    return NextResponse.json({ error: "Unknown vertical" }, { status: 400 });
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }
  if (!body.consent) {
    return NextResponse.json({ error: "Consent required" }, { status: 400 });
  }

  // Rate limit: max 3 coming-soon submissions per email per 24h.
  if (isSupabaseConfigured()) {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { count } = await supabaseAdmin
      .from("tool_leads")
      .select("id", { count: "exact", head: true })
      .eq("tool_name", "demo-comingsoon")
      .eq("email", email)
      .gte("created_at", since);
    if ((count ?? 0) >= 3) {
      return NextResponse.json(
        { error: "Too many requests — try again later." },
        { status: 429 },
      );
    }
  }

  // NOTE: use the normalized `vertical` and `email` locals (not body.*) in the
  // insert + notifyChadOfLead calls below.

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

### Task A8: Harden `/api/call-ended` (signature validation + did-scoped attribution)

Safe website change; prepares the endpoint for Track B. Backward-compatible — when `didDialed`/`vertical` are absent (nothing posts them during Track A), behavior is unchanged.

**Files:**
- Modify: `app/api/call-ended/route.ts`
- Modify: `lib/demo-leads-db.ts`

**Interfaces:**
- Produces: `findRecentLeadByMobileAndDid(mobile: string, didDialed: string)` in `lib/demo-leads-db.ts`; `CallEndedPayload` gains optional `vertical?: string; didDialed?: string`.

- [ ] **Step 1: Hex-validate the signature (Finding 3)**

In `verifySignature()` (`app/api/call-ended/route.ts`), before `Buffer.from(signatureHeader, "hex")`, reject non-hex/wrong-length input so `timingSafeEqual` can't throw on a same-length non-hex string:
```ts
if (!signatureHeader || !/^[a-f0-9]{64}$/i.test(signatureHeader)) return false;
```

- [ ] **Step 2: Add a did-scoped lead lookup to `lib/demo-leads-db.ts`**

Model it on the existing `findRecentLeadByMobile` (same table/columns), but scope to the DID dialed:
```ts
export async function findRecentLeadByMobileAndDid(mobile: string, didDialed: string) {
  if (!isSupabaseConfigured()) return null;
  const since = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
  const { data } = await supabaseAdmin
    .from("demo_leads")
    .select("*")
    .eq("mobile_e164", mobile)
    .eq("did_dialed", didDialed)
    .not("sms_verified_at", "is", null)
    .gte("created_at", since)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return data ?? null;
}
```

- [ ] **Step 3: Use did-scoped match in the demo branch (Finding 2)**

In `app/api/call-ended/route.ts`: add `vertical?: string; didDialed?: string` to `CallEndedPayload`, import `findRecentLeadByMobileAndDid`, and in the demo branch prefer the did-scoped lookup:
```ts
const lead = payload.didDialed
  ? await findRecentLeadByMobileAndDid(mobileE164, payload.didDialed)
  : await findRecentLeadByMobile(mobileE164);
// If the payload names a vertical, the matched lead must agree — else this is
// a cross-vertical mismatch; skip the demo branch rather than mis-attribute.
if (lead && payload.vertical && lead.vertical !== payload.vertical) {
  console.warn("[call-ended] vertical mismatch, skipping demo attribution");
} else if (lead) {
  // ...existing handleDemoCallEnded path
}
```

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app/api/call-ended/route.ts lib/demo-leads-db.ts
git commit -m "fix(call-ended): validate hex signature + did-scoped demo attribution"
```

---

### Task A9: Deploy Track A + live smoke test

- [ ] **Step 1: Pre-flight — dial the Auto line before trusting it**

`.env.local` and the spec say Auto (949-239-7925) is live, but a stale Jun-12 note flagged a dead number. **Actually call 949-239-7925 from a phone and confirm the AI auto-receptionist answers** before shipping a reveal that points at it. If it does NOT answer, STOP and escalate — do not deploy a funnel that reveals a dead line.

- [ ] **Step 2: Confirm `DEMO_DID_AUTO` in Vercel**

In the Vercel dashboard (Strategic-Sync team → `stackconsultingai-com` → Settings → Environment Variables), confirm `DEMO_DID_AUTO` = `+19492397925` (E.164; matches `.env.local`). If missing, set it.

**Do NOT set `CALL_WEBHOOK_SECRET` in Track A.** `/api/call-ended` also serves the **live 5003 assessment path** (the generic `extractAssessment` branch). That branch almost certainly receives **unsigned** POSTs from the assessment line today (the secret is currently unset, so the route accepts them). Setting the secret before the 5003 PBX sender is updated to sign would **401 live assessments**. Secret rollout is coordinated across all senders in Track B (B1). The unsigned-POST window stays open through Track A — accepted as LOW risk (an attacker needs a matching recent-lead mobile), and closed properly in B1.

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

### Task B1: Inventory posting handlers + stage secrets (DO NOT enforce yet)

**Files:** box inspection; box env; Vercel env (`DEMO_INTERNAL_SECRET` only for now).

> **Why this ordering (Finding 1):** `/api/call-ended` also serves the **live 5003 assessment** path. The moment `CALL_WEBHOOK_SECRET` is set on the website, EVERY sender that posts unsigned gets 401'd — including 5003. So: find all senders, make them all sign, and only THEN enforce the secret (B3).

- [ ] **Step 1: Find every handler that POSTs to `/api/call-ended`**

SSH `fspbx-2` and grep for the endpoint across the AI services and Lua:
```bash
ssh fspbx-2 "grep -rn 'call-ended' /usr/share/freeswitch/scripts /etc/systemd/system /var/lib/freeswitch 2>/dev/null; systemctl cat ai-webhook.service 2>/dev/null | grep -i environ"
```
You MUST account for the **5003 assessment sender** (live — 442-212-1616). Confirm whether it currently posts **unsigned** (no `x-signature`). Record the file/function for each sender (5003 assessment, plus any others). The new 5005 demo sender is added in B2.

- [ ] **Step 2: Generate both secrets**

```bash
openssl rand -hex 32   # CALL_WEBHOOK_SECRET
openssl rand -hex 32   # DEMO_INTERNAL_SECRET
```
Store them. **Do NOT put `CALL_WEBHOOK_SECRET` on the website yet.**

- [ ] **Step 3: Stage the secrets safely**

- Box: add BOTH `CALL_WEBHOOK_SECRET` and `DEMO_INTERNAL_SECRET` to the handler env (`ai-webhook.service` `EnvironmentFile=`). Restart only that service.
- Vercel: add ONLY `DEMO_INTERNAL_SECRET` (Production) — it just gates the internal GET, no live path depends on it. **Leave `CALL_WEBHOOK_SECRET` out of Vercel until B3.**

---

### Task B2: Sign every posting handler on the box (5003 assessment + new 5005 demo)

**Files:** the 5003 assessment sender AND the demo post-call handler on `fspbx-2` (`ai-webhook.service` Python and/or `ai_assistant_demo.lua` hangup hook).

**Contract** (`app/api/call-ended/route.ts`, hardened in Task A8): header `x-signature` = hex `HMAC-SHA256(rawBody, CALL_WEBHOOK_SECRET)`; demo body `{ transcript, callerPhoneNumber, durationSeconds?, vertical, didDialed }`. The route prefers a **did-scoped** lead match (Task A8) so the transcript can't attach to the wrong vertical.

Because `CALL_WEBHOOK_SECRET` is still absent from the website (B1), the route accepts signed-or-unsigned during this task — so both senders can be updated and deployed with **zero downtime** before enforcement.

- [ ] **Step 1: Add signing to the existing 5003 assessment sender**

Find the 5003 sender from B1 Step 1. Add the HMAC signature to its existing POST (read `CALL_WEBHOOK_SECRET` from box env, sign the exact raw body it already sends, set the `x-signature` header). Do not change its payload. This is prerequisite so 5003 survives B3 enforcement.

- [ ] **Step 2: Locate the demo local write**

Find where demo calls currently write `/var/lib/freeswitch/ai_leads` + trigger Postfix. The new POST is added **in addition to** — never replacing — the local write (fallback).

- [ ] **Step 3: Add the signed demo POST with deterministic attribution (Auto only)**

After the transcript/summary is assembled, add:
```python
import hmac, hashlib, json, os, urllib.request

def post_call_ended(transcript, caller_e164, duration_s):
    secret = os.environ["CALL_WEBHOOK_SECRET"].encode()
    payload = {
        "transcript": transcript,
        "callerPhoneNumber": caller_e164,
        "durationSeconds": duration_s,
        "vertical": "auto",              # Finding 2: pin the vertical
        "didDialed": "+19492397925",     # Finding 2: did-scoped match on the website
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
Gate this call to the **Auto** extension (5005) only this slice.

- [ ] **Step 4: Reload deliberately**

If Lua changed: `fs_cli -x reloadxml`. If only the Python service changed: restart just that service. provision-phone discipline — no other extensions.

- [ ] **Step 5: Self-test both senders (secret still unset on website)**

Fire each sender once with a dummy transcript + known test mobile → expect `200`. For the demo self-test, if that mobile has a recent verified `demo_leads` row, confirm it got `call_summary`.

---

### Task B3: Enforce the secret (both senders now sign)

**Files:** Vercel env.

- [ ] **Step 1: Set `CALL_WEBHOOK_SECRET` in Vercel**

Only now that 5003 + 5005 both sign (B2): Vercel → `stackconsultingai-com` → Env Vars → add `CALL_WEBHOOK_SECRET` (Production, the same value as the box). Redeploy.

- [ ] **Step 2: Verify enforcement AND no 5003 regression**

- Bad signature → 401:
```bash
curl -s -o /dev/null -w "%{http_code}" -X POST https://stackconsultingai.com/api/call-ended \
  -H 'Content-Type: application/json' -H 'x-signature: bogus' \
  -d '{"transcript":"x","callerPhoneNumber":"+19495550000"}'
```
Expected: `401`.
- **5003 regression check:** place a real assessment call to **442-212-1616**, complete it, and confirm an assessment row + email are produced (NOT 401). If it 401s, the 5003 sender isn't signing correctly — fix B2 Step 1 before proceeding.
- A signed demo POST still returns `200`.

---

### Task B4: End-to-end demo loop + handoff doc

- [ ] **Step 1: Full loop, real cellular call**

From a **real cell phone** (cellular audio is the true test): complete the `/demos` Auto flow → reveal 949-239-7925 → call it → full intake → hang up.

- [ ] **Step 2: Confirm the loop closed with correct attribution**

Within ~1 minute confirm:
- The caller's `demo_leads` row (matched by mobile **and** `did_dialed` per Task A8 — correct vertical/persona) now has `call_summary`, `call_duration_s`, `transcript`.
- Chad received the branded call-report email (`sendDemoReportEmail`).

- [ ] **Step 3: Update the handoff doc**

Append to `docs/phone-handoff-2026-07-05.md`: Auto return-leg wired; 5003 + 5005 senders now HMAC-signed; `CALL_WEBHOOK_SECRET` enforced both sides; demo attribution is did-scoped; local `ai_leads` fallback retained. Commit:
```bash
git add docs/phone-handoff-2026-07-05.md
git commit -m "docs(pbx): Auto demo return-leg wired; call-ended HMAC enforced across senders"
git push origin main
```

- [ ] **Step 4: Record complete**

Ledger: Track B done. Slice 1 definition-of-done met.

---

## Self-Review

**Spec coverage:** §5 website consolidation → A1,A5,A6,A7; consent gate → A2,A5; live reveal → existing start/verify + A8; coming-soon capture → A3,A5; notify → A2,A4; §6 PBX return-leg → B1,B2; §7 secrets → B1; §8 data (no migration; tool_leads for coming-soon) → A3; §9 HMAC → B1,B2; §11 test checklist → A8,B3; retirements → A7. Covered.

**Placeholder scan:** All code steps contain real code. The one remaining "confirm against source" point is the `tool_leads` column set (A3 note) — an existing-code fact the implementer verifies against `migrations/001_create_tools_tables.sql`, not an invented value. The email sender is now concrete (`sendPlainEmail` added to `lib/email.ts` reusing `FROM_ADDRESS`/`isResendConfigured`/`new Resend`), notify address from `LEAD_NOTIFY_EMAIL`.

**Review fix-ups folded in (2026-07-06 review #1):** (1) 🔴 real gap — `lib/email.ts` has no `sendEmailToChad`; replaced with a concrete `sendPlainEmail` + explicit notify address (A2). (2) 🟡 Turnstile bot-gate preserved on the live Auto branch (A5 Step 5). (3) 🟡 DID-liveness pre-flight dial before deploy (A9 Step 1).

**Review fix-ups folded in (2026-07-06 review #2):**
- 🔴 **Finding 1** — `/api/call-ended` also serves the LIVE 5003 assessment path; setting `CALL_WEBHOOK_SECRET` early would 401 it. Reverted the Track-A secret-set; secret rollout is now sequenced in Track B: inventory senders (B1) → sign 5003 + 5005 (B2) → enforce secret with a 5003 no-regression check (B3).
- 🔴 **Finding 2** — demo attribution matched by mobile only → wrong vertical on multi-verify. Demo POST now sends `vertical`+`didDialed` (B2), and the route prefers a did-scoped match with a vertical-agreement guard (A8, new `findRecentLeadByMobileAndDid`).
- 🟡 **Finding 3** — `verifySignature` could throw on same-length non-hex input; added `/^[a-f0-9]{64}$/i` guard (A8 Step 1).
- 🟡 **Finding 4** — `/api/demos/interest` was an unauthenticated spam path; added DEMO_PICKER validation, email normalization, and a 3/email/24h rate limit (A3).
- 🟡 **Finding 5** — `.env.local.example` DIDs stale for non-Auto verticals; documented in Global Constraints (Auto correct; fix before flipping others).

**Type consistency:** `notifyChadOfLead(LeadNotice)` used identically in A2/A3/A4. `isLiveVertical`/`DEMO_PICKER` defined in A1, consumed in A3/A5. `x-signature`/`CALL_WEBHOOK_SECRET`/`callerPhoneNumber`/`durationSeconds` match the route contract read from `app/api/call-ended/route.ts`.
