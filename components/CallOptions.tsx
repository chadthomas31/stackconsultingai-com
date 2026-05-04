"use client";

import { useEffect, useRef, useState } from "react";
import { Phone, MessageSquare, Video, Mail, X, ChevronDown } from "lucide-react";

/**
 * Multi-channel meeting chooser. Replaces hard `tel:` buttons that get
 * hijacked by Zoom on macOS. Visitor picks how they want to talk:
 *
 *   - Phone (tel:)              → opens dialer / Zoom hijack possible
 *   - Text (sms:)               → opens Messages / SMS app
 *   - Google Meet (mailto)      → emails Chad, he sends a Meet invite
 *   - Zoom (mailto)             → emails Chad, he sends a Zoom invite
 *
 * Mailto fallback is used because Calendly isn't wired up yet — when it is,
 * swap the GM/Zoom hrefs to direct booking URLs.
 */

const PHONE = "+19497490001";
const PHONE_DISPLAY = "(949) 749-0001";
const EMAIL = "chad.mccluskey@gmail.com";

const MEET_SUBJECT = encodeURIComponent("Schedule Google Meet — Stack Consulting AI");
const MEET_BODY = encodeURIComponent(
  "Hi Chad,\n\nI'd like to schedule a Google Meet to talk about working with Stack Consulting AI.\n\nWhat I want to discuss:\n\nMy timezone:\nGood times this week:\n\nThanks,",
);
const ZOOM_SUBJECT = encodeURIComponent("Schedule Zoom call — Stack Consulting AI");
const ZOOM_BODY = encodeURIComponent(
  "Hi Chad,\n\nI'd like to schedule a Zoom call to talk about working with Stack Consulting AI.\n\nWhat I want to discuss:\n\nMy timezone:\nGood times this week:\n\nThanks,",
);

export type CallOptionsVariant = "primary" | "ghost" | "navy";

export default function CallOptions({
  label = "Schedule a call",
  variant = "primary",
  className = "",
}: {
  label?: string;
  variant?: CallOptionsVariant;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const triggerClass =
    variant === "primary"
      ? "btn-cta-call"
      : variant === "navy"
        ? "inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md bg-white text-navy-900 hover:bg-white/90 font-semibold transition-colors"
        : "btn-ghost";

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={`${triggerClass} inline-flex items-center gap-2`}
      >
        <Phone className="w-4 h-4" aria-hidden="true" />
        {label}
        <ChevronDown
          className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute left-0 right-0 sm:right-auto sm:min-w-[320px] mt-2 bg-white border border-border rounded-md shadow-lg overflow-hidden z-50"
        >
          <div className="px-4 py-3 bg-soft border-b border-border flex items-start justify-between gap-2">
            <div>
              <p className="text-xs uppercase tracking-wider text-navy-700/60 font-semibold">
                How would you like to connect?
              </p>
              <p className="text-xs text-navy-700/60 mt-0.5">
                Pick whichever works for you.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="text-navy-700/60 hover:text-navy-900 -mr-1 -mt-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <a
            role="menuitem"
            href={`tel:${PHONE}`}
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-3 hover:bg-soft border-b border-border transition-colors"
          >
            <Phone className="w-5 h-5 text-orange-600 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-navy-900">Call now</p>
              <p className="text-xs text-navy-700/60">
                {PHONE_DISPLAY} · 8am-6pm PT, Mon-Fri
              </p>
            </div>
          </a>

          <a
            role="menuitem"
            href={`sms:${PHONE}`}
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-3 hover:bg-soft border-b border-border transition-colors"
          >
            <MessageSquare className="w-5 h-5 text-orange-600 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-navy-900">Text us</p>
              <p className="text-xs text-navy-700/60">Reply within 1 business hour</p>
            </div>
          </a>

          <a
            role="menuitem"
            href={`mailto:${EMAIL}?subject=${MEET_SUBJECT}&body=${MEET_BODY}`}
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-3 hover:bg-soft border-b border-border transition-colors"
          >
            <Video className="w-5 h-5 text-brand shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-navy-900">
                Schedule a Google Meet
              </p>
              <p className="text-xs text-navy-700/60">
                We&apos;ll send a calendar invite
              </p>
            </div>
          </a>

          <a
            role="menuitem"
            href={`mailto:${EMAIL}?subject=${ZOOM_SUBJECT}&body=${ZOOM_BODY}`}
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-3 hover:bg-soft border-b border-border transition-colors"
          >
            <Video className="w-5 h-5 text-brand shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-navy-900">Schedule a Zoom call</p>
              <p className="text-xs text-navy-700/60">
                We&apos;ll send a Zoom invite
              </p>
            </div>
          </a>

          <a
            role="menuitem"
            href={`mailto:${EMAIL}`}
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-3 hover:bg-soft transition-colors"
          >
            <Mail className="w-5 h-5 text-navy-700 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-navy-900">Just email us</p>
              <p className="text-xs text-navy-700/60 truncate">{EMAIL}</p>
            </div>
          </a>
        </div>
      )}
    </div>
  );
}
