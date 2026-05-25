import "server-only";

import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

const ARTICLES_DIR = path.join(process.cwd(), "content", "articles");

export interface ArticleFaq {
  question: string;
  answer: string;
}

export interface ArticleFrontmatter {
  title: string;
  slug: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  author: string;
  authorRole?: string;
  category?: string;
  tags?: string[];
  image: string;
  imageAlt: string;
  readingTime?: string;
  keywords?: string[];
  faqs?: ArticleFaq[];
}

export interface Article extends ArticleFrontmatter {
  body: string;
}

export interface ArticleSummary extends ArticleFrontmatter {}

async function readArticleFile(filename: string): Promise<Article | null> {
  const full = path.join(ARTICLES_DIR, filename);
  let raw: string;
  try {
    raw = await fs.readFile(full, "utf8");
  } catch {
    return null;
  }
  const { data, content } = matter(raw);
  const fm = data as Partial<ArticleFrontmatter>;
  if (!fm.title || !fm.slug || !fm.description || !fm.datePublished || !fm.author || !fm.image || !fm.imageAlt) {
    return null;
  }
  return { ...(fm as ArticleFrontmatter), body: content };
}

export async function listArticleSlugs(): Promise<string[]> {
  let entries: string[];
  try {
    entries = await fs.readdir(ARTICLES_DIR);
  } catch {
    return [];
  }
  const articles = await Promise.all(
    entries.filter((f) => f.endsWith(".md")).map((f) => readArticleFile(f)),
  );
  return articles.filter((a): a is Article => a !== null).map((a) => a.slug);
}

export async function listArticles(): Promise<ArticleSummary[]> {
  let entries: string[];
  try {
    entries = await fs.readdir(ARTICLES_DIR);
  } catch {
    return [];
  }
  const articles = await Promise.all(
    entries.filter((f) => f.endsWith(".md")).map((f) => readArticleFile(f)),
  );
  return articles
    .filter((a): a is Article => a !== null)
    .map(({ body: _b, ...rest }) => rest)
    .sort((a, b) => (a.datePublished < b.datePublished ? 1 : -1));
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  let entries: string[];
  try {
    entries = await fs.readdir(ARTICLES_DIR);
  } catch {
    return null;
  }
  for (const f of entries) {
    if (!f.endsWith(".md")) continue;
    const a = await readArticleFile(f);
    if (a && a.slug === slug) return a;
  }
  return null;
}
