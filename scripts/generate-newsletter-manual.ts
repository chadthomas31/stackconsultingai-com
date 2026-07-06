#!/usr/bin/env tsx
/**
 * Manual newsletter generation for The Stack Report
 * 
 * Usage:
 *   npm run newsletter:generate
 *   OR
 *   tsx scripts/generate-newsletter-manual.ts
 * 
 * This script helps curate and generate a newsletter issue from manually
 * selected trending repos and topics, bypassing the YouTube video pipeline
 * for weeks when we want direct control over content.
 */

import { generateNewsletter, type NewsletterDraft } from "@/lib/newsletter-gen";
import { publishIssue } from "@/lib/newsletter-issues-db";
import * as readline from "readline/promises";
import { stdin as input, stdout as output } from "process";

interface CuratedRepo {
  name: string;
  url: string;
  description: string;
  stars?: string;
  category?: string;
}

interface CuratedContent {
  featuredRepos: CuratedRepo[];
  quickHits: CuratedRepo[];
  weekSummary: string;
  customInstructions?: string;
}

/**
 * Curated content for the current week's newsletter
 * 
 * INSTRUCTIONS FOR CURATORS:
 * 1. Update the repos below with this week's trending content
 * 2. Use builder voice: concrete, specific, name what it replaces
 * 3. Verify all GitHub URLs are correct
 * 4. Keep descriptions 2-3 sentences for featured, 1 sentence for quick hits
 * 5. Run `npm run newsletter:preview` to review before generating
 */
const CURATED_CONTENT: CuratedContent = {
  weekSummary: `GitHub trending this week was all about agent tooling that actually solves problems. No more generic AI slop — these are repos that give agents skills, taste, and memory. Plus practical tools for scraping, document parsing, and workflow automation that small businesses can actually use.`,
  
  featuredRepos: [
    {
      name: "ponytail",
      url: "https://github.com/DietrichGebert/ponytail",
      description: "Makes your AI agent think like the laziest senior dev in the room. Ships with skills that minimize over-engineering and token waste. Instead of building everything from scratch, it teaches agents to use existing tools and write less code. Exploded to 55k stars in a week.",
      stars: "55k",
      category: "Agent Skills",
    },
    {
      name: "taste-skill",
      url: "https://github.com/Leonxlnx/taste-skill",
      description: "Stops AI agents from generating boring, generic design. Ships 23 commands and 27 anti-pattern rules so your agent doesn't default to Inter font, purple gradients, and nested cards on every project. Works with Claude Code, Cursor, and Gemini.",
      stars: "50k",
      category: "Agent Skills",
    },
    {
      name: "headroom",
      url: "https://github.com/headroomlabs-ai/headroom",
      description: "Compress tool outputs, logs, files, and RAG chunks before they hit the LLM. Cuts context by 60-95% without losing information. When you're paying per token or hitting context limits, this pays for itself immediately.",
      stars: "50k",
      category: "Developer Tools",
    },
    {
      name: "markitdown",
      url: "https://github.com/microsoft/markitdown",
      description: "Microsoft's open-source tool for converting messy enterprise documents into LLM-readable Markdown. Handles PDFs, Word docs, Excel sheets, and PowerPoint. Local Python tool, no API calls. If you're building document analysis workflows, this replaces a dozen brittle scrapers.",
      stars: "N/A",
      category: "Data Processing",
    },
    {
      name: "firecrawl",
      url: "https://github.com/firecrawl/firecrawl",
      description: "All-in-one API for web scraping and agent-ready data ingestion. Handles JavaScript rendering, authentication, rate limiting, and outputs clean markdown. Self-hostable or use their cloud. Eliminates the scraper maintenance nightmare.",
      stars: "N/A",
      category: "Data Processing",
    },
    {
      name: "Agent-Reach",
      url: "https://github.com/Panniantong/Agent-Reach",
      description: "Give your AI agent eyes to see the entire internet. Read and search Twitter, Reddit, YouTube, news sites, and more. When your agent needs real-time context from social platforms, this is the bridge.",
      stars: "40k",
      category: "Agent Tools",
    },
  ],

  quickHits: [
    {
      name: "deer-flow",
      url: "https://github.com/bytedance/deer-flow",
      description: "ByteDance's long-horizon agent harness for research, coding, and creation with sandboxes and subagents.",
      stars: "738 new",
    },
    {
      name: "OpenMontage",
      url: "https://github.com/calesthio/OpenMontage",
      description: "Agentic video production system with 12 pipelines, 52 tools, and 500+ agent skills.",
      stars: "2.9k new",
    },
    {
      name: "cognee",
      url: "https://github.com/topoteretes/cognee",
      description: "Self-hosted AI memory platform with knowledge graph engine for persistent agent memory.",
      stars: "688 new",
    },
    {
      name: "gstack",
      url: "https://github.com/garrytan/gstack",
      description: "Garry Tan's Claude Code setup: 23 opinionated tools covering CEO, Designer, Eng Manager, and QA roles.",
      stars: "573 new",
    },
    {
      name: "Open WebUI",
      url: "https://github.com/open-webui/open-webui",
      description: "Self-hosted AI interface that works entirely offline. One pip command to install.",
      stars: "N/A",
    },
    {
      name: "liteparse",
      url: "https://github.com/run-llama/liteparse",
      description: "Fast, open-source document parser written in Rust. When markitdown is too slow.",
      stars: "147 new",
    },
    {
      name: "freellmapi",
      url: "https://github.com/tashfeenahmed/freellmapi",
      description: "OpenAI-compatible proxy that aggregates free tiers of 16 LLM providers with smart routing and failover.",
      stars: "250 new",
    },
  ],

  customInstructions: `This week's newsletter is curated from GitHub trending data for late June 2026. Focus on practical value for small business owners and dev-curious folks. The theme is "agent tooling that actually works" — skills, memory, automation. Skip academic novelties and overhyped crypto projects. Keep the builder voice: specific, concrete, slightly opinionated. No marketing fluff.`,
};

