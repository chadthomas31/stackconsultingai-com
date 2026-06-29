# The Stack Report - Newsletter Workflow

This document describes the workflow for generating and publishing The Stack Report newsletter issues.

## Overview

The Stack Report is a biweekly newsletter that curates trending GitHub repos, AI tooling, and automation content for small business owners and developers. The newsletter focuses on practical, actionable content with a concrete builder voice.

## Two Generation Modes

### 1. YouTube Video Pipeline (Original)

The original workflow generates newsletter content from a YouTube video about trending repos:

1. Navigate to `/stack-report` admin section
2. Paste YouTube URL
3. System fetches transcript and/or runs Gemini video analysis
4. Claude generates newsletter draft
5. Review and publish

**Entry points:**
- Web UI: Navigate to newsletter admin
- API: `POST /api/newsletter/generate` with `videoUrl`

### 2. Manual Curation Pipeline (New)

For weeks when you want direct control over content without relying on a YouTube video:

1. Edit curated content in `scripts/generate-newsletter-manual.ts`
2. Preview the formatted content
3. Generate newsletter draft with Claude
4. Review and publish

**Scripts:**
- `npm run newsletter:preview` - Preview curated content structure
- `npm run newsletter:generate` - Generate full newsletter draft

## Manual Curation Workflow (Step-by-Step)

### Step 1: Curate Content

Edit the `CURATED_CONTENT_JUNE_29_2026` object in `scripts/generate-newsletter-manual.ts`:

```typescript
const CURATED_CONTENT_JUNE_29_2026: CuratedContent = {
  weekSummary: "One-sentence theme for this week...",
  
  featuredRepos: [
    {
      name: "repo-name",
      url: "https://github.com/owner/repo",
      description: "2-3 sentence builder-voice description...",
      stars: "50k",
      category: "Agent Skills",
    },
    // 4-6 featured repos total
  ],

  quickHits: [
    {
      name: "another-repo",
      url: "https://github.com/owner/repo",
      description: "One punchy sentence.",
      stars: "250 new",
    },
    // 5-8 quick hits total
  ],

  customInstructions: "Theme, audience notes, tone guidance...",
};
```

**Content Guidelines:**
- **Featured repos:** 4-6 repos with detailed 2-3 sentence descriptions
- **Quick hits:** 5-8 repos with punchy one-liners
- **Builder voice:** Concrete, specific, slightly opinionated. Name tools, name what they replace.
- **Audience:** SMB owners + dev-curious folks. Practical value > hype.
- **Banned phrases:** "leverage", "synergize", "unlock", "transform", "empower", "cutting-edge"

### Step 2: Preview Content

Run the preview script to see formatted output without burning API credits:

```bash
npm run newsletter:preview
```

This shows:
- Statistics (repo count, token estimate)
- Formatted transcript that will be sent to Claude
- Custom instructions

Review for:
- Content accuracy
- Brand voice alignment
- Repo URL correctness
- Description quality

### Step 3: Generate Newsletter

Ensure `ANTHROPIC_API_KEY` is set in `.env.local`, then run:

```bash
npm run newsletter:generate
```

The script will:
1. Show content summary
2. Ask for confirmation
3. Generate draft with Claude (using `claude-opus-4-8`)
4. Display subject, preheader, and full markdown body
5. Optionally publish to database

**Output includes:**
- Subject line (≤ 65 chars)
- Preheader (≤ 120 chars)
- Markdown body (~500-900 words)

### Step 4: Review Draft

The generated draft follows this structure:
1. Short intro (1-2 sentences)
2. 3-4 thematic sections with featured items
3. "Quick hits" section with one-liners
4. Sign-off with an ask
5. P.S. citation (credits source)

**Review checklist:**
- [ ] Subject line is punchy and specific
- [ ] Preheader teases 2-3 specific items
- [ ] Repo links are formatted correctly: `**[Name](url)**`
- [ ] Voice is builder-style (not generic AI agency)
- [ ] No banned marketing phrases
- [ ] P.S. credits source appropriately
- [ ] Content is scannable (good headings, short paragraphs)

### Step 5: Publish

If satisfied with the draft, confirm publication when prompted. The script will:
1. Insert into `newsletter_issues` table
2. Auto-generate unique slug
3. Assign next issue number
4. Set metadata (author, reading time, category)

The issue will be immediately visible at:
```
https://stackconsultingai.com/stack-report/{slug}
```

## Database Schema

Newsletter issues are stored in the `newsletter_issues` table with these fields:

