"use client";

import { useState, useEffect, type MouseEvent } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
    { label: "Services", id: "services" },
    { label: "Portfolio", id: "portfolio" },
    { label: "Videos", id: "videos" },
    { label: "VOIP", id: "voip" },
    { label: "Estimator", id: "pricing" },
    { label: "Contact", id: "contact" },
  ];

  return (
    <nav
      aria-label="Main navigation"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-lg shadow-black/5"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a
            href="/"
            onClick={handleLogoClick}
            className="hover:opacity-80 transition-opacity"
          >
            <Image
              src="/stack-logo-full.png"
              alt="Stack Consulting AI"
              width={200}
              height={50}
              className="h-10 w-auto"
              priority
            />
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`/#${link.id}`}
                onClick={(e) => handleSectionClick(e, link.id)}
                className="text-muted-foreground hover:text-primary transition-colors duration-200 font-medium relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
              >
                {link.label}
              </a>
            ))}
            <a
              href="/#contact"
              onClick={(e) => handleSectionClick(e, "contact")}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all duration-300 shadow-lg shadow-primary/20"
            >
              Get Started
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border pt-4 space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`/#${link.id}`}
                onClick={(e) => handleSectionClick(e, link.id)}
                className="block w-full text-left px-4 py-2 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-colors font-medium"
              >
                {link.label}
              </a>
            ))}
            <a
              href="/#contact"
              onClick={(e) => handleSectionClick(e, "contact")}
              className="block w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 text-center"
            >
              Get Started
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}
