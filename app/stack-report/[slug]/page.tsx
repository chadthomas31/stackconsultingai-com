import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, Calendar, Clock, ExternalLink, Home } from "lucide-react";
import {
  getIssueBySlug,
  listIssueSlugs,
} from "@/lib/newsletter-issues-db";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await listIssueSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const issue = await getIssueBySlug(slug);
  if (!issue) {
    return { title: "Issue not found — The Stack Report" };
  }
  const url = `https://stackconsultingai.com/stack-report/${issue.slug}`;
  const heroImage = issue.hero_image
    ? `https://stackconsultingai.com${issue.hero_image}`
    : undefined;

  return {
    title: `${issue.subject} — The Stack Report`,
    description: issue.preheader,
    keywords: issue.keywords ?? undefined,
    alternates: { canonical: url },
    openGraph: {
      title: issue.subject,
      description: issue.preheader,
      url,
      type: "article",
      publishedTime: issue.published_at,
      modifiedTime: issue.date_modified ?? issue.published_at,
      authors: issue.author_name ? [issue.author_name] : undefined,
      images: heroImage
        ? [{ url: heroImage, alt: issue.hero_image_alt ?? issue.subject }]
        : undefined,
    },
    twitter: {
      card: heroImage ? "summary_large_image" : "summary",
      title: issue.subject,
      description: issue.preheader,
      images: heroImage ? [heroImage] : undefined,
    },
  };
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "America/Los_Angeles",
  });
}

