# Stack Report Content Guide

How to publish long-form articles + newsletter issues to `/stack-report`.
Single content surface. Both digests and articles live in Supabase
`newsletter_issues`. Distinguished by `content_type` column.

---

## Image specs (hero / infographic)

All hero images go in `public/stack-report/<slug>.<ext>`.

| Use case | Dimensions | Aspect | Use for |
|---|---|---|---|
| **Portrait infographic** | **1024×1536** | 2:3 tall | Vertical lists, "5 ways", numbered steps, stat stacks |
| **Landscape hero** | **1600×900** | 16:9 | Photos, screenshots, scene-setting |
| **Square** | **1200×1200** | 1:1 | Logos, single-subject illustrations, social-friendly |
| **Card-only thumbnail** | **1200×800** | 3:2 | Override when index card needs different framing than hero |

**Article page** renders hero at natural aspect ratio (`object-contain`, max-height 900px). No crop.

**Index card** force-crops to 3:2 with `object-top` — title portion of portrait infographics stays visible.

### Open Graph (social preview) image — separate field, optional

OG cards always render landscape **1200×630** on Twitter/LinkedIn/Slack.
A 2:3 portrait infographic will get center-cropped badly on social.

If your hero is portrait: also create a `<slug>-og.png` at **1200×630**
landscape (the title + key visual recomposed for horizontal viewing).
We're not wiring this up yet — current setup uses the hero image directly.
Add an `og_image` column to `newsletter_issues` when needed.

---

## File format + size budget

| Format | When | Max file size |
|---|---|---|
| **WebP** | Default — photos, photo-realistic AI images | **400 KB** |
| **PNG** | Graphics with text, sharp edges, transparency | **600 KB** |
| **JPG** | Acceptable fallback for photos | **400 KB** |
| **SVG** | Logos, icons, simple illustrations | **20 KB** |

**Convert PNG → WebP if file > 600 KB:**
```bash
cwebp -q 85 input.png -o output.webp
# or via ImageMagick:
magick input.png -quality 85 output.webp
```

Current example article (`5-ways-ai-small-business.png`) is 2.3 MB — should be re-exported as WebP at ~300 KB on next pass.

---

## File path + naming

```
public/stack-report/<slug>.<ext>
```

Rules:
- `<slug>` matches the article slug in Supabase (kebab-case)
- One canonical hero per article
- Avoid spaces, capitals, special chars in filenames
- Add `-og.png` suffix for separate Open Graph image (future)

**Examples:**
```
public/stack-report/5-ways-ai-small-business.png         (hero)
public/stack-report/ai-receptionist-roi.webp             (hero)
public/stack-report/ai-receptionist-roi-og.png           (future OG)
```

---

## Alt text rules

`hero_image_alt` column. Required.

- Describe what the image shows, not "image of …"
- Front-load the target SEO keyword when natural
- 80–150 characters
- No "Stack Consulting AI" or brand stuffing

**Good:**
> "Infographic showing 5 ways AI for small business without replacing staff helps Orange County teams work smarter"

**Bad:**
> "Image of infographic" / "AI image" / "Stack Consulting AI Stack Report AI for Small Business hero image"

---

## Publishing an article — SQL template

Articles get `content_type = 'article'`. Digests stay `content_type = 'digest'`.

Run in Supabase SQL Editor (or via Claude with Supabase MCP).

```sql
INSERT INTO newsletter_issues (
  issue_number, slug, subject, preheader, markdown_body,
  hero_image, hero_image_alt, category, keywords, reading_time,
  author_name, author_role, faqs, content_type,
  published_at, date_modified
) VALUES (
  COALESCE((SELECT MAX(issue_number) + 1 FROM newsletter_issues), 1),
  'your-article-slug-here',
  'Your Article Title',
  'One-sentence summary for SERP + social preview. 140-160 chars ideal.',
  $body$
## H2 first — H1 comes from `subject` column

Your markdown body. Use H2/H3, not H1. Internal links as `/path` not full URLs.
External links auto-get rel="noopener noreferrer nofollow".

  $body$,
  '/stack-report/your-article-slug-here.webp',
  'Descriptive alt text with target keyword',
  'Category Name',
  ARRAY['primary keyword','secondary kw','tertiary kw'],
  '7 min read',
  'Chad McCluskey',
  'Founder, Stack Consulting AI',
  $faqs$[
    {"question": "Q1?", "answer": "A1."},
    {"question": "Q2?", "answer": "A2."}
  ]$faqs$::jsonb,
  'article',
  '2026-MM-DDT16:00:00Z',  -- 16:00 UTC = 9am PT (renders correct day in LA timezone)
  '2026-MM-DDT16:00:00Z'
);
```

**Important:**
- Use `16:00:00Z` not `00:00:00Z` for dates — midnight UTC renders as previous day in PT.
- Use H2 (`##`) as top-level heading in `markdown_body`. The H1 comes from `subject`.
- 5+ FAQs ideal for FAQPage rich-result eligibility. JSONB array of `{question, answer}`.
- Slug must be unique. URL = `/stack-report/<slug>`.

---

## What renders automatically

Once row is inserted, `/stack-report/<slug>` renders:

- **BlogPosting JSON-LD** (Person author, Organization publisher, dates, image, keywords)
- **FAQPage JSON-LD** (when `faqs` populated — drives FAQ rich result in Google)
- **BreadcrumbList JSON-LD** (Home → Stack Report → Article)
- **OpenGraph + Twitter cards** w/ hero image
- **Canonical URL** = `https://stackconsultingai.com/stack-report/<slug>`
- **CTA aside** linking to `/ai-readiness-audit` + `/demos` (articles only, not digests)
- **Sitemap entry** auto-added by `app/sitemap.ts`

ISR revalidate = 60s. New articles appear within a minute of insert.

---

## Updating an article

Re-run the same `INSERT` with `ON CONFLICT (slug) DO UPDATE SET ...` clause
(see `migrations/20260524_seed_5_ways_article.sql` for full upsert template).
Idempotent. Always bumps `date_modified` automatically when you supply it.

---

## Checklist before publishing

- [ ] Hero image in `public/stack-report/<slug>.webp` (or .png)
- [ ] Image under size budget (400 KB WebP / 600 KB PNG)
- [ ] Alt text written
- [ ] H1 NOT in markdown body (lives in `subject`)
- [ ] All internal links use absolute paths (`/services/foo` not `https://…`)
- [ ] 5+ FAQs for rich-result eligibility
- [ ] Primary keyword in: title, preheader, H1, first H2, alt text, first 100 words
- [ ] Reading time set (rough rule: 250 words/min)
- [ ] Category set (used as kicker on page + index card)
- [ ] `content_type = 'article'` (not 'digest')
- [ ] Pub date uses `16:00:00Z` UTC (LA timezone day-correct)

---

## Architecture reference

- **Migration that added rich-content columns**: `migrations/20260524_newsletter_rich_content.sql`
- **First article seed (canonical template)**: `migrations/20260524_seed_5_ways_article.sql`
- **DB module**: `lib/newsletter-issues-db.ts` — `NewsletterIssue` type, `publishIssue()`, `listIssues()`, `getIssueBySlug()`, `listIssueSlugs()`
- **Article page**: `app/stack-report/[slug]/page.tsx` — SSG via `generateStaticParams`, ISR 60s
- **Index page**: `app/stack-report/page.tsx` — featured grid (issues w/ `hero_image`) + list (rest)
- **Sitemap**: `app/sitemap.ts` — auto-includes all issues
- **Redirects**: `next.config.js` — `/blog/* → /stack-report/*` (legacy, can remove after 90 days)
