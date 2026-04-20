import { supabase, supabaseAdmin } from "./supabase";

export interface NewsletterIssue {
  id: string;
  issue_number: number;
  slug: string;
  subject: string;
  preheader: string;
  markdown_body: string;
  source_video_id: string | null;
  source_video_url: string | null;
  source_video_title: string | null;
  source_channel: string | null;
  published_at: string;
  created_at: string;
}

/** Strip anything but alphanumerics and spaces; kebab-case and cap length. */
export function slugifySubject(subject: string, maxLen = 50): string {
  return subject
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, maxLen)
    .replace(/-$/, "");
}

/** Build a slug of the form "YYYY-MM-DD-subject-kebab". Ensures uniqueness. */
export async function buildUniqueSlug(subject: string): Promise<string> {
  const today = new Date();
  const y = today.getUTCFullYear();
  const m = String(today.getUTCMonth() + 1).padStart(2, "0");
  const d = String(today.getUTCDate()).padStart(2, "0");
  const base = `${y}-${m}-${d}-${slugifySubject(subject)}`;

  const { data } = await supabaseAdmin
    .from("newsletter_issues")
    .select("slug")
    .like("slug", `${base}%`);

  const existing = new Set((data ?? []).map((r) => r.slug));
  if (!existing.has(base)) return base;
  for (let i = 2; i < 100; i++) {
    const candidate = `${base}-${i}`;
    if (!existing.has(candidate)) return candidate;
  }
  return `${base}-${Date.now()}`;
}

export async function nextIssueNumber(): Promise<number> {
  const { data, error } = await supabaseAdmin
    .from("newsletter_issues")
    .select("issue_number")
    .order("issue_number", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw new Error(`nextIssueNumber: ${error.message}`);
  return (data?.issue_number ?? 0) + 1;
}

export async function publishIssue(opts: {
  subject: string;
  preheader: string;
  markdown_body: string;
  source_video_id?: string | null;
  source_video_url?: string | null;
  source_video_title?: string | null;
  source_channel?: string | null;
}): Promise<NewsletterIssue> {
  const slug = await buildUniqueSlug(opts.subject);
  const issue_number = await nextIssueNumber();

  const { data, error } = await supabaseAdmin
    .from("newsletter_issues")
    .insert({
      issue_number,
      slug,
      subject: opts.subject,
      preheader: opts.preheader,
      markdown_body: opts.markdown_body,
      source_video_id: opts.source_video_id ?? null,
      source_video_url: opts.source_video_url ?? null,
      source_video_title: opts.source_video_title ?? null,
      source_channel: opts.source_channel ?? null,
    })
    .select()
    .single();
  if (error) throw new Error(`publishIssue: ${error.message}`);
  return data as NewsletterIssue;
}

/** Public reads — use anon client. */
export async function listIssues(): Promise<NewsletterIssue[]> {
  const { data, error } = await supabase
    .from("newsletter_issues")
    .select("*")
    .order("issue_number", { ascending: false });
  if (error) {
    console.warn("listIssues error:", error.message);
    return [];
  }
  return (data ?? []) as NewsletterIssue[];
}

export async function getIssueBySlug(
  slug: string,
): Promise<NewsletterIssue | null> {
  const { data, error } = await supabase
    .from("newsletter_issues")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) {
    console.warn("getIssueBySlug error:", error.message);
    return null;
  }
  return (data as NewsletterIssue | null) ?? null;
}

export async function listIssueSlugs(): Promise<string[]> {
  const { data, error } = await supabase
    .from("newsletter_issues")
    .select("slug");
  if (error) return [];
  return (data ?? []).map((r) => r.slug);
}
