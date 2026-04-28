import Link from "next/link";
import { Github, Mail } from "lucide-react";

const sections = [
  { id: "voice", label: "Voice agent" },
  { id: "kb", label: "RAG knowledgebase" },
  { id: "automation", label: "Lead automation" },
  { id: "debug", label: "Debug walkthrough" },
];

export default function PortfolioHeader() {
  return (
    <header className="sticky top-0 z-30 backdrop-blur bg-white/85 border-b border-border">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-6">
        <Link
          href="/portfolio"
          className="font-heading font-bold text-navy-900 tracking-tight"
        >
          Chad McCluskey
          <span className="ml-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            · Support Engineer Portfolio
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="text-sm text-navy-900/70 hover:text-navy-900 transition-colors"
            >
              {s.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="https://github.com/chadmccluskey"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="p-2 rounded-md text-navy-900 hover:bg-soft transition-colors"
          >
            <Github aria-hidden="true" className="w-4 h-4" />
          </a>
          <a
            href="mailto:chad.mccluskey@gmail.com"
            aria-label="Email"
            className="p-2 rounded-md text-navy-900 hover:bg-soft transition-colors"
          >
            <Mail aria-hidden="true" className="w-4 h-4" />
          </a>
        </div>
      </div>
    </header>
  );
}
