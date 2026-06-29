#!/usr/bin/env tsx
/**
 * Preview newsletter content structure
 * 
 * This script shows the formatted content structure that would be sent
 * to Claude for newsletter generation, without actually calling the API.
 * Useful for reviewing curated content before burning API credits.
 */

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
 * Curated content for June 29, 2026 - The Stack Report
 */
const CURATED_CONTENT_JUNE_29_2026: CuratedContent = {
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
      category: "Data Processing",
    },
    {
      name: "firecrawl",
      url: "https://github.com/firecrawl/firecrawl",
      description: "All-in-one API for web scraping and agent-ready data ingestion. Handles JavaScript rendering, authentication, rate limiting, and outputs clean markdown. Self-hostable or use their cloud. Eliminates the scraper maintenance nightmare.",
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

console.log("\n📋 The Stack Report - Content Preview\n");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

const transcript = formatCuratedContentAsTranscript(CURATED_CONTENT_JUNE_29_2026);

console.log("📊 STATISTICS:");
console.log(`   Featured repos: ${CURATED_CONTENT_JUNE_29_2026.featuredRepos.length}`);
console.log(`   Quick hits: ${CURATED_CONTENT_JUNE_29_2026.quickHits.length}`);
console.log(`   Total items: ${CURATED_CONTENT_JUNE_29_2026.featuredRepos.length + CURATED_CONTENT_JUNE_29_2026.quickHits.length}`);
console.log(`   Transcript length: ${transcript.length} chars (~${Math.ceil(transcript.length / 4)} tokens)\n`);

console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
console.log("📝 FORMATTED TRANSCRIPT FOR CLAUDE:\n");
console.log(transcript);
console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

console.log("💡 CUSTOM INSTRUCTIONS:\n");
console.log(CURATED_CONTENT_JUNE_29_2026.customInstructions);
console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

console.log("\n✅ Content structure looks good!");
console.log("\nNext steps:");
console.log("1. Review the content above for accuracy and brand voice");
console.log("2. Ensure ANTHROPIC_API_KEY is set in .env.local");
console.log("3. Run: npm run newsletter:generate");
console.log("4. Or call the API directly via /api/newsletter/generate\n");
