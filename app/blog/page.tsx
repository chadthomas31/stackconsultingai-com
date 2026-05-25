import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { BookOpen, ArrowRight } from "lucide-react";
import { listArticles } from "@/lib/articles";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Blog — Stack Consulting AI",
  description:
    "Practical, builder-grade writing on AI for small business, automation, and real Southern California implementations — no hype, no fluff.",
  alternates: { canonical: "https://stackconsultingai.com/blog" },
  openGraph: {
    title: "Blog — Stack Consulting AI",
    description:
      "Practical, builder-grade writing on AI for small business and automation.",
    url: "https://stackconsultingai.com/blog",
    type: "website",
  },
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "America/Los_Angeles",
  });
}

export default async function BlogIndexPage() {
  const articles = await listArticles();

  return (
    <main className="min-h-screen bg-white text-navy-900 pb-24 pt-24">
      <section className="max-w-5xl mx-auto px-4 pt-12 md:pt-20 pb-12 border-b border-border">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand/10 border border-brand/25 text-brand text-xs font-semibold tracking-[0.16em] uppercase mb-5">
          <BookOpen className="w-3 h-3" />
          Blog
        </div>
        <h1 className="font-heading text-4xl md:text-6xl font-bold tracking-tight leading-[1.05] mb-5">
          Builder notes from Stack Consulting AI
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed mb-8">
          Practical writing on AI for small business, automation, and real
          Southern California implementations. No frameworks-as-content. No
          hype. Just what works.
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-12">
        {articles.length === 0 ? (
          <p className="text-muted-foreground">No articles yet.</p>
        ) : (
          <ul className="grid gap-8 md:grid-cols-2">
            {articles.map((a) => (
              <li
                key={a.slug}
                className="group rounded-md border border-border bg-white overflow-hidden transition-all hover:border-navy-900 hover:shadow-[0_0_20px_rgba(0,0,0,0.06)]"
              >
                <Link href={`/blog/${a.slug}`} className="block">
                  <div className="relative aspect-[3/2] w-full bg-soft">
                    <Image
                      src={a.image}
                      alt={a.imageAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    {a.category && (
                      <span className="inline-block text-xs font-semibold tracking-[0.14em] uppercase text-brand mb-3">
                        {a.category}
                      </span>
                    )}
                    <h2 className="font-heading text-xl md:text-2xl font-bold leading-tight mb-3 group-hover:text-brand transition-colors">
                      {a.title}
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                      {a.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{formatDate(a.datePublished)}</span>
                      {a.readingTime && <span>{a.readingTime}</span>}
                    </div>
                    <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand">
                      Read article <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