export default async function StackReportIssuePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const issue = await getIssueBySlug(slug);
  if (!issue) notFound();

  const url = `https://stackconsultingai.com/stack-report/${issue.slug}`;
  const heroImage = issue.hero_image
    ? `https://stackconsultingai.com${issue.hero_image}`
    : undefined;
  const isArticle = issue.content_type === "article";
  const authorName = issue.author_name ?? "Stack Consulting AI";

  // Always emit a valid ISO 8601 date — fall back through published_at, then a
  // hardcoded site launch date so the schema never carries null/empty dates.
  const SITE_LAUNCH_ISO = "2026-01-01T00:00:00-08:00";
  const toIso = (value?: string | null): string | undefined => {
    if (!value) return undefined;
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
  };
  const datePublished =
    toIso(issue.source_published_at) ??
    toIso(issue.published_at) ??
    SITE_LAUNCH_ISO;
  const dateModified =
    toIso(issue.date_modified) ?? datePublished;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": isArticle ? "BlogPosting" : "Article",
    headline: issue.subject,
    description: issue.preheader,
    image: heroImage ?? "https://stackconsultingai.com/og-image.png",
    datePublished,
    dateModified,
    author: issue.author_name
      ? {
          "@type": "Person",
          name: issue.author_name,
          ...(issue.author_role && { jobTitle: issue.author_role }),
          url: "https://stackconsultingai.com",
        }
      : {
          "@type": "Organization",
          name: "Stack Consulting AI",
          url: "https://stackconsultingai.com",
        },
    publisher: {
      "@type": "Organization",
      "@id": "https://stackconsultingai.com/#organization",
      name: "Stack Consulting AI",
      url: "https://stackconsultingai.com",
      logo: {
        "@type": "ImageObject",
        url: "https://stackconsultingai.com/stack-logo.png",
      },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    isBasedOn: issue.source_video_url ?? undefined,
    articleSection: issue.category ?? "The Stack Report",
    keywords: issue.keywords?.join(", "),
  };

  const faqSchema =
    issue.faqs && issue.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: issue.faqs.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }
      : null;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://stackconsultingai.com" },
      { "@type": "ListItem", position: 2, name: "The Stack Report", item: "https://stackconsultingai.com/stack-report" },
      { "@type": "ListItem", position: 3, name: issue.subject, item: url },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main className="min-h-screen bg-white text-navy-900 pb-24 pt-24">
        <article className="max-w-3xl mx-auto px-4 pt-10 md:pt-16">
          <nav aria-label="Article navigation" className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-brand hover:text-brand-hover font-semibold"
            >
              <Home className="w-4 h-4" />
              Home
            </Link>
            <Link
              href="/stack-report"
              className="inline-flex items-center gap-1.5 text-sm text-brand hover:text-brand-hover font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              All issues
            </Link>
          </nav>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand/10 border border-brand/25 text-brand text-xs font-semibold tracking-[0.16em] uppercase mb-5">
            {isArticle
              ? issue.category ?? "Article"
              : `The Stack Report · Issue #${issue.issue_number}`}
          </div>

          <h1 className="font-heading text-3xl md:text-5xl font-bold tracking-tight leading-[1.1] mb-5">
            {issue.subject}
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-6">
            {issue.preheader}
          </p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground mb-10 pb-8 border-b border-border">
            {issue.author_name && (
              <span className="font-semibold text-navy-900">
                {issue.author_name}
                {issue.author_role && (
                  <span className="font-normal text-muted-foreground">
                    {" · "}
                    {issue.author_role}
                  </span>
                )}
              </span>
            )}
            <time
              className="inline-flex items-center gap-1.5"
              dateTime={issue.source_published_at ?? issue.published_at}
              title={
                issue.source_published_at
                  ? `Source video published ${formatDate(issue.source_published_at)} · This issue posted ${formatDate(issue.published_at)}`
                  : undefined
              }
            >
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(issue.source_published_at ?? issue.published_at)}
            </time>
            {issue.reading_time && (
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {issue.reading_time}
              </span>
            )}
            {issue.source_channel && (
              <span>Source: {issue.source_channel}</span>
            )}
          </div>

          {issue.hero_image && (
            <div className="mb-10 rounded-md overflow-hidden border border-border bg-soft flex items-center justify-center">
              <Image
                src={issue.hero_image}
                alt={issue.hero_image_alt ?? issue.subject}
                width={1024}
                height={1536}
                priority
                sizes="(max-width: 768px) 100vw, 768px"
                className="w-full h-auto max-h-[900px] object-contain"
              />
            </div>
          )}

          <div className="prose prose-navy max-w-none prose-headings:font-heading prose-headings:tracking-tight prose-headings:text-navy-900 prose-h1:hidden prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-h2:pb-2 prose-h2:border-b prose-h2:border-border prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-p:leading-relaxed prose-p:text-[0.975rem] prose-li:text-[0.975rem] prose-li:leading-relaxed prose-a:text-brand prose-a:no-underline hover:prose-a:underline prose-strong:text-navy-900 prose-hr:border-border">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                a: ({ href, children, ...props }) => {
                  const isExternal =
                    href?.startsWith("http") &&
                    !href.includes("stackconsultingai.com");
                  if (isExternal) {
                    return (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        {...props}
                      >
                        {children}
                      </a>
                    );
                  }
                  return (
                    <a href={href} {...props}>
                      {children}
                    </a>
                  );
                },
              }}
            >
              {issue.markdown_body}
            </ReactMarkdown>
          </div>

          {issue.source_video_url && (
            <div className="mt-12 p-5 rounded-md border border-border bg-soft">
              <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground font-semibold mb-2">
                Curated from
              </div>
              <a
                href={issue.source_video_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-navy-900 font-semibold hover:text-brand"
              >
                {issue.source_video_title || issue.source_video_url}
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              {issue.source_channel && (
                <div className="text-sm text-muted-foreground mt-1">
                  {issue.source_channel}
                </div>
              )}
            </div>
          )}

          {isArticle && (
            <aside className="mt-16 p-8 rounded-md border border-border bg-soft">
              <h2 className="font-heading text-2xl font-bold text-navy-900 mb-3">
                Want help applying this to your business?
              </h2>
              <p className="text-base text-muted-foreground mb-6 leading-relaxed">
                We build practical AI workflows for small businesses across
                Orange County and Southern California. Start with a free AI
                readiness audit or see the live AI phone demo.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/ai-readiness-audit"
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-md bg-brand text-white text-sm font-semibold hover:bg-brand-hover transition-colors"
                >
                  Free AI readiness audit
                </Link>
                <Link
                  href="/demos"
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-md border border-navy-900 text-navy-900 text-sm font-semibold hover:bg-navy-900 hover:text-white transition-colors"
                >
                  See it in action
                </Link>
              </div>
            </aside>
          )}

          <div className="mt-16 p-6 md:p-8 rounded-md bg-navy-900 text-white">
            <div className="font-heading text-2xl font-bold mb-2">
              Want this in your inbox every two weeks?
            </div>
            <p className="text-white/80 mb-5 max-w-lg">
              The Stack Report is biweekly. No fluff. Real tools small businesses
              actually use.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/#newsletter"
                className="inline-flex items-center px-5 py-2.5 rounded-md bg-brand hover:bg-brand-hover text-white font-semibold"
              >
                Subscribe
              </Link>
              <Link
                href="/#contact"
                className="inline-flex items-center px-5 py-2.5 rounded-md bg-white/10 hover:bg-white/20 text-white font-semibold"
              >
                Talk to an AI expert
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-md bg-white/10 hover:bg-white/20 text-white font-semibold"
              >
                <Home className="w-4 h-4" />
                Home
              </Link>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-brand hover:text-brand-hover font-semibold"
            >
              <Home className="w-4 h-4" />
              Back to home
            </Link>
            <Link
              href="/stack-report"
              className="inline-flex items-center gap-1.5 text-brand hover:text-brand-hover font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              All issues
            </Link>
          </div>
        </article>
      </main>
    </>
  );
}
