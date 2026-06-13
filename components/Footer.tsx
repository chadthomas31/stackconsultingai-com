"use client";

import { Mail, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
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
                <Link href="/services" className="text-muted-foreground hover:text-primary hover:translate-x-1 transition-all duration-200 inline-block">
                  All Services
                </Link>
              </li>
              <li>
                <Link href="/services/web-development" className="text-muted-foreground hover:text-primary hover:translate-x-1 transition-all duration-200 inline-block">
                  Web Development
                </Link>
              </li>
              <li>
                <Link href="/services/business-automation" className="text-muted-foreground hover:text-primary hover:translate-x-1 transition-all duration-200 inline-block">
                  Business Automation
                </Link>
              </li>
              <li>
                <Link href="/services/ecommerce" className="text-muted-foreground hover:text-primary hover:translate-x-1 transition-all duration-200 inline-block">
                  E-commerce
                </Link>
              </li>
              <li>
                <Link href="/services/maintenance" className="text-muted-foreground hover:text-primary hover:translate-x-1 transition-all duration-200 inline-block">
                  Maintenance
                </Link>
              </li>
              <li>
                <Link href="/services/guest-wifi" className="text-muted-foreground hover:text-primary hover:translate-x-1 transition-all duration-200 inline-block">
                  Guest WiFi
                </Link>
              </li>
            </ul>
          </div>

          {/* Products & Tools */}
          <div>
            <h3 className="font-semibold mb-4">Products &amp; Tools</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/ai-os" className="text-muted-foreground hover:text-primary hover:translate-x-1 transition-all duration-200 inline-block">
                  AI OS
                </Link>
              </li>
              <li>
                <Link href="/ai-receptionist" className="text-muted-foreground hover:text-primary hover:translate-x-1 transition-all duration-200 inline-block">
                  AI Receptionist
                </Link>
              </li>
              <li>
                <Link href="/ai-readiness-audit" className="text-muted-foreground hover:text-primary hover:translate-x-1 transition-all duration-200 inline-block">
                  AI Readiness Audit
                </Link>
              </li>
              <li>
                <Link href="/free-ai-site-audit" className="text-muted-foreground hover:text-primary hover:translate-x-1 transition-all duration-200 inline-block">
                  Free Site Audit
                </Link>
              </li>
              <li>
                <Link href="/ai-automation-small-business-guide" className="text-muted-foreground hover:text-primary hover:translate-x-1 transition-all duration-200 inline-block">
                  Automation Guide
                </Link>
              </li>
              <li>
                <Link href="/demos" className="text-muted-foreground hover:text-primary hover:translate-x-1 transition-all duration-200 inline-block">
                  Live Demos
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="text-muted-foreground hover:text-primary hover:translate-x-1 transition-all duration-200 inline-block">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link href="/tools" className="text-muted-foreground hover:text-primary hover:translate-x-1 transition-all duration-200 inline-block">
                  Free Tools
                </Link>
              </li>
              <li>
                <Link href="/stack-report" className="text-muted-foreground hover:text-primary hover:translate-x-1 transition-all duration-200 inline-block">
                  The Stack Report
                </Link>
              </li>
            </ul>
          </div>

          {/* Service Area */}
          <div>
            <h3 className="font-semibold mb-4">Service Area</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/services/ai-consulting-orange-county" className="text-muted-foreground hover:text-primary hover:translate-x-1 transition-all duration-200 inline-block">
                  Orange County
                </Link>
              </li>
              <li>
                <Link href="/services/ai-consulting-irvine" className="text-muted-foreground hover:text-primary hover:translate-x-1 transition-all duration-200 inline-block">
                  Irvine
                </Link>
              </li>
              <li>
                <Link href="/services/ai-consulting-newport-beach" className="text-muted-foreground hover:text-primary hover:translate-x-1 transition-all duration-200 inline-block">
                  Newport Beach
                </Link>
              </li>
              <li>
                <Link href="/services/ai-consulting-costa-mesa" className="text-muted-foreground hover:text-primary hover:translate-x-1 transition-all duration-200 inline-block">
                  Costa Mesa
                </Link>
              </li>
              <li>
                <Link href="/services/ai-consulting-mission-viejo" className="text-muted-foreground hover:text-primary hover:translate-x-1 transition-all duration-200 inline-block">
                  Mission Viejo
                </Link>
              </li>
              <li>
                <Link href="/services/ai-consulting-san-clemente" className="text-muted-foreground hover:text-primary hover:translate-x-1 transition-all duration-200 inline-block">
                  San Clemente
                </Link>
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
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <span>|</span>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