```sql
id                   uuid PRIMARY KEY
issue_number         integer UNIQUE
slug                 text UNIQUE
subject              text
preheader            text
markdown_body        text
source_video_id      text (null for manual curation)
source_video_url     text (null for manual curation)
source_video_title   text
source_channel       text
source_published_at  timestamptz
published_at         timestamptz (auto-set)
created_at           timestamptz (auto-set)
hero_image           text (optional)
hero_image_alt       text (optional)
category             text (e.g. "GitHub Trending")
keywords             text[] (optional)
reading_time         text (e.g. "4 min read")
author_name          text (default "Chad McCluskey")
author_role          text (default "Founder, Stack Consulting AI")
faqs                 jsonb (optional)
date_modified        timestamptz (optional)
content_type         text (default "digest")
```

## API Endpoints

### Generate from YouTube
```bash
POST /api/newsletter/generate
Content-Type: application/json
X-Admin-Secret: <NEWSLETTER_ADMIN_SECRET>

{
  "videoUrl": "https://www.youtube.com/watch?v=...",
  "customInstructions": "Optional guidance...",
  "mode": "auto" | "transcript-only" | "force-gemini"
}
```

### Publish Issue
```bash
POST /api/newsletter/publish
Content-Type: application/json
X-Admin-Secret: <NEWSLETTER_ADMIN_SECRET>

{
  "subject": "...",
  "preheader": "...",
  "markdown_body": "...",
  "source_video_url": "...",
  ...
}
```

### List Issues
```bash
GET /stack-report
```

### View Single Issue
```bash
GET /stack-report/{slug}
```

## Environment Variables

Required:
- `ANTHROPIC_API_KEY` - Claude API key for newsletter generation
- `NEWSLETTER_ADMIN_SECRET` - Gates admin endpoints (optional in dev)

Optional:
- `GOOGLE_GENAI_API_KEY` - For Gemini video analysis (YouTube pipeline)
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key

## Content Sources

**Trending repos:**
- [findarepo.com/trending](https://findarepo.com/trending/) - Daily rankings
- [GitHub Trending](https://github.com/trending)
- ByteByteGo newsletter
- Hacker News trending
- Dev Twitter/X
- YouTube tech channels (original pipeline)

**Quality filters:**
- Practical value for SMB owners / devs
- Agent tooling, automation, self-hosted alternatives
- Concrete over abstract
- Open source over closed
- Skip: deep systems plumbing, very niche crypto, academic novelties (unless wildly clever)

## Brand Voice Reference

**DO:**
- Name the tool, name what it does, name what it replaces
- Be specific: "55k stars", "60-95% smaller", "replaces ElasticSearch"
- Use skepticism when earned: "If you're still paying $X/month for Y..."
- Ask readers to engage: "Reply if any of these would actually help"

**DON'T:**
- Use marketing fluff: "unlock", "transform", "cutting-edge"
- Paraphrase repos verbatim from source videos
- Invent or guess GitHub URLs
- Use stock photography or AI-generated hero images
- Over-explain or write thesis introductions

## Troubleshooting

### "Could not resolve authentication method"
- Ensure `ANTHROPIC_API_KEY` is set in `.env.local`
- Check that `.env.local` is in workspace root
- Restart dev server after adding env vars

### "Schema cache error" on publish
- Run the missing migration in Supabase SQL Editor
- Migrations are in `migrations/` directory
- See `migrations/README.md` for manual application steps

### Newsletter not appearing on index
- Check `published_at` is set (auto-set by `publishIssue()`)
- Verify Supabase RLS policies allow SELECT on `newsletter_issues`
- Wait up to 60s for ISR revalidation

### Generated content doesn't match brand voice
- Update `customInstructions` in curated content object
- Review `SYSTEM_PROMPT` in `lib/newsletter-gen.ts`
- Manually edit draft before publishing

## Future Improvements

- [ ] Web UI for manual curation (form instead of editing TS file)
- [ ] Draft preview in admin panel before publishing
- [ ] Scheduled cron job for automated publication
- [ ] Email distribution via Resend after publish
- [ ] A/B testing for subject lines
- [ ] Analytics: open rate, click rate, conversions
- [ ] Hero image generation for featured repos
- [ ] RSS feed for newsletter issues

## See Also

- `lib/newsletter-gen.ts` - Claude generation logic
- `lib/newsletter-issues-db.ts` - Database helpers
- `app/api/newsletter/generate/route.ts` - YouTube pipeline API
- `app/stack-report/page.tsx` - Public newsletter index
- `CLAUDE.md` - Full brand voice guidelines
