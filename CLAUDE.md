 # stackconsultingai.com                      
                                                             
  ## Design Context                                                   
                                             
  ### Users                                                  
  Small business owners in Southern California / Orange County evaluating AI
  consulting, web development, automation, or AI phone systems. Non-technical
  decision-makers who scan for credibility before reaching out. They've been                                                    
  pitched by 3 other "AI agencies" this month and they can smell a template.
                                                                                                                                
  ### Brand Personality                                                                                                         
  **Builder, not marketer.** Direct, concrete, slightly opinionated. Says                                                       
  "FreeSWITCH" instead of "enterprise-grade voice infrastructure." Names specific                                               
  clients and specific numbers. Never says "leverage," "synergize," "transform your                                             
  business," or "unlock."                                          
                                                     
  ### Emotional Goals                                                                                                           
  - **Immediate credibility** — within 5 seconds a visitor should believe this
    person actually builds things, not just sells them                                                                          
  - **Calm confidence** — no breathless marketing, no glowing orbs                                                              
  - **Proof before pitch** — the live AI call demo *is* the sales pitch                                                         
                                                                                                                                
  ### Aesthetic Direction                                                                                                       
  - **Light mode. White backgrounds. Deep navy headings. Bright blue accents.**                                                 
    Modeled on retellai.com and Linear's marketing pages — enterprise-credible                                                  
    without being sterile.                                                                                                      
  - **Palette**:                                                                                                                
    - Primary navy: `#00122e` (hsl 217 100% 9%) — headings, primary buttons                  
    - Accent blue: `#3e6aef` (hsl 225 85% 59%) — CTAs, kickers, focus rings                                                     
    - Soft grey: `#f5f5fa` — alternating section background        
    - Border: `#e2e2e2`                                                                                                         
    - Radius: **0.375rem (6px)** — not 0.5rem                                                                                   
  - **Typography**: Space Grotesk for headings (`font-heading`), Inter for body                                                 
    (`font-body`). Both via `next/font`. Tight tracking on large headlines                                                      
    (`-0.02em`).                                                                                                                
  - **Surfaces**: flat white cards with 1px borders. On hover: border darkens,                                                  
    soft 20px shadow at 18% opacity. No glassmorphism, no blur-backdrop heroes.                                                 
  - **Motion**: entrance fades (< 700ms), spring easing on CTAs, marquee for                                                    
    logo strip. **No floating orbs. No pulse-glow buttons. No gradient-animated                                                 
    text on hero H1.** Respect `prefers-reduced-motion` unconditionally.                                                        
  - **Imagery**: real client screenshots in `public/screenshots/*.webp`, real                                                   
    photos of Chad / SoCal when available. Never stock photography. Never AI                                                    
    hero imagery.                                                                                                               
  - **Anti-references**: v0/Lovable/Cursor-default dark gradient templates.                                                     
    Pastel SaaS sites. WordPress business themes. Rainbow-gradient AI-startup                                                   
    homepages. "Abstract tech" hero illustrations.                                                                              
                                                                                                                                
  ### Design Principles                                                                                                         
  1. **Ship signal, not noise.** Every element earns its place.                                                                 
  2. **Calm credibility beats flashy confidence.** A boring section that                                                        
     converts > a beautiful section that doesn't.                                                                               
  3. **The site IS the portfolio.** If the marketing site has jank, no one                                                      
     believes the consultant can build a clean one.                                                                             
  4. **Proof over claims.** Show the live demo, name the client, cite the                                                       
     metric. Don't say "faster" — say "40% more appointments at Fix It San                                                      
     Clemente."                                                                                                                 
  5. **Speed is felt.** LCP under 2.0s, hero JS under 60 KB, zero layout shift.                                                 
  6. **Clarity over cleverness.** Scannable copy. Outcomes over jargon. If a                                                    
     sentence could appear on 100 other AI consulting sites, rewrite it.                                                        
                                                                                             
  ### Content & Voice                                                                                                           
  - Builder voice: "We build a FreeSWITCH + OpenAI Realtime voice agent that                                                    
    books appointments." NOT: "Revolutionize your customer engagement with                                                      
    AI-powered voice solutions."                                                                                                
  - Always concrete: name tools, name clients, name dollar amounts, name weeks.                                                 
  - First-person plural ("we"), not third-person ("Stack Consulting AI").                                                       
  - Never: "leverage," "synergize," "unlock," "transform," "empower," "solutions                                                
    provider," "cutting-edge," "next-generation," "in today's world."                                                           
                                                                                                                                
  ### Signature Moments (what makes this site NOT generic)                                                                      
  1. **Live AI call demo** (`/#call-me`) — visitor enters phone number, real                                                    
     FreeSWITCH instance places an outbound call, OpenAI Realtime agent talks                                                   
     to them. This is the single biggest differentiator and should be                                                           
     prominently featured above the fold.                                                                                       
  2. **Client logo strip** — real clients, real names, real links. Not icons.                                                   
  3. **"Bad stack vs better stack" comparison** — light/navy split panel,                                                       
     specific pain points the reader recognizes.                                                                                
  4. **Real metrics in testimonials** — "40% more appointments," "2x lead                                                       
     volume" — pulled as stat callouts next to the quote.                                                                       
                                                                                                                                
  ### Section Canon (homepage)                                                                                                  
  Order matters — this is the conversion flow:                                                                                  
  1. Hero (H1 + subhead + 2 CTAs: "Try live AI demo" + "Talk to Chad")                                                          
  2. ClientLogoStrip (infinite marquee, real client names)                                                                      
  3. CallMeDemo (the signature interactive)                                                                                     
  4. StackComparison (old stack vs better stack)                                                                                
  5. Services (split-layout: sticky copy left, service list right)                                                              
  6. Portfolio (real screenshots, grid)                                                                                         
  7. Testimonials (featured quote + stat callout, then 2 secondary)                                                             
  8. SiteAuditCTA (existing lead-gen tool)                                                                                      
  9. Newsletter (The Stack Report)                                                                                              
  10. FAQ (accordion, 6 questions)                                                                                              
  11. ContactForm (full qualifying form)                                                                                        
  12. FinalCTA (navy banner, blue button)                                                                                       
  13. Footer                                                                                                                    
                                                                                                                                
  ### Conversion Hierarchy                                                                                                      
  1. **Primary goal**: visitor books a discovery call (ContactForm or Calendly)                                                 
  2. **Secondary goal**: visitor tries the live AI call demo (becomes a real                                                    
     lead because we have their phone number)                                                                                   
  3. **Tertiary goal**: visitor subscribes to The Stack Report newsletter                                                       
                                                                                                                                
  ### Accessibility                                                                                                             
  - WCAG AA minimum (4.5:1 body, 3:1 large text/UI)                                                                             
  - Keyboard navigation on all interactive elements                                          
  - Semantic HTML, proper heading hierarchy, `aria-expanded` on accordions                                                      
  - `prefers-reduced-motion` kills marquee, fade-ins, and gradient-shift                                                        
  - Skip-nav link at top of body                     
                                                                                                                                
  ### Performance Targets                                                                                                       
  - Lighthouse Performance ≥ 95 on mobile                                                                                       
  - LCP < 2.0s, CLS < 0.1, INP < 200ms                                                                                          
  - Hero bundle < 60 KB JS                                                                                                      
  - All above-the-fold images `priority`, WebP, correctly sized                              
                                                                                                                                
  ### Token System                                   
  `app/globals.css` uses the shadcn/ui CSS-custom-property pattern. Key tokens:                                                 
  - `--background: 0 0% 100%` (white)                                                                                           
  - `--foreground: 0 0% 0%` (black)                                                                                             
  - `--primary: 217 100% 9%` (navy)                                                                                             
  - `--accent: 225 85% 59%` (brand blue)                                                     
  - `--muted: 240 33% 97%` (soft grey)                                                                                          
  - `--radius: 0.375rem`                                                                                                        
                                                                                                                                
  Tailwind literals (preferred for component code):                                                                             
  `navy-900`, `navy-800`, `navy-700`, `brand`, `brand-hover`, `brand-soft`, `soft`.                                             
                                                                                                                                
  ### When in doubt                                                                                                             
  Look at https://retellai.com/, https://linear.app/, or https://vercel.com/home                                                
  for composition references. Look at the existing `components/Portfolio.tsx`                                                   
  and `components/Testimonials.tsx` for tone. Do NOT look at generic AI                                                         
  startup templates.                                                          

  ---

  ## Codebase Architecture

  ### Stack
  Next.js 15 App Router · React 19 · TypeScript 5.7 · Tailwind v3 (NOT v4 — `@tailwindcss/postcss` is installed but config is v3-style in `tailwind.config.ts`) · Supabase (Postgres + RLS) · Resend (email) · Anthropic SDK + Google GenAI · Vercel hosting.

  ### Top-level layout
  - `app/` — App Router pages, layouts, API routes
  - `components/` — flat directory (no subfolders), one component per file, all PascalCase. Imported via `@/components/*` path alias
  - `lib/` — server-side helpers: Supabase client (`supabase.ts`), Anthropic extractor (`claude-extract.ts`), Gemini video extractor (`gemini-video-extract.ts`), Resend wrapper (`email.ts`), DB access modules (`assessments-db.ts`, `newsletter-issues-db.ts`), tool catalog, prompt scripts, schemas
  - `migrations/` — hand-applied SQL files; see `migrations/README.md`. **No migration runner** — paste into Supabase SQL Editor manually before deploying dependent code
  - `docs/` — `pbx-operations.md` (FreeSWITCH live demo backend), PRDs, handoff notes
  - `public/screenshots/` — real client portfolio screenshots (WebP)
  - `types/` — shared TypeScript types

  ### App Router conventions
  - Single root `app/layout.tsx` injects GA4 (`G-GKBVKQ49ND`) + GTM (`GTM-5N9G6XQ4`) via `next/script lazyOnload`, plus skip-link target. Don't duplicate analytics in child layouts.
  - `app/page.tsx` is the homepage and composes the section canon listed above.
  - Marketing pages live under `app/services/<slug>/` and `app/services/ai-consulting-<city>/` — geo-variant landing pages share the `CityAiConsultingPage` component.
  - Lead-gen tools live under `app/tools/<tool>/` with matching API at `app/api/<tool>/route.ts`. Pattern: client wizard component (e.g. `components/AutomationFinder.tsx`) → POST → API route runs analysis → writes lead to Supabase → emails Chad via Resend.
  - The Stack Report newsletter: `app/stack-report/` (index + `[slug]`), `app/api/newsletter/{generate,publish,route}` for admin-protected generation. Issues stored in Supabase (`newsletter_issues` table).

  ### Signature live demo (`/#call-me`)
  `components/CallMeDemo.tsx` (or equivalent) → `POST /api/call-me/route.ts` → triggers FreeSWITCH on **fspbx (107.175.53.217 / Tailscale 100.78.119.28)** to place an outbound OpenAI Realtime call to the visitor. Backend operations live in `docs/pbx-operations.md`. FusionPBX dialplans are stored in **Postgres + `/var/cache/fusionpbx/`**, not in XML files — never edit XML directly.

  ### Supabase
  - Client: `lib/supabase.ts` (anon key, RLS-enforced)
  - Tables touched by app code: `contact_submissions`, `tools_*`, `assessments`, `newsletter_issues`, plus lead tables created per tool
  - Schema-cache error `Could not find the 'X' column of 'Y'` = a `migrations/*.sql` file was committed but never run in Supabase. Apply manually before redeploying.

  ### Environment variables
  Local: `.env.local` (gitignored). Production: set in Vercel dashboard. Required at minimum:
  - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `GOOGLE_PAGESPEED_API_KEY` (Site Audit tool — referrer-restricted key will fail server-side calls)
  - `ANTHROPIC_API_KEY`, `GOOGLE_GENAI_API_KEY` (newsletter generation, assessment extraction)
  - `RESEND_API_KEY` (lead notifications)
  - `NEWSLETTER_ADMIN_SECRET` (gates `/api/newsletter/generate` and `/publish`)
  - PBX/FreeSWITCH webhook secrets for `/api/call-me`

  ### Commands
  ```bash
  npm run dev      # next dev on :3000
  npm run build    # ALWAYS run before pushing — Vercel build matches local
  npm run lint     # next lint (eslint-config-next)
  npm start        # production server (rare; Vercel handles prod)
  ```
  No test runner is wired up — verification is `npm run build` + manual browser check.

  ### Deploy
  Push to `main` on GitHub → Vercel auto-deploys. Branch must be up-to-date with `origin/main` before pushing (the session frequently drifts behind). Run `git pull --rebase` first when status shows "behind".

  ### Path alias
  `@/*` → repo root (see `tsconfig.json`). Use `@/components/Foo`, `@/lib/foo`, never relative `../../`.

  ### Tailwind tokens
  Brand colors are exposed as both CSS custom properties (`hsl(var(--accent))` in `app/globals.css`) and Tailwind literals (`navy-900`, `brand`, `brand-soft`, `soft`) in `tailwind.config.ts`. Prefer the literals in component code; the CSS vars exist for shadcn-style overrides.

  ### Things that bite
  - Tailwind is v3 — don't reach for v4-only syntax even though `@tailwindcss/postcss` is in deps.
  - Migrations don't auto-apply. Apply SQL in Supabase **before** pushing dependent code or production breaks while local works.
  - GA4 + GTM both run; don't add a third analytics script.
  - All static images under `public/screenshots/*` should be **WebP**, optimized, with `priority` set on above-the-fold usages.
  - The homepage section order in this file is the conversion flow — don't reorder casually.

  ## Multi-Model Orchestration

  Three models, three invocation paths. Use the right tool for the job.

  ### Claude (this agent + subagents) — primary
  - Spawn parallel subagents in a single message: `Agent(subagent_type=...)` × N tool calls in one block
  - Use for: architecture, writing, code, repo navigation, anything requiring tool use

  ### OpenAI Codex — wired as MCP server
  - Configured in `.mcp.json` (project root). Restart Claude Code after first install for tools to appear
  - Also callable via Bash: `codex exec --skip-git-repo-check "prompt"`
  - Skills: `/codex-review`, `/codex-adversarial`
  - Use for: adversarial second-opinion on diffs, alternative implementations, GPT-style reasoning

  ### Gemini — Bash wrapper
  - `scripts/ask-gemini.sh "prompt"` (auto-loads key from `.env.local`)
  - Pipe context: `cat file.ts | scripts/ask-gemini.sh "explain in 5 bullets"`
  - Model override: `scripts/ask-gemini.sh -m gemini-2.5-pro "prompt"`
  - Use for: 1M-context whole-repo reads, cheap bulk classification, third opinion in ensembles
  - **Key health**: run `scripts/ask-gemini.sh "ping"` to verify. `API_KEY_INVALID` = renew at https://aistudio.google.com/apikey

  ### Patterns

  - **Diversity ensemble** — same prompt → Claude + Codex + Gemini → diff outputs → main agent picks/merges
  - **Adversarial pair** — Claude writes code → `/codex-adversarial` attacks → fix loop
  - **Long-context cascade** — Gemini reads 1M-token corpus, returns summary → Claude acts on summary
  - **Cost cascade** — Gemini Flash triages backlog → Claude Opus handles flagged items only

  ### When to use which
  | Job | First choice |
  |---|---|
  | Code edits in this repo | Claude (native) |
  | Diff review / find bugs in PR | Codex (`/codex-review`) |
  | Read 50+ files at once | Gemini (1M context) |
  | Alternative implementation | Codex via MCP |
  | Bulk text classification | Gemini Flash |
  | Cross-cutting refactor | Claude subagents in parallel |                                                          
