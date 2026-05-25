import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Rss, ArrowRight } from "lucide-react";
import { listIssues } from "@/lib/newsletter-issues-db";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "The Stack Report — Stack Consulting AI",
  description:
    "Biweekly dispatch from Stack Consulting AI. Trending GitHub repos, AI tooling, and real small-business automation wins — no hype.",
  alternates: { canonical: "https://stackconsultingai.com/stack-report" },
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "America/Los_Angeles",
  });
}

export default async function StackReportIndexPage() {
  const issues = await listIssues();
  const featured = issues.filter((i) => i.hero_image).slice(0, 4);
  const featuredIds = new Set(featured.map((i) => i.id));
  const rest = issues.filter((i) => !featuredIds.has(i.id));

  return (
    <>
      <main className="min-h-screen bg-white text-navy-900 pb-24 pt-24">
        <section className="max-w-5xl mx-auto px-4 pt-12 md:pt-20 pb-12 border-b border-border">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand/10 border border-brand/25 text-brand text-xs font-semibold tracking-[0.16em] uppercase mb-5">
            <Rss className="w-3 h-3" />
            Biweekly dispatch + long-form articles
          </div>
          <h1 className="font-heading text-4xl md:text-6xl font-bold tracking-tight leading-[1.05] mb-5">
            The Stack Report
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed mb-8">
            What actually shipped on GitHub. What tools are worth your time.
            What small businesses in Southern California are automating right
            now. Plus long-form articles on AI for small business — no hype.
          </p>
          <Link
            href="/#newsletter"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-brand hover:bg-brand-hover text-white font-semibold"
          >
            Subscribe
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>

        {featured.length > 0 && (
          <section className="max-w-5xl mx-auto px-4 pt-12">
            <h2 className="font-heading text-xs font-semibold tracking-[0.18em] uppercase text-muted-foreground mb-6">
              Featured
            </h2>
            <ul className="grid gap-8 md:grid-cols-2">
              {featured.map((issue) => (
                <li
                  key={issue.id}
                  className="group rounded-md border border-border bg-white overflow-hidden transition-all hover:border-navy-900 hover:shadow-[0_0_20px_rgba(0,0,0,0.06)]"
                >
                  <Link
                    href={`/stack-report/${issue.slug}`}
                    className="block"
                  >
                    <div className="relative aspect-[3/2] w-full bg-soft">
                      <Image
                        src={issue.hero_image as string}
                        alt={issue.hero_image_alt ?? issue.subject}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <span className="inline-block text-xs font-semibold tracking-[0.14em] uppercase text-brand mb-3">
                        {issue.category ??
                          (issue.content_type === "article"
                            ? "Article"
                            : `Issue #${issue.issue_number}`)}
                      </span>
                      <h3 className="font-heading text-xl md:text-2xl font-bold leading-tight mb-3 group-hover:text-brand transition-colors">
                        {issue.subject}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                        {issue.preheader}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                          {formatDate(
                            issue.source_published_at ?? issue.published_at,
                          )}
                        </span>
                        {issue.reading_time && (
                          <span>{issue.reading_time}</span>
                        )}
                      </div>
                      <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand">
                        Read{" "}
                        {issue.content_type === "article"
                          ? "article"
                          : "issue"}{" "}
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="max-w-5xl mx-auto px-4 pt-12">
          {issues.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <p className="text-lg">The first issue is on its way.</p>
              <Link
                href="/#newsletter"
                className="inline-block mt-4 text-brand hover:text-brand-hover font-semibold"
              >
                Subscribe to get notified →
              </Link>
            </div>
          ) : rest.length > 0 ? (
            <>
              <h2 className="font-heading text-xs font-semibold tracking-[0.18em] uppercase text-muted-foreground mb-6">
                All issues
              </h2>
              <ul className="divide-y divide-border">
                {rest.map((issue) => (
                  <li key={issue.id} className="py-8 first:pt-0">
                    <Link
                      href={`/stack-report/${issue.slug}`}
                      className="group block"
                    >
                      <div className="flex items-baseline gap-3 text-xs text-muted-foreground mb-2">
                        <span className="font-semibold tracking-[0.16em] uppercase text-brand">
                          {issue.category ??
                            (issue.content_type === "article"
                              ? "Article"
                              : `Issue #${issue.issue_number}`)}
                        </span>
                        <span>·</span>
                        <time
                          dateTime={
                            issue.source_published_at ?? issue.published_at
                          }
                        >
                          {formatDate(
                            issue.source_published_at ?? issue.published_at,
                          )}
                        </time>
                      </div>
                      <h3 className="font-heading text-2xl md:text-3xl font-bold tracking-tight leading-tight mb-2 group-hover:text-brand transition-colors">
                        {issue.subject}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed max-w-3xl">
                        {issue.preheader}
                      </p>
                      <div className="mt-3 inline-flex items-center gap-1.5 text-sm text-brand font-semibold">
                        Read{" "}
                        {issue.content_type === "article"
                          ? "article"
                          : "issue"}
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </section>
      </main>
    </>
  );
}
