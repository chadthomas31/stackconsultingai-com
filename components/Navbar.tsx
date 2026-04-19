"use client";

import { useState, useEffect, type MouseEvent } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

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
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? "bg-white/85 backdrop-blur-xl border-b border-border"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="w-full px-4 md:px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo — dark version for light bg */}
          <a
            href="/"
            onClick={handleLogoClick}
            className="hover:opacity-80 transition-opacity"
          >
            <Image
              src="/stack-logo.png"
              alt="Stack Consulting AI"
              width={600}
              height={150}
              className="h-[96px] md:h-[128px] w-auto"
              priority
            />
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
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
              href="/#contact"
              onClick={(e) => handleSectionClick(e, "contact")}
              className="btn-accent text-sm"
            >
              Get Started
            </a>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-navy-900"
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border pt-4 space-y-2">
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
              href="/#contact"
              onClick={(e) => handleSectionClick(e, "contact")}
              className="btn-accent block w-full text-center"
            >
              Get Started
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}
