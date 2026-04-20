-- Seed the first Stack Report issue from docs/newsletter-drafts/2026-04-19-github-trending.md
-- Run AFTER 20260420_newsletter_issues.sql
-- Idempotent: uses ON CONFLICT to avoid double-inserts.

INSERT INTO newsletter_issues (
  issue_number,
  slug,
  subject,
  preheader,
  markdown_body,
  source_video_id,
  source_video_url,
  source_video_title,
  source_channel,
  published_at
) VALUES (
  1,
  '2026-04-19-35-trending-github-repos-10-youll-actually-use',
  $S$35 trending GitHub repos, 10 you'll actually use$S$,
  $P$Agent memory that doesn't forget, a Gmail client in 60KB, and a Postgres trick that replaces ElasticSearch.$P$,
  $BODY$# What's trending on GitHub this week

Every two weeks we sit through the open-source firehose so you don't have to. This week: 35 repos that blew up on Hacker News. Below are the 10 that'll actually change how you ship — sorted by "can I use this today?"

---

## Agent productivity — the ones worth installing this week

**1. Hippo-memory** — Every new AI session starts with amnesia. Hippo-memory adds biologically inspired memory with configurable half-lives. Facts the agent uses frequently become permanent; unused facts decay. A "sleep" phase at the end of each session merges and prunes what it learned. If you're building agent workflows, this is the memory layer you've been hand-rolling.

**2. Claudraband (Claudra)** — Wraps Claude Code in T-Mux so your sessions survive closing the terminal. Close your laptop mid-refactor, reopen tomorrow, pick up exactly where you left off. Bonus: an HTTP daemon gives you remote headless control, and your current Claude can query *older* sessions to ask why it made past architectural decisions.

**3. Agents Observe** — Parallel agent execution is impossible to debug from terminal output. Agents Observe installs as a Claude plugin and spins up a real-time web dashboard — hierarchical tree of parent/child agents, live tool calls, exact files touched, filterable execution output. If you've ever lost a sub-agent in a stack trace, you need this.

---

## Infrastructure you can drop in today

**4. Zerobox** — Cross-platform sandbox CLI in Rust, built on OpenAI Codex's sandboxing engine. Single binary, ~10ms overhead, no Docker required. Give your agent a fake API key; Zerobox intercepts network calls, verifies the destination, and injects the real key. The missing piece for secure agent deployments.

**5. PGEx Search** — Full-text search is usually "spin up ElasticSearch or pay Algolia." PGEx Search is a Postgres extension that puts BM25 search directly inside the database — up to 4x faster than Postgres' native FTS, with proper relevance ranking. One less system to run.

**6. React-Rewrite** — Click any element in your running React dev server, tweak layout/spacing/colors/typography in a sidebar, double-click text to edit inline. Stops the editor↔browser ping-pong when you're polishing UI. Lives entirely as a dev-only overlay, no code changes.

---

## Worth showing a client

**7. BareMail** — Gmail that fits in 60KB. Your browser talks directly to the Gmail API; emails never touch a third-party server. Works on garbage connections where real Gmail refuses to load. Plug in a Google Cloud API key and go. Elegant demonstration of what a web app *should* weigh.

**8. Bright Bean Studio** — Self-hostable alternative to Buffer/Hootsuite. Schedule across 12 platforms (TikTok, Threads, Bluesky, Mastodon included) from one dashboard. Multi-stage approval workflows via magic links — clients need zero accounts. Visual drag-and-drop calendar. Built for agencies.

---

## The quietly important ones

**9. Decision Node** — Universal shared memory store for every AI agent on your team. Record a decision once via CLI → saved as structured JSON + embedded as a vector. Connect any tool via MCP → semantic search over your decision history. If your AI tries to contradict a past architectural call, it gets flagged before the contradiction lands in the codebase.

**10. Dinobase** — Ask an AI agent a cross-platform business question and it blows out its context window making paginated Stripe + HubSpot + Zendesk calls. Dinobase syncs all your SaaS APIs into a unified DuckDB schema. One SQL query joins data across platforms. This is going to be table stakes for analytics agents within a year.

---

## Also on the radar

- **Git-bisect (Bayesian)** — solves flaky-test git-bisect with Bayesian inference
- **Kiyeovo** — peer-to-peer desktop messenger, fully airgapped (Tor-routed anonymous mode)
- **Raincast** — Telegram proxy in Zig that disguises traffic as TLS 1.3
- **Pegboard** — an IDE with spec-driven development baked in
- A **3D raycasting engine running inside a TrueType font's hinting VM**, because someone thought it should exist

---

## What we're watching for you

If even one of these ten shortens your week by a morning, we did our job.

Reply if any of these would actually help you and don't know where to start — we'll spin it up on a demo call and walk you through it.

— Chad & the team
[stackconsultingai.com](https://stackconsultingai.com)

*P.S. — This roundup was curated from the **Hacker News Show #4** episode on the GitHub Awesome channel. Their 15-minute rundown is worth the watch: [youtube.com/watch?v=mYU9vcvL-yk](https://www.youtube.com/watch?v=mYU9vcvL-yk)*
$BODY$,
  'mYU9vcvL-yk',
  'https://www.youtube.com/watch?v=mYU9vcvL-yk',
  'Hacker News Show #4',
  'GitHub Awesome',
  '2026-04-19 12:00:00-07'
)
ON CONFLICT (issue_number) DO NOTHING;
