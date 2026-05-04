import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, ExternalLink } from "lucide-react";
import {
  getIssueBySlug,
  listIssueSlugs,
} from "@/lib/newsletter-issues-db";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
  return {
    title: `${issue.subject} — The Stack Report`,
    description: issue.preheader,
    openGraph: {
      title: issue.subject,
      description: issue.preheader,
      type: "article",
      publishedTime: issue.published_at,
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

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: issue.subject,
    description: issue.preheader,
    datePublished: issue.source_published_at ?? issue.published_at,
    dateModified: issue.published_at,
    author: {
      "@type": "Organization",
      name: "Stack Consulting AI",
      url: "https://stackconsultingai.com",
    },
    publisher: {
      "@type": "Organization",
      name: "Stack Consulting AI",
      url: "https://stackconsultingai.com",
      logo: {
        "@type": "ImageObject",
        url: "https://stackconsultingai.com/stack-logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://stackconsultingai.com/stack-report/${issue.slug}`,
    },
    isBasedOn: issue.source_video_url ?? undefined,
    articleSection: "The Stack Report",
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white text-navy-900 pb-24 pt-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <article className="max-w-3xl mx-auto px-4 pt-10 md:pt-16">
        <Link
          href="/stack-report"
          className="inline-flex items-center gap-1.5 text-sm text-brand hover:text-brand-hover font-semibold mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          All issues
        </Link>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand/10 border border-brand/25 text-brand text-xs font-semibold tracking-[0.16em] uppercase mb-5">
          The Stack Report · Issue #{issue.issue_number}
        </div>

        <h1 className="font-heading text-3xl md:text-5xl font-bold tracking-tight leading-[1.1] mb-5">
          {issue.subject}
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-6">
          {issue.preheader}
        </p>

        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-10 pb-8 border-b border-border">
          <time
            dateTime={issue.source_published_at ?? issue.published_at}
            title={
              issue.source_published_at
                ? `Source video published ${formatDate(issue.source_published_at)} · This issue posted ${formatDate(issue.published_at)}`
                : undefined
            }
          >
            {formatDate(issue.source_published_at ?? issue.published_at)}
          </time>
          {issue.source_channel && (
            <>
              <span>·</span>
              <span>Source: {issue.source_channel}</span>
            </>
          )}
        </div>

        <div className="prose prose-navy max-w-none prose-headings:font-heading prose-headings:tracking-tight prose-h1:text-3xl prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-h2:pb-2 prose-h2:border-b prose-h2:border-border prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-p:leading-relaxed prose-p:text-[0.975rem] prose-li:text-[0.975rem] prose-li:leading-relaxed prose-a:text-brand prose-a:no-underline hover:prose-a:underline prose-strong:text-navy-900 prose-hr:border-border">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              a: ({ href, children, ...props }) => {
                const isExternal = href?.startsWith("http");
                return (
                  <a
                    href={href}
                    {...(isExternal
                      ? {
                          target: "_blank",
                          rel: "noopener noreferrer",
                        }
                      : {})}
                    {...props}
                  >
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
          </div>
        </div>
      </article>
      </main>
      <Footer />
    </>
  );
}
