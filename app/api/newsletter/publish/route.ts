import { NextRequest, NextResponse } from "next/server";
import { publishIssue } from "@/lib/newsletter-issues-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface PublishRequest {
  subject?: string;
  preheader?: string;
  markdown_body?: string;
  source_video_id?: string | null;
  source_video_url?: string | null;
  source_video_title?: string | null;
  source_channel?: string | null;
  secret?: string;
}

function authorize(req: NextRequest, body: PublishRequest) {
  const required = process.env.NEWSLETTER_ADMIN_SECRET;
  if (!required) return true;
  const headerSecret = req.headers.get("x-admin-secret");
  const urlSecret = new URL(req.url).searchParams.get("secret");
  return (
    headerSecret === required ||
    urlSecret === required ||
    body.secret === required
  );
}

export async function POST(req: NextRequest) {
  let body: PublishRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON" },
      { status: 400 },
    );
  }

  if (!authorize(req, body)) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  const { subject, preheader, markdown_body } = body;
  if (!subject || !preheader || !markdown_body) {
    return NextResponse.json(
      {
        ok: false,
        error: "subject, preheader, and markdown_body are required",
      },
      { status: 400 },
    );
  }

  try {
    const issue = await publishIssue({
      subject,
      preheader,
      markdown_body,
      source_video_id: body.source_video_id ?? null,
      source_video_url: body.source_video_url ?? null,
      source_video_title: body.source_video_title ?? null,
      source_channel: body.source_channel ?? null,
    });
    return NextResponse.json({
      ok: true,
      issue_number: issue.issue_number,
      slug: issue.slug,
      url: `/stack-report/${issue.slug}`,
      published_at: issue.published_at,
    });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : String(err),
      },
      { status: 500 },
    );
  }
}
