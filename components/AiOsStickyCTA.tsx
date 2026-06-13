"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

// Floating "Book a fit call" that appears once the visitor scrolls past the hero,
// so the primary action is always one tap away on the /ai-os landing page.
export default function AiOsStickyCTA() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <Link
      href="/#contact"
      aria-hidden={!show}
      tabIndex={show ? 0 : -1}
      className={`fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 px-5 py-3 rounded-md bg-brand text-white font-medium shadow-[0_8px_30px_rgba(62,106,239,0.35)] transition-all duration-300 motion-reduce:transition-none hover:bg-brand-hover ${
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      Book a fit call
      <ArrowRight aria-hidden="true" className="w-4 h-4" />
    </Link>
  );
}