/**
 * Format curated content into a pseudo-transcript that the newsletter
 * generator can consume
 */
function formatCuratedContentAsTranscript(content: CuratedContent): string {
  const lines: string[] = [
    "# The Stack Report - GitHub Trending Roundup",
    "",
    content.weekSummary,
    "",
    "## Featured Repos",
    "",
  ];

  for (const repo of content.featuredRepos) {
    lines.push(`### ${repo.name}`);
    if (repo.url) lines.push(`GitHub: ${repo.url}`);
    if (repo.stars) lines.push(`Stars: ${repo.stars}`);
    if (repo.category) lines.push(`Category: ${repo.category}`);
    lines.push(repo.description);
    lines.push("");
  }

  lines.push("## Quick Hits");
  lines.push("");

  for (const repo of content.quickHits) {
    lines.push(`- **${repo.name}**${repo.url ? ` (${repo.url})` : ""}: ${repo.description}${repo.stars ? ` [${repo.stars}]` : ""}`);
  }

  return lines.join("\n");
}

async function main() {
  // Validate environment before proceeding
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("\n❌ Error: ANTHROPIC_API_KEY is not set in .env.local");
    console.error("\nThe newsletter generator requires Claude API access.");
    console.error("Add your API key to .env.local:");
    console.error("  ANTHROPIC_API_KEY=sk-ant-...\n");
    process.exit(1);
  }

  // Validate curated content has minimum requirements
  if (CURATED_CONTENT.featuredRepos.length === 0) {
    console.error("\n❌ Error: featuredRepos cannot be empty");
    console.error("Add at least 4-6 featured repos before generating.\n");
    process.exit(1);
  }

  if (CURATED_CONTENT.quickHits.length === 0) {
    console.error("\n❌ Error: quickHits cannot be empty");
    console.error("Add at least 5-8 quick hits before generating.\n");
    process.exit(1);
  }

  const rl = readline.createInterface({ input, output });

  console.log("\n🗞️  The Stack Report - Manual Newsletter Generator\n");
  console.log("This script generates a newsletter from curated GitHub trending data.\n");

  // Show curated content summary
  console.log("📊 Current curated content:");
  console.log(`   - ${CURATED_CONTENT.featuredRepos.length} featured repos`);
  console.log(`   - ${CURATED_CONTENT.quickHits.length} quick hits`);
  console.log(`   - Theme: Agent tooling and practical automation\n`);

  const shouldContinue = await rl.question("Generate newsletter with this content? (y/n): ");
  
  if (shouldContinue.toLowerCase() !== "y") {
    console.log("\n❌ Cancelled. Edit CURATED_CONTENT_JUNE_29_2026 in the script to change content.\n");
    rl.close();
    return;
  }

  console.log("\n⚙️  Generating newsletter draft with Claude...");
  console.log("   (This may take 30-60 seconds for complex newsletters)\n");

  const transcript = formatCuratedContentAsTranscript(CURATED_CONTENT);

  try {
    const draft: NewsletterDraft = await generateNewsletter({
      transcript,
      videoMeta: {
        videoId: "manual-curation",
        title: "GitHub Trending - Agent Tooling & Automation (June 29, 2026)",
        channel: "Stack Consulting AI (curated)",
        publishedAt: new Date().toISOString(),
        durationSeconds: null,
      },
      videoUrl: "https://stackconsultingai.com/stack-report",
      customInstructions: CURATED_CONTENT.customInstructions,
    });

    console.log("\n✅ Draft generated!\n");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    console.log(`📧 Subject: ${draft.subject}\n`);
    console.log(`🔖 Preheader: ${draft.preheader}\n`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    console.log(draft.markdown_body);
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    const shouldPublish = await rl.question("\nPublish this issue to the database? (y/n): ");
    
    if (shouldPublish.toLowerCase() === "y") {
      console.log("\n📤 Publishing to database...\n");

      const issue = await publishIssue({
        subject: draft.subject,
        preheader: draft.preheader,
        markdown_body: draft.markdown_body,
        source_video_id: null,
        source_video_url: "https://stackconsultingai.com/stack-report",
        source_video_title: "GitHub Trending Curation - June 29, 2026",
        source_channel: "Stack Consulting AI",
        source_published_at: new Date().toISOString(),
        content_type: "digest",
        category: "GitHub Trending",
        author_name: "Chad McCluskey",
        author_role: "Founder, Stack Consulting AI",
        reading_time: "4 min read",
      });

      console.log(`✅ Published as issue #${issue.issue_number}`);
      console.log(`   Slug: ${issue.slug}`);
      console.log(`   URL: https://stackconsultingai.com/stack-report/${issue.slug}\n`);
    } else {
      console.log("\n💾 Draft saved to console only. Not published.\n");
      console.log("To publish later, use the /api/newsletter/publish endpoint.\n");
    }

  } catch (error) {
    console.error("\n❌ Error generating newsletter:\n");
    console.error(error);
    process.exit(1);
  }

  rl.close();
}

main();
