"use client";

import { useMemo, useState } from "react";
import { Mic, PhoneCall, Send, Square } from "lucide-react";

import DotHalftone from "@/components/DotHalftone";

type SpeechRecognitionConstructor = new () => SpeechRecognition;

type SpeechRecognition = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionEvent = {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
    length: number;
  };
};

type SpeechWindow = Window & {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
};

const SCENARIOS = [
  {
    id: "auto",
    label: "Auto shop",
    business: "Tito's Automotive",
    caller: "My check engine light is on. Can I come in today?",
    response: "I can help with that. Are you safe to drive, and what time works best today?",
    gradient: ["#34d399", "#0ea5e9"] as [string, string],
  },
  {
    id: "clinic",
    label: "Clinic",
    business: "Pacific Wellness Clinic",
    caller: "I need to reschedule my appointment.",
    response: "No problem. I can look for the next opening and send the updated time.",
    gradient: ["#a7f3d0", "#2563eb"] as [string, string],
  },
  {
    id: "contractor",
    label: "Contractor",
    business: "Coastal Plumbing",
    caller: "There is water under the sink and I need someone fast.",
    response: "I have the urgency marked. Is the water shut off, and what address should the tech use?",
    gradient: ["#facc15", "#ef4444"] as [string, string],
  },
];

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function svgDataUrl({
  business,
  phase,
}: {
  business: string;
  phase: "ringing" | "listening" | "booking";
}) {
  const phaseLabel =
    phase === "ringing" ? "Incoming call" : phase === "listening" ? "AI listening" : "Booking next step";
  const activeColor = phase === "ringing" ? "#facc15" : phase === "listening" ? "#22d3ee" : "#34d399";

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="960" height="560" viewBox="0 0 960 560">
  <rect width="960" height="560" fill="#f8fafc"/>
  <rect x="56" y="44" width="848" height="472" rx="34" fill="#0f172a"/>
  <rect x="92" y="80" width="776" height="400" rx="22" fill="#f8fafc"/>
  <path d="M92 174H868" stroke="#cbd5e1" stroke-width="9"/>
  <path d="M92 334H868" stroke="#cbd5e1" stroke-width="9"/>
  <path d="M156 306c64-118 168-118 232 0M572 306c64-118 168-118 232 0" stroke="#0f172a" stroke-width="34" fill="none" stroke-linecap="round"/>
  <circle cx="272" cy="302" r="84" fill="#0f172a"/>
  <circle cx="688" cy="302" r="84" fill="#0f172a"/>
  <path d="M244 330c20 21 58 21 78 0" stroke="${activeColor}" stroke-width="18" fill="none" stroke-linecap="round"/>
  <circle cx="246" cy="286" r="13" fill="${activeColor}"/>
  <circle cx="310" cy="286" r="13" fill="${activeColor}"/>
  <path d="M648 274h78v58h-78z" fill="${activeColor}"/>
  <path d="M626 292l22-18v58l-22-18zM726 274l48-34v126l-48-34z" fill="${activeColor}"/>
  <path d="M380 300h200" stroke="${activeColor}" stroke-width="17" stroke-linecap="round" stroke-dasharray="10 23"/>
  <circle cx="480" cy="300" r="45" fill="${activeColor}"/>
  <path d="M454 298h52M480 272v52" stroke="#0f172a" stroke-width="10" stroke-linecap="round"/>
  <text x="480" y="136" fill="#0f172a" font-family="Inter, Arial, sans-serif" font-size="44" font-weight="900" text-anchor="middle">${escapeXml(
    business,
  )}</text>
  <text x="480" y="420" fill="#0f172a" font-family="Inter, Arial, sans-serif" font-size="34" font-weight="900" text-anchor="middle">${escapeXml(
    phaseLabel,
  )}</text>
  <text x="480" y="454" fill="#475569" font-family="Inter, Arial, sans-serif" font-size="22" font-weight="800" text-anchor="middle">Caller to AI receptionist</text>
</svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function responseFor(input: string, fallback: string) {
  const text = input.toLowerCase();
  if (text.includes("price") || text.includes("cost") || text.includes("quote")) {
    return "I can get you a quote. What service do you need, and when should the owner call back?";
  }
  if (text.includes("book") || text.includes("appointment") || text.includes("schedule")) {
    return "I can book that. What day works best, and should I send the confirmation by text?";
  }
  if (text.includes("emergency") || text.includes("urgent") || text.includes("fast")) {
    return "I marked this urgent. I can collect the address and route this to the on-call person.";
  }
  if (text.trim().length > 0) {
    return "I can help with that. Let me capture the details and route this to the right person.";
  }
  return fallback;
}

export default function RetroCallPreview() {
  const [scenarioId, setScenarioId] = useState(SCENARIOS[0].id);
  const scenario = SCENARIOS.find((item) => item.id === scenarioId) ?? SCENARIOS[0];
  const [callerText, setCallerText] = useState(scenario.caller);
  const [phase, setPhase] = useState<"ringing" | "listening" | "booking">("ringing");
  const [listening, setListening] = useState(false);

  const response = responseFor(callerText, scenario.response);
  const src = useMemo(
    () =>
      svgDataUrl({
        business: scenario.business,
        phase,
      }),
    [callerText, phase, response, scenario.business],
  );

  function chooseScenario(id: string) {
    const next = SCENARIOS.find((item) => item.id === id) ?? SCENARIOS[0];
    setScenarioId(next.id);
    setCallerText(next.caller);
    setPhase("ringing");
  }

  function listen() {
    const speechWindow = window as SpeechWindow;
    const Recognition = speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;

    if (!Recognition) {
      setPhase("listening");
      return;
    }

    const recognition = new Recognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.onresult = (event) => {
      const last = event.results[event.results.length - 1];
      const transcript = last?.[0]?.transcript;
      if (transcript) {
        setCallerText(transcript);
        setPhase("booking");
      }
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    setListening(true);
    setPhase("listening");
    recognition.start();
  }

  return (
    <section className="py-24 bg-soft">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-12 items-center">
          <div>
            <span className="section-kicker">Interactive preview</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy-900 mt-3 mb-4 tracking-tight">
              See what your AI receptionist does with a real caller.
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Type what a customer would say, or use your browser mic. The
              preview turns it into a call handoff: caller intent, AI response,
              and the next action your business receives.
            </p>

            <div className="space-y-5">
              <div className="flex flex-wrap gap-2" role="tablist" aria-label="Business type">
                {SCENARIOS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={scenario.id === item.id}
                    onClick={() => chooseScenario(item.id)}
                    className={
                      scenario.id === item.id
                        ? "rounded-md bg-navy-900 text-white px-4 py-2 text-sm font-semibold"
                        : "rounded-md border border-border bg-white text-navy-900 px-4 py-2 text-sm font-semibold hover:border-brand transition-colors"
                    }
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <label className="block">
                <span className="block text-sm font-semibold text-navy-900 mb-2">
                  What does the caller say?
                </span>
                <textarea
                  value={callerText}
                  onChange={(event) => {
                    setCallerText(event.target.value);
                    setPhase("listening");
                  }}
                  rows={4}
                  className="w-full rounded-md border border-border bg-white px-4 py-3 text-navy-900 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                />
              </label>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => setPhase("booking")}
                  className="btn-cta-call inline-flex items-center justify-center gap-2"
                >
                  <Send aria-hidden="true" className="w-4 h-4" />
                  Generate response
                </button>
                <button
                  type="button"
                  onClick={listen}
                  className="btn-ghost inline-flex items-center justify-center gap-2"
                >
                  {listening ? (
                    <Square aria-hidden="true" className="w-4 h-4" />
                  ) : (
                    <Mic aria-hidden="true" className="w-4 h-4" />
                  )}
                  {listening ? "Listening" : "Speak caller line"}
                </button>
              </div>

              <p className="text-sm text-muted-foreground">
                Preview reply: <span className="font-semibold text-navy-900">{response}</span>
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-md border border-navy-900 bg-navy-900 p-4 shadow-2xl shadow-navy-900/20">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-white">
                  <PhoneCall aria-hidden="true" className="w-4 h-4 text-brand-soft" />
                  <span className="text-sm font-semibold">{scenario.business}</span>
                </div>
                <span className="text-xs font-mono uppercase tracking-wide text-brand-soft">
                  {phase}
                </span>
              </div>
              <DotHalftone
                src={src}
                gradient={scenario.gradient}
                accent="#34d399"
                className="w-full aspect-[1.45] rounded-md bg-white"
              />
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-md bg-white/[0.08] border border-white/10 p-4">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-soft mb-2">
                    Caller says
                  </div>
                  <p className="text-sm leading-relaxed text-white">
                    &ldquo;{callerText || "Caller asks a question."}&rdquo;
                  </p>
                </div>
                <div className="rounded-md bg-emerald-400/10 border border-emerald-300/20 p-4">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-200 mb-2">
                    AI handles it
                  </div>
                  <p className="text-sm leading-relaxed text-white">{response}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-white/70">
                <span className="rounded-full border border-white/10 px-3 py-1">Intent captured</span>
                <span className="rounded-full border border-white/10 px-3 py-1">Transcript logged</span>
                <span className="rounded-full border border-white/10 px-3 py-1">Owner notified</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
