import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Github,
  Mail,
  Linkedin,
  Phone,
  Database,
  Workflow,
  AlertTriangle,
  Code2,
} from "lucide-react";

import PortfolioHeader from "@/components/portfolio/PortfolioHeader";
import KbChat from "@/components/portfolio/KbChat";
import LeadAutomation from "@/components/portfolio/LeadAutomation";

export const metadata: Metadata = {
  title: "Chad McCluskey — OpenAI Support Engineer Portfolio",
  description:
    "Working demos of OpenAI APIs in production: Realtime voice agent, RAG knowledgebase chat, structured-output lead triage, and a written debugging walkthrough for Realtime API session timeouts.",
  alternates: {
    canonical: "https://stackconsultingai.com/portfolio",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Chad McCluskey — OpenAI Support Engineer Portfolio",
    description:
      "Realtime voice agent in production. RAG over real docs. Structured-output lead triage. Plus a written customer-debug walkthrough.",
    url: "https://stackconsultingai.com/portfolio",
    type: "website",
  },
};

export default function PortfolioPage() {
  return (
    <main className="min-h-screen bg-white">
      <PortfolioHeader />

      {/* Hero */}
      <section className="pt-20 pb-16 md:pt-28 md:pb-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
            <div className="md:col-span-8">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-hover">
                Portfolio · Applying for OpenAI Support Engineering
              </span>
              <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-navy-900 leading-[1.05] mt-4 mb-6">
                I ship production OpenAI integrations
                <span className="text-brand-hover">
                  {" "}
                  and I want to support the developers who do too.
                </span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-2xl">
                I&rsquo;m Chad McCluskey. I run Stack Consulting AI, where I
                build voice agents, RAG systems, and automation pipelines on
                top of OpenAI&rsquo;s APIs for small businesses. Below are
                three live demos hitting real OpenAI endpoints, plus a written
                debugging walkthrough for a real-world Realtime API issue.
              </p>

              <div className="flex flex-wrap gap-3 mb-8">
                <a
                  href="https://github.com/chadmccluskey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-accent inline-flex items-center gap-2 text-sm"
                >
                  <Github aria-hidden="true" className="w-4 h-4" />
                  GitHub
                </a>
                <a
                  href="https://www.linkedin.com/in/chadmccluskey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost inline-flex items-center gap-2 text-sm"
                >
                  <Linkedin aria-hidden="true" className="w-4 h-4" />
                  LinkedIn
                </a>
                <a
                  href="mailto:chad.mccluskey@gmail.com"
                  className="btn-ghost inline-flex items-center gap-2 text-sm"
                >
                  <Mail aria-hidden="true" className="w-4 h-4" />
                  chad.mccluskey@gmail.com
                </a>
              </div>
            </div>

            {/* Skills strip */}
            <aside className="md:col-span-4 md:pt-2 border-t border-border md:border-t-0 md:border-l md:pl-8 pt-8">
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-4">
                OpenAI APIs in production
              </div>
              <ul className="space-y-2 text-sm text-navy-900">
                <li className="flex items-baseline gap-2">
                  <span className="text-brand-hover">→</span> Realtime API (gpt-realtime)
                </li>
                <li className="flex items-baseline gap-2">
                  <span className="text-brand-hover">→</span> Chat Completions w/ function calling
                </li>
                <li className="flex items-baseline gap-2">
                  <span className="text-brand-hover">→</span> Structured Outputs (json_schema)
                </li>
                <li className="flex items-baseline gap-2">
                  <span className="text-brand-hover">→</span> Embeddings (text-embedding-3-small)
                </li>
                <li className="flex items-baseline gap-2">
                  <span className="text-brand-hover">→</span> Whisper · TTS · Vision
                </li>
              </ul>
              <div className="text-xs uppercase tracking-wider text-muted-foreground mt-6 mb-4">
                Stack
              </div>
              <p className="text-sm text-navy-900 leading-relaxed">
                TypeScript · Python · Node · Next.js · FreeSWITCH · PostgreSQL
                · Supabase · Vercel · Linux ops
              </p>
            </aside>
          </div>
        </div>
      </section>

      {/* Demo 1: Voice agent */}
      <section id="voice" className="py-20 bg-soft border-y border-border">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHeader
            number="01"
            label="Live in production"
            Icon={Phone}
            title="Realtime API voice agent over FreeSWITCH"
            tag="OpenAI Realtime API · function calling · WebSocket"
          />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mt-10">
            <div className="md:col-span-7 space-y-4 text-navy-900 leading-relaxed">
              <p>
                Production AI receptionist running on a self-hosted FreeSWITCH
                PBX with the OpenAI Realtime API as the conversational core.
                Calls hit Telnyx → FreeSWITCH → my Lua dialplan handler →
                Realtime WebSocket session. Function calls bridge the model
                back to Google Calendar (booking), HubSpot (lead logging), and
                a SIP transfer endpoint (warm hand-off to a human).
              </p>
              <p>
                Sub-1-second answer time. Bookings up 40% in 90 days at one
                client. The same stack powers the live demo on this
                site&rsquo;s homepage &mdash; visitors enter a phone number,
                FreeSWITCH places an outbound call, the Realtime agent
                qualifies them.
              </p>

              <div className="rounded-md border border-border bg-white p-4 mt-6">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-3">
                  Architecture
                </div>
                <pre className="text-xs font-mono text-navy-900 leading-relaxed overflow-x-auto">{`Caller
  ↓ PSTN
Telnyx (SIP trunk)
  ↓ SIP/RTP
FreeSWITCH (Lua dialplan)
  ↓ WebSocket (audio frames + JSON events)
OpenAI Realtime API · gpt-realtime
  ↓ function calls
   ├── calendar.book_slot
   ├── crm.log_lead
   └── transfer.warm(extension)`}</pre>
              </div>

              <div className="flex flex-wrap gap-3 pt-4">
                <Link
                  href="/#assessment"
                  className="btn-accent inline-flex items-center gap-2 text-sm"
                >
                  <Phone aria-hidden="true" className="w-4 h-4" />
                  Try the live demo
                </Link>
                <Link
                  href="/ai-receptionist"
                  className="btn-ghost inline-flex items-center gap-2 text-sm"
                >
                  Product page
                  <ArrowRight aria-hidden="true" className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Code snippet */}
            <div className="md:col-span-5">
              <div className="rounded-md bg-navy-900 text-white p-5 overflow-x-auto">
                <div className="text-[10px] uppercase tracking-wider text-brand-soft mb-3 font-mono">
                  freeswitch/realtime_bridge.ts (excerpt)
                </div>
                <pre className="text-xs font-mono leading-relaxed">{`const ws = new WebSocket(
  "wss://api.openai.com/v1/realtime" +
    "?model=gpt-realtime",
  {
    headers: {
      Authorization: \`Bearer \${OPENAI_KEY}\`,
      "OpenAI-Beta": "realtime=v1",
    },
  }
);

ws.on("open", () => {
  ws.send(JSON.stringify({
    type: "session.update",
    session: {
      voice: "alloy",
      tools: [
        {
          type: "function",
          name: "book_slot",
          parameters: bookingSchema,
        },
        {
          type: "function",
          name: "transfer_human",
          parameters: transferSchema,
        },
      ],
    },
  }));
});`}</pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo 2: RAG knowledgebase */}
      <section id="kb" className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHeader
            number="02"
            label="Interactive demo"
            Icon={Database}
            title="RAG knowledgebase over real Stack Consulting docs"
            tag="OpenAI Embeddings · Chat Completions · cosine similarity"
          />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mt-10">
            <div className="md:col-span-5 space-y-4 text-navy-900 leading-relaxed">
              <p>
                Ten chunks of real Stack Consulting AI service documentation
                are embedded with{" "}
                <code className="font-mono text-xs bg-soft px-1.5 py-0.5 rounded">
                  text-embedding-3-small
                </code>{" "}
                at first request and cached in-memory across the lambda&rsquo;s
                lifetime. Each user question is embedded, scored against the
                cached corpus via cosine similarity, and the top-3 chunks are
                stuffed into the system prompt for{" "}
                <code className="font-mono text-xs bg-soft px-1.5 py-0.5 rounded">
                  gpt-4o-mini
                </code>
                .
              </p>
              <p>
                Response panel shows retrieved sources with similarity scores,
                token counts split across embed/prompt/completion, and total
                latency. Embed cache &ldquo;cold&rdquo; on first request,
                &ldquo;hit&rdquo; thereafter.
              </p>

              <ul className="text-sm space-y-1 pt-2">
                <li>
                  <span className="text-brand-hover">→</span> No vector DB &mdash;
                  in-memory cosine for 10 chunks is faster than a network round-trip
                </li>
                <li>
                  <span className="text-brand-hover">→</span> Source citations
                  enforced via prompt instruction
                </li>
                <li>
                  <span className="text-brand-hover">→</span> Graceful 503 if{" "}
                  <code className="font-mono text-xs bg-soft px-1.5 py-0.5 rounded">
                    OPENAI_API_KEY
                  </code>{" "}
                  missing
                </li>
              </ul>

              <p className="text-xs text-muted-foreground pt-2">
                Code:{" "}
                <code className="font-mono">app/api/portfolio/kb-chat/route.ts</code>
                {" "}+ <code className="font-mono">lib/portfolio/kb.ts</code>
              </p>
            </div>

            <div className="md:col-span-7">
              <KbChat />
            </div>
          </div>
        </div>
      </section>

      {/* Demo 3: Lead automation */}
      <section id="automation" className="py-20 bg-soft border-y border-border">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHeader
            number="03"
            label="Interactive demo"
            Icon={Workflow}
            title="Structured-output lead triage with simulated routing"
            tag="OpenAI Chat Completions · response_format json_schema (strict)"
          />

          <div className="space-y-4 text-navy-900 leading-relaxed mt-10 max-w-3xl">
            <p>
              Inbound lead message → triage to a strict JSON schema (priority,
              intent category, summary, suggested next step, deal-size
              estimate, contact-method preference, tags). Server then computes
              a routing fanout plan: which Slack channels, which email
              templates, which CRM pipeline.
            </p>
            <p className="text-sm text-muted-foreground">
              Fanout is <em>simulated</em> &mdash; nothing actually fires. In
              production this same triage feeds a real GoHighLevel webhook +
              Slack incoming-webhook + transactional email service.
            </p>
          </div>

          <div className="mt-10">
            <LeadAutomation />
          </div>
        </div>
      </section>

      {/* Demo 4: Debug walkthrough */}
      <section id="debug" className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHeader
            number="04"
            label="Support walkthrough"
            Icon={AlertTriangle}
            title="How I&rsquo;d debug: &ldquo;Realtime sessions cut off after 90 seconds&rdquo;"
            tag="Customer support · debugging · technical writing"
          />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mt-10">
            <div className="md:col-span-4">
              <div className="sticky top-20 space-y-3 text-sm">
                <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                  In this walkthrough
                </div>
                <a href="#dbg-ticket" className="block text-navy-900 hover:text-brand-hover">
                  → Customer ticket
                </a>
                <a href="#dbg-clarify" className="block text-navy-900 hover:text-brand-hover">
                  → Clarifying questions
                </a>
                <a href="#dbg-hypotheses" className="block text-navy-900 hover:text-brand-hover">
                  → Hypotheses, ranked
                </a>
                <a href="#dbg-likely" className="block text-navy-900 hover:text-brand-hover">
                  → Most likely cause
                </a>
                <a href="#dbg-fix" className="block text-navy-900 hover:text-brand-hover">
                  → Fix + code
                </a>
                <a href="#dbg-reply" className="block text-navy-900 hover:text-brand-hover">
                  → Customer-facing reply
                </a>
              </div>
            </div>

            <article className="md:col-span-8 space-y-8">
              <div id="dbg-ticket" className="rounded-md border-l-4 border-brand bg-soft p-5">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 font-mono">
                  TICKET #SE-4471 · Priority: P2 · openai/realtime
                </div>
                <p className="text-sm text-navy-900 leading-relaxed">
                  &ldquo;Hi &mdash; we built a Realtime API voice bot using
                  the WebSocket transport. Calls work great for the first
                  ~90 seconds, then the WebSocket closes silently. No error
                  event, no <code className="font-mono text-xs">close</code>{" "}
                  reason. We&rsquo;re on Node 20 behind an AWS NLB.
                  Reproduces consistently. Help?&rdquo;
                </p>
              </div>

              <DbgBlock id="dbg-clarify" title="1. Clarifying questions before debugging">
                <ul className="space-y-2 text-sm">
                  <li>
                    <strong>Is the 90s timing exact, or fuzzy?</strong>{" "}
                    Exact-ish (87s, 89s, 91s) suggests an upstream idle
                    timeout. Variable (40s–180s) suggests something else.
                  </li>
                  <li>
                    <strong>Are audio frames actively flowing in both
                    directions during that 90s window?</strong> If the user
                    goes quiet and the model isn&rsquo;t speaking, the
                    socket is technically idle from a TCP perspective.
                  </li>
                  <li>
                    <strong>Any logs at the NLB?</strong> AWS NLB has a
                    <code className="font-mono text-xs"> tcp-idle-timeout </code>
                    that defaults to 350s but I&rsquo;ve seen it lowered to
                    60s on hardened configs.
                  </li>
                  <li>
                    <strong>Is the WebSocket library sending pings?</strong>{" "}
                    The <code className="font-mono text-xs">ws</code> Node
                    package needs explicit{" "}
                    <code className="font-mono text-xs">ping</code> intervals
                    or the underlying TCP stays silent.
                  </li>
                </ul>
              </DbgBlock>

              <DbgBlock id="dbg-hypotheses" title="2. Hypotheses, ranked">
                <ol className="space-y-2 text-sm list-decimal list-inside">
                  <li>
                    <strong>NLB or upstream proxy idle-timeout</strong> killing the TCP
                    connection while the WS thinks it&rsquo;s alive. (most
                    likely &mdash; 90s is a smell)
                  </li>
                  <li>
                    <strong>No WS keepalive pings</strong> &mdash; OpenAI&rsquo;s
                    Realtime API doesn&rsquo;t require pings, but intermediate
                    hops may.
                  </li>
                  <li>
                    <strong>Client-side audio buffer underrun</strong> causing
                    the bot to send no frames; combined with #1 closes silently.
                  </li>
                  <li>
                    <strong>Server runtime restart</strong> (Lambda cold-warm
                    cycles, container OOM); 90s aligns with some platform timeouts
                    but customer is on Node 20 long-running &mdash; less likely.
                  </li>
                  <li>
                    <strong>OpenAI session</strong>{" "}
                    <code className="font-mono text-xs">max_response_output_tokens</code>
                    {" "}or built-in max session length &mdash; documented at
                    much higher than 90s, so unlikely root cause but worth
                    confirming.
                  </li>
                </ol>
              </DbgBlock>

              <DbgBlock id="dbg-likely" title="3. Most likely cause">
                <p className="text-sm">
                  90 seconds is a classic NLB idle-timeout signature. The
                  Realtime WebSocket carries audio frames continuously when
                  the agent is speaking, but during caller silence + model
                  thinking the socket can go quiet at the TCP layer for
                  &gt;the timeout window. The NLB drops the connection, the
                  client doesn&rsquo;t get a clean close because the NLB
                  doesn&rsquo;t emit one.
                </p>
                <p className="text-sm mt-3">
                  Two-part fix: (a) raise the NLB idle timeout to 350s+, and
                  (b) keep the WebSocket genuinely active with periodic
                  application-level pings.
                </p>
              </DbgBlock>

              <DbgBlock id="dbg-fix" title="4. Fix + code">
                <p className="text-sm mb-3">
                  Application-level keepalive on the Node{" "}
                  <code className="font-mono text-xs">ws</code> client:
                </p>
                <div className="rounded-md bg-navy-900 text-white p-4 overflow-x-auto">
                  <pre className="text-xs font-mono leading-relaxed">{`import WebSocket from "ws";

const ws = new WebSocket(REALTIME_URL, { headers });

let pingTimer: NodeJS.Timeout;

ws.on("open", () => {
  // 30s ping cadence stays well below any
  // sane NLB / ALB / CloudFront idle window.
  pingTimer = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) ws.ping();
  }, 30_000);
});

ws.on("pong", () => {
  // Optional: track RTT for observability.
});

ws.on("close", (code, reason) => {
  clearInterval(pingTimer);
  console.warn("realtime ws closed", { code, reason: reason.toString() });
  // Reconnect with exponential backoff if mid-call.
});

ws.on("error", (err) => {
  console.error("realtime ws error", err);
});`}</pre>
                </div>
                <p className="text-sm mt-4">
                  Plus AWS CLI for the NLB:
                </p>
                <div className="rounded-md bg-navy-900 text-white p-4 overflow-x-auto mt-2">
                  <pre className="text-xs font-mono leading-relaxed">{`aws elbv2 modify-target-group-attributes \\
  --target-group-arn $TG_ARN \\
  --attributes \\
    Key=deregistration_delay.timeout_seconds,Value=30 \\
    Key=stickiness.enabled,Value=false`}</pre>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Also confirm{" "}
                  <code className="font-mono">connection_idle_timeout</code> at
                  the NLB level (default 350s, can be raised to 6000s).
                </p>
              </DbgBlock>

              <DbgBlock id="dbg-reply" title="5. Customer-facing reply">
                <div className="rounded-md border border-border bg-white p-5">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-3 font-mono">
                    To: customer@example.com · Subject: Re: SE-4471 · Realtime sessions closing at 90s
                  </div>
                  <div className="text-sm text-navy-900 leading-relaxed space-y-3">
                    <p>Hi &mdash;</p>
                    <p>
                      90 seconds is a strong fingerprint for an idle
                      TCP-timeout on intermediate infrastructure, not the
                      Realtime API itself. The Realtime session has no
                      90-second cap, and a clean close from our side would
                      send a close frame with a code &mdash; the silent drop
                      you&rsquo;re seeing means the connection was severed
                      below the WebSocket layer.
                    </p>
                    <p>Two changes that almost always resolve this:</p>
                    <ol className="list-decimal list-inside space-y-1 ml-2">
                      <li>
                        Raise your AWS NLB
                        <code className="font-mono text-xs">{" "}connection_idle_timeout </code>
                        to at least 350s.
                      </li>
                      <li>
                        Send WebSocket pings every 30s from the client. Code
                        sample below.
                      </li>
                    </ol>
                    <p>
                      If you can grab the close code/reason from a long-form
                      log capture and the NLB CloudWatch metrics for that
                      target group, I can confirm we&rsquo;re looking at the
                      same root cause. Happy to jump on a 15-min call if it
                      moves faster.
                    </p>
                    <p>&mdash; Chad</p>
                  </div>
                </div>
              </DbgBlock>
            </article>
          </div>
        </div>
      </section>

      {/* About / contact */}
      <section className="py-20 bg-soft border-t border-border">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            <div className="md:col-span-7">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-hover">
                About
              </span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold tracking-tight text-navy-900 mt-3 mb-6">
                Why I want to do support engineering at OpenAI.
              </h2>
              <div className="space-y-4 text-navy-900 leading-relaxed">
                <p>
                  I&rsquo;ve been building on top of the OpenAI APIs since the
                  GPT-3 days &mdash; Realtime in production, Embeddings + Chat
                  Completions for RAG, Whisper for transcript pipelines,
                  function calling and structured outputs for orchestration.
                  Most of my time is spent in the messy middle: customer
                  infra, auth handoffs, debugging long-tail failures.
                </p>
                <p>
                  Support engineering is the role where that experience
                  actually helps people. When a developer files a ticket
                  about a Realtime session dying at 90s, they don&rsquo;t need
                  someone reading from a script &mdash; they need someone
                  who&rsquo;s shipped that exact stack and can debug from
                  symptoms to root cause. I want to be that person at the
                  shop building the APIs.
                </p>
              </div>
            </div>

            <div className="md:col-span-5">
              <div className="rounded-md border border-border bg-white p-6">
                <div className="text-xs uppercase tracking-wider text-muted-foreground mb-4">
                  Get in touch
                </div>
                <div className="space-y-3">
                  <a
                    href="mailto:chad.mccluskey@gmail.com"
                    className="flex items-center gap-3 text-sm text-navy-900 hover:text-brand-hover transition-colors"
                  >
                    <Mail aria-hidden="true" className="w-4 h-4" />
                    chad.mccluskey@gmail.com
                  </a>
                  <a
                    href="https://github.com/chadmccluskey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-navy-900 hover:text-brand-hover transition-colors"
                  >
                    <Github aria-hidden="true" className="w-4 h-4" />
                    github.com/chadmccluskey
                  </a>
                  <a
                    href="https://www.linkedin.com/in/chadmccluskey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-navy-900 hover:text-brand-hover transition-colors"
                  >
                    <Linkedin aria-hidden="true" className="w-4 h-4" />
                    linkedin.com/in/chadmccluskey
                  </a>
                  <a
                    href="https://stackconsultingai.com"
                    className="flex items-center gap-3 text-sm text-navy-900 hover:text-brand-hover transition-colors"
                  >
                    <Code2 aria-hidden="true" className="w-4 h-4" />
                    stackconsultingai.com
                  </a>
                </div>
                <p className="text-xs text-muted-foreground mt-6 leading-relaxed">
                  Based in South Orange County, California. Open to remote
                  with periodic on-site at OpenAI SF.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-8 border-t border-border">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-muted-foreground">
          © 2026 Chad McCluskey · Portfolio built with Next.js, hosted on
          Vercel, calling OpenAI in real time.
        </div>
      </footer>
    </main>
  );
}

function SectionHeader({
  number,
  label,
  Icon,
  title,
  tag,
}: {
  number: string;
  label: string;
  Icon: typeof Phone;
  title: string;
  tag: string;
}) {
  return (
    <div className="grid grid-cols-[auto_1fr] gap-5 items-start">
      <span className="font-heading text-3xl font-bold text-brand-soft tabular-nums pt-1">
        {number}
      </span>
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Icon aria-hidden="true" className="w-4 h-4 text-brand-hover" />
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-hover">
            {label}
          </span>
        </div>
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-navy-900 tracking-tight mb-2">
          {title}
        </h2>
        <p className="text-xs font-mono text-muted-foreground">{tag}</p>
      </div>
    </div>
  );
}

function DbgBlock({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20">
      <h3 className="font-heading text-lg font-semibold text-navy-900 mb-3">
        {title}
      </h3>
      <div className="text-navy-900 leading-relaxed">{children}</div>
    </section>
  );
}
