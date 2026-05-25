"use client";

import { Mail, Phone } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  const isPortal = pathname.startsWith("/dashboard") ||
                  pathname.startsWith("/projects") ||
                  pathname.startsWith("/invoices") ||
                  pathname.startsWith("/messages") ||
                  pathname.startsWith("/admin") ||
                  pathname === "/login" ||
                  pathname === "/register";

  if (isPortal) return null;

  return (
    <footer className="relative py-12 px-4 border-t border-border">
      {/* Gradient Divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <Image
              src="/stack-logo.png?v=4"
              alt="Stack Consulting AI"
              width={1024}
              height={1024}
              className="h-[96px] w-auto mb-2"
            />
            <p className="text-muted-foreground">
              You don’t need more tools. You need a better stack.
            </p>
            <p className="text-sm text-muted-foreground mt-2">Stack smarter. Move faster.</p>
            <div className="mt-4 space-y-2">
              <a
                href="mailto:hello@stackconsultingai.com"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary hover:translate-x-1 transition-all duration-200"
              >
                <Mail className="w-4 h-4" />
                <span>hello@stackconsultingai.com</span>
              </a>
              <a
                href="tel:+19497490001"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary hover:translate-x-1 transition-all duration-200"
              >
                <Phone className="w-4 h-4" />
                <span>(949) 749-0001</span>
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <a href="/services" className="text-muted-foreground hover:text-primary hover:translate-x-1 transition-all duration-200 inline-block">
                  All Services
                </a>
              </li>
              <li>
                <a href="/services/web-development" className="text-muted-foreground hover:text-primary hover:translate-x-1 transition-all duration-200 inline-block">
                  Web Development
                </a>
              </li>
              <li>
                <a href="/services/business-automation" className="text-muted-foreground hover:text-primary hover:translate-x-1 transition-all duration-200 inline-block">
                  Business Automation
                </a>
              </li>
              <li>
                <a href="/services/ecommerce" className="text-muted-foreground hover:text-primary hover:translate-x-1 transition-all duration-200 inline-block">
                  E-commerce
                </a>
              </li>
              <li>
                <a href="/services/maintenance" className="text-muted-foreground hover:text-primary hover:translate-x-1 transition-all duration-200 inline-block">
                  Maintenance
                </a>
              </li>
              <li>
                <a href="/services/guest-wifi" className="text-muted-foreground hover:text-primary hover:translate-x-1 transition-all duration-200 inline-block">
                  Guest WiFi
                </a>
              </li>
            </ul>
          </div>

          {/* Products & Tools */}
          <div>
            <h3 className="font-semibold mb-4">Products &amp; Tools</h3>
            <ul className="space-y-2">
              <li>
                <a href="/ai-os" className="text-muted-foreground hover:text-primary hover:translate-x-1 transition-all duration-200 inline-block">
                  AI OS
                </a>
              </li>
              <li>
                <a href="/ai-receptionist" className="text-muted-foreground hover:text-primary hover:translate-x-1 transition-all duration-200 inline-block">
                  AI Receptionist
                </a>
              </li>
              <li>
                <a href="/ai-readiness-audit" className="text-muted-foreground hover:text-primary hover:translate-x-1 transition-all duration-200 inline-block">
                  AI Readiness Audit
                </a>
              </li>
              <li>
                <a href="/free-ai-site-audit" className="text-muted-foreground hover:text-primary hover:translate-x-1 transition-all duration-200 inline-block">
                  Free Site Audit
                </a>
              </li>
              <li>
                <a href="/ai-automation-small-business-guide" className="text-muted-foreground hover:text-primary hover:translate-x-1 transition-all duration-200 inline-block">
                  Automation Guide
                </a>
              </li>
              <li>
                <a href="/demos" className="text-muted-foreground hover:text-primary hover:translate-x-1 transition-all duration-200 inline-block">
                  Live Demos
                </a>
              </li>
              <li>
                <a href="/portfolio" className="text-muted-foreground hover:text-primary hover:translate-x-1 transition-all duration-200 inline-block">
                  Portfolio
                </a>
              </li>
              <li>
                <a href="/tools" className="text-muted-foreground hover:text-primary hover:translate-x-1 transition-all duration-200 inline-block">
                  Free Tools
                </a>
              </li>
              <li>
                <a href="/stack-report" className="text-muted-foreground hover:text-primary hover:translate-x-1 transition-all duration-200 inline-block">
                  The Stack Report
                </a>
              </li>
            </ul>
          </div>

          {/* Service Area */}
          <div>
            <h3 className="font-semibold mb-4">Service Area</h3>
            <ul className="space-y-2">
              <li>
                <a href="/services/ai-consulting-orange-county" className="text-muted-foreground hover:text-primary hover:translate-x-1 transition-all duration-200 inline-block">
                  Orange County
                </a>
              </li>
              <li>
                <a href="/services/ai-consulting-irvine" className="text-muted-foreground hover:text-primary hover:translate-x-1 transition-all duration-200 inline-block">
                  Irvine
                </a>
              </li>
              <li>
                <a href="/services/ai-consulting-newport-beach" className="text-muted-foreground hover:text-primary hover:translate-x-1 transition-all duration-200 inline-block">
                  Newport Beach
                </a>
              </li>
              <li>
                <a href="/services/ai-consulting-costa-mesa" className="text-muted-foreground hover:text-primary hover:translate-x-1 transition-all duration-200 inline-block">
                  Costa Mesa
                </a>
              </li>
              <li>
                <a href="/services/ai-consulting-mission-viejo" className="text-muted-foreground hover:text-primary hover:translate-x-1 transition-all duration-200 inline-block">
                  Mission Viejo
                </a>
              </li>
              <li>
                <a href="/services/ai-consulting-san-clemente" className="text-muted-foreground hover:text-primary hover:translate-x-1 transition-all duration-200 inline-block">
                  San Clemente
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border text-center text-muted-foreground space-y-2">
          <p>© {currentYear} Stack Consulting AI. All rights reserved.</p>
          <p className="text-sm">
            Sister brand:{" "}
            <a
              href="https://strategicsync.com"
              target="_blank"
              rel="noopener"
              className="hover:text-primary transition-colors underline-offset-2 hover:underline"
            >
              Strategic Sync
            </a>{" "}
            — AI automation &amp; integration for businesses with existing phone, CRM, and workflow systems.
          </p>
          <div className="flex justify-center gap-4 text-sm">
            <a href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</a>
            <span>|</span>
            <a href="/terms" className="hover:text-primary transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
