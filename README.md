# Stack Consulting AI

Marketing site for Stack Consulting AI — AI consulting, web development, automation, and AI phone systems for small businesses in South Orange County. Live at [stackconsultingai.com](https://stackconsultingai.com).

## Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind v3** — light theme, navy `#00122e` + accent blue `#3e6aef` on white
- **Supabase** — Postgres + RLS for leads, assessments, newsletter issues
- **Resend** — transactional email (lead notifications)
- **Anthropic SDK** + **Google GenAI** — assessment extraction, newsletter generation
- **FreeSWITCH + OpenAI Realtime** — live AI call demo at `/#call-me` (PBX on `fspbx`, see `docs/pbx-operations.md`)
- **Vercel** — auto-deploy on push to `main`

## Signature features

- Live AI call demo — visitor enters phone number, FreeSWITCH places real outbound call with OpenAI Realtime agent
- Lead-gen tools — Free AI Site Audit (PageSpeed Insights), Automation Opportunity Finder, ROI/Pricing/Timeline calculators, SEO Audit, Speed Checker, Tech Stack Recommender
- The Stack Report — admin-gated AI-generated newsletter
- City-specific landing pages — Irvine, Newport Beach, San Clemente, Mission Viejo, Costa Mesa, Orange County

## Local dev

```bash
npm install
cp .env.local.example .env.local   # fill in keys (see below)
npm run dev                        # http://localhost:3000
npm run build                      # always run before pushing
npm run lint
```

No test runner. Verification = `npm run build` + manual browser check.

## Environment variables

Required minimum:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
GOOGLE_PAGESPEED_API_KEY=
ANTHROPIC_API_KEY=
GOOGLE_GENAI_API_KEY=
RESEND_API_KEY=
NEWSLETTER_ADMIN_SECRET=
```

PBX/`/api/call-me` webhook secrets are set in Vercel for production only.

## Database migrations

`migrations/*.sql` files are **applied manually** in the Supabase SQL Editor — no migration runner. Apply SQL **before** pushing dependent code or production breaks while local works. See `migrations/README.md`.

## Project layout

```
app/
  layout.tsx              # Root layout, GA4 + GTM injection
  page.tsx                # Homepage section canon
  api/                    # Route handlers (call-me, contact, newsletter, site-audit, automation-finder, ...)
  services/               # Service pages + city geo-variants
  tools/                  # Lead-gen tool pages
  stack-report/           # Newsletter index + [slug]
components/               # Flat, PascalCase, one per file (@/components/*)
lib/                      # Supabase, Resend, Anthropic/Gemini extractors, schemas
migrations/               # Hand-applied SQL
docs/                     # PBX ops, PRDs, handoff notes
public/screenshots/       # Real client portfolio screenshots (WebP)
```

## Deployment

Push to `main` → Vercel auto-deploys. Run `npm run build` locally first.

## License

(c) 2026 Stack Consulting AI. All rights reserved.
