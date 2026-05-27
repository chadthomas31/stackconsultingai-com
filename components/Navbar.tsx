"use client";

import { useState, useEffect, type MouseEvent } from "react";
import { Menu, X, Home } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  const isPortal = pathname.startsWith("/dashboard") ||
                  pathname.startsWith("/projects") ||
                  pathname.startsWith("/invoices") ||
                  pathname.startsWith("/messages") ||
                  pathname.startsWith("/admin") ||
                  pathname === "/login" ||
                  pathname === "/register";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );

    const sectionIds = ["assessment", "services", "portfolio", "testimonials", "faq", "contact"];
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  if (isPortal) return null;

  const handleSectionClick = (e: MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      e.preventDefault();
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  const handleLogoClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (window.location.pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const navLinks = [
    { label: "Free assessment", id: "assessment" },
    { label: "Services", id: "services" },
    { label: "Work", id: "portfolio" },
    { label: "FAQ", id: "faq" },
  ];

  return (
    <nav
      aria-label="Main navigation"
      style={{ top: "var(--announcement-h, 0px)" }}
      className={`fixed left-0 right-0 z-40 overflow-visible transition-all duration-300 ${
        isScrolled
          ? "bg-white/85 backdrop-blur-xl border-b border-border"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          {/* Logo — dark version for light bg */}
          <a
            href="/"
            onClick={handleLogoClick}
            className="hover:opacity-80 transition-opacity relative z-10"
          >
            <Image
              src="/stack-logo-trimmed.png"
              alt="Stack Consulting AI"
              width={744}
              height={206}
              className="h-9 md:h-10 w-auto"
              priority
            />
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6 whitespace-nowrap">
            <a
              href="/"
              onClick={handleLogoClick}
              className="inline-flex items-center gap-1.5 text-sm transition-colors duration-200 font-medium text-navy-900/70 hover:text-navy-900 relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:bg-brand after:transition-all after:duration-300 after:w-0 hover:after:w-full"
            >
              <Home className="w-4 h-4" aria-hidden="true" />
              Home
            </a>
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`/#${link.id}`}
                onClick={(e) => handleSectionClick(e, link.id)}
                className={`text-sm transition-colors duration-200 font-medium relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:bg-brand after:transition-all after:duration-300 ${
                  activeSection === link.id
                    ? "text-navy-900 after:w-full"
                    : "text-navy-900/70 hover:text-navy-900 after:w-0 hover:after:w-full"
                }`}
              >
                {link.label}
              </a>
            ))}
            <a
              href="/ai-os"
              className="text-sm transition-colors duration-200 font-medium text-navy-900/70 hover:text-navy-900 relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:bg-brand after:transition-all after:duration-300 after:w-0 hover:after:w-full"
            >
              AI OS
            </a>
            <a
              href="/demos"
              className="text-sm transition-colors duration-200 font-medium text-navy-900/70 hover:text-navy-900 relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:bg-brand after:transition-all after:duration-300 after:w-0 hover:after:w-full"
            >
              Live Demos
            </a>
            <a
              href="/tools"
              className="text-sm transition-colors duration-200 font-medium text-navy-900/70 hover:text-navy-900 relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:bg-brand after:transition-all after:duration-300 after:w-0 hover:after:w-full"
            >
              Free Tools
            </a>
            <a
              href="/stack-report"
              className="text-sm transition-colors duration-200 font-medium text-navy-900/70 hover:text-navy-900 relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:bg-brand after:transition-all after:duration-300 after:w-0 hover:after:w-full"
            >
              Stack Report
            </a>
            <a
              href="/login"
              className="text-sm transition-colors duration-200 font-medium text-navy-900/70 hover:text-navy-900 relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:bg-brand after:transition-all after:duration-300 after:w-0 hover:after:w-full"
            >
              Client Portal
            </a>
            <a
              href="/#contact"
              onClick={(e) => handleSectionClick(e, "contact")}
              className="btn-cta-call text-sm"
            >
              Get Started
            </a>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-3 -mr-2 text-navy-900 min-h-[44px] min-w-[44px] inline-flex items-center justify-center"
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border pt-4 space-y-2">
            <a
              href="/"
              onClick={(e) => {
                handleLogoClick(e);
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 w-full text-left px-4 py-2 text-navy-900/80 hover:bg-soft rounded-md font-medium"
            >
              <Home className="w-4 h-4" aria-hidden="true" />
              Home
            </a>
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`/#${link.id}`}
                onClick={(e) => handleSectionClick(e, link.id)}
                className="block w-full text-left px-4 py-2 text-navy-900/80 hover:bg-soft rounded-md font-medium"
              >
                {link.label}
              </a>
            ))}
            <a
              href="/ai-os"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block w-full text-left px-4 py-2 text-navy-900/80 hover:bg-soft rounded-md font-medium"
            >
              AI OS
            </a>
            <a
              href="/demos"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block w-full text-left px-4 py-2 text-navy-900/80 hover:bg-soft rounded-md font-medium"
            >
              Live Demos
            </a>
            <a
              href="/tools"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block w-full text-left px-4 py-2 text-navy-900/80 hover:bg-soft rounded-md font-medium"
            >
              Free Tools
            </a>
            <a
              href="/stack-report"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block w-full text-left px-4 py-2 text-navy-900/80 hover:bg-soft rounded-md font-medium"
            >
              Stack Report
            </a>
            <a
              href="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block w-full text-left px-4 py-2 text-navy-900/80 hover:bg-soft rounded-md font-medium"
            >
              Client Portal
            </a>
            <a
              href="/#contact"
              onClick={(e) => handleSectionClick(e, "contact")}
              className="btn-cta-call block w-full text-center"
            >
              Get Started
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}
