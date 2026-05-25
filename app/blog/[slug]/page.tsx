import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { getArticleBySlug, listArticleSlugs } from "@/lib/articles";

export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await listArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Article not found — Stack Consulting AI" };

  const url = `https://stackconsultingai.com/blog/${article.slug}`;
  const imageUrl = `https://stackconsultingai.com${article.image}`;

  return {
    title: `${article.title} — Stack Consulting AI`,
    description: article.description,
    keywords: article.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: article.title,
      description: article.description,
      url,
      type: "article",
      publishedTime: article.datePublished,
      modifiedTime: article.dateModified ?? article.datePublished,
      authors: [article.author],
      images: [{ url: imageUrl, alt: article.imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
      images: [imageUrl],
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

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const url = `https://stackconsultingai.com/blog/${article.slug}`;
  const imageUrl = `https://stackconsultingai.com${article.image}`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.description,
    image: imageUrl,
    datePublished: article.datePublished,
    dateModified: article.dateModified ?? article.datePublished,
    author: {
      "@type": "Person",
      name: article.author,
      jobTitle: article.authorRole,
      url: "https://stackconsultingai.com",
    },
    publisher: {
      "@type": "Organization",
      name: "Stack Consulting AI",
      url: "https://stackconsultingai.com",
      logo: {
        "@type": "ImageObject",
        url: "https://stackconsultingai.com/icon.svg",
      },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    keywords: article.keywords?.join(", "),
    articleSection: article.category,
  };

  const faqSchema =
    article.faqs && article.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: article.faqs.map((f) => ({
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
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://stackconsultingai.com/blog" },
      { "@type": "ListItem", position: 3, name: article.title, item: url },
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
        <article className="max-w-3xl mx-auto px-4 pt-12 md:pt-16">
          <nav aria-label="Breadcrumb" className="mb-6">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-navy-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              All articles
            </Link>
          </nav>

          {article.category && (
            <span className="inline-block text-xs font-semibold tracking-[0.16em] uppercase text-brand mb-4">
              {article.category}
            </span>
          )}

          <h1 className="font-heading text-3xl md:text-5xl font-bold leading-[1.1] tracking-tight mb-5">
            {article.title}
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-6">
            {article.description}
          </p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground mb-10 pb-8 border-b border-border">
            <span className="font-semibold text-navy-900">{article.author}</span>
            {article.authorRole && <span>· {article.authorRole}</span>}
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(article.datePublished)}
            </span>
            {article.readingTime && (
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {article.readingTime}
              </span>
            )}
          </div>

          <div className="relative aspect-[3/2] w-full mb-10 rounded-md overflow-hidden border border-border bg-soft">
            <Image
              src={article.image}
              alt={article.imageAlt}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>

          <div className="prose prose-lg prose-slate max-w-none prose-headings:font-heading prose-headings:tracking-tight prose-headings:text-navy-900 prose-h1:hidden prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-a:text-brand hover:prose-a:text-brand-hover prose-a:underline-offset-4 prose-strong:text-navy-900 prose-li:my-1">
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
              {article.body}
            </ReactMarkdown>
          </div>

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
        </article>
      </main>
    </>
  );
}
