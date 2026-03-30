import { Mail, Phone } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative py-12 px-4 border-t border-border">
      {/* Gradient Divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <Image
              src="/stack-logo-full.png"
              alt="Stack Consulting AI"
              width={200}
              height={50}
              className="h-10 w-auto mb-2"
            />
            <p className="text-muted-foreground">
              You don’t need more tools. You need a better stack.
            </p>
            <p className="text-sm text-muted-foreground mt-2">Stack smarter. Move faster.</p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <div className="space-y-2">
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
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
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
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border text-center text-muted-foreground">
          <p>© {currentYear} Stack Consulting AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}