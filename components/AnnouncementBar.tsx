"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { Sparkles, X, ArrowRight } from "lucide-react";

const STORAGE_KEY = "sc-announcement-launch-partner-dismissed";
const BAR_HEIGHT_PX = 40;

interface Props {
  slotsRemaining: number;
  totalSlots: number;
  targetSectionId?: string;
}

export default function AnnouncementBar({
  slotsRemaining,
  totalSlots,
  targetSectionId = "founding-clients",
}: Props) {
  // Start hidden to avoid pre-hydration flicker; then read the dismiss flag.
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const wasDismissed =
      typeof window !== "undefined" &&
      window.localStorage.getItem(STORAGE_KEY) === "1";
    setVisible(!wasDismissed);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.style.setProperty(
      "--announcement-h",
      visible ? `${BAR_HEIGHT_PX}px` : "0px",
    );
    return () => {
      document.documentElement.style.setProperty("--announcement-h", "0px");
    };
  }, [visible]);

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    const el = document.getElementById(targetSectionId);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleDismiss = () => {
    setVisible(false);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, "1");
    }
  };

  if (!visible) return null;

  const slotsCopy =
    slotsRemaining === 0
      ? "All 10 slots filled — join the waitlist"
      : slotsRemaining === totalSlots
        ? `${totalSlots} slots open`
        : `${slotsRemaining} of ${totalSlots} slots left`;

  return (
    <div
      role="region"
      aria-label="Launch Partner Program announcement"
      className="fixed top-0 inset-x-0 z-50 bg-navy-900 text-white"
      style={{ height: `${BAR_HEIGHT_PX}px` }}
    >
      <div className="h-full flex items-center gap-2 px-3 md:px-6">
        <a
          href={`/#${targetSectionId}`}
          onClick={handleClick}
          className="flex-1 min-w-0 flex items-center justify-center gap-2 text-[13px] md:text-sm font-medium hover:text-brand-soft transition-colors group"
        >
          <Sparkles className="w-3.5 h-3.5 text-brand flex-shrink-0" />
          <span className="font-semibold truncate">
            Launch Partner Program
          </span>
          <span className="opacity-60 hidden sm:inline">·</span>
          <span className="opacity-90 truncate">{slotsCopy}</span>
          <ArrowRight className="w-3.5 h-3.5 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
        </a>
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss announcement"
          className="flex-shrink-0 p-1.5 rounded hover:bg-white/10 text-white/70 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
