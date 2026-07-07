import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Stack Consulting AI",
  description:
    "Terms for using Stack Consulting AI website, consulting services, free audits, SMS messages, and project agreements.",
  alternates: { canonical: "https://stackconsultingai.com/terms" },
};

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-background text-foreground pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto prose prose-invert">
        <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
        <p className="text-muted-foreground mb-4">Last updated: March 31, 2026</p>

        <h2 className="text-xl font-semibold mt-8 mb-4">1. Agreement to Terms</h2>
        <p>By accessing or using the Stack Consulting AI website (stackconsultingai.com) and services, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.</p>

        <h2 className="text-xl font-semibold mt-8 mb-4">2. Services</h2>
        <p>Stack Consulting AI provides web development, business automation, AI integration, VOIP phone systems, and related consulting services. Specific service terms, deliverables, timelines, and pricing are defined in individual project agreements.</p>

        <h2 className="text-xl font-semibold mt-8 mb-4">3. Use of Website</h2>
        <p>You agree to use our website only for lawful purposes. You may not:</p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>Use the site in any way that violates applicable laws or regulations</li>
          <li>Attempt to gain unauthorized access to any part of the site</li>
          <li>Use automated tools to scrape or collect data from the site</li>
          <li>Transmit any harmful or malicious code</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-4">4. Intellectual Property</h2>
        <p>All content on this website, including text, graphics, logos, and software, is the property of Stack Consulting AI and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works without our written consent.</p>

        <h2 className="text-xl font-semibold mt-8 mb-4">5. Free Consultations</h2>
        <p>Free strategy calls and website audits are provided for informational purposes only and do not create a client-service relationship. Any recommendations made during these sessions are general in nature.</p>

        <h2 className="text-xl font-semibold mt-8 mb-4">6. SMS Communications</h2>
        <p>By providing your phone number through our chat widget, you consent to receive service-related SMS messages from Stack Consulting AI. Message frequency varies based on your interactions. Message and data rates may apply. Text STOP to opt out at any time. Text HELP for assistance.</p>

        <h2 className="text-xl font-semibold mt-8 mb-4">7. Limitation of Liability</h2>
        <p>Stack Consulting AI provides its website and services &quot;as is&quot; without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages arising from your use of our website or services.</p>

        <h2 className="text-xl font-semibold mt-8 mb-4">8. Governing Law</h2>
        <p>These Terms are governed by the laws of the State of California. Any disputes shall be resolved in the courts of Orange County, California.</p>

        <h2 className="text-xl font-semibold mt-8 mb-4">9. Changes to Terms</h2>
        <p>We may update these Terms at any time. Continued use of our website after changes constitutes acceptance of the updated Terms.</p>

        <h2 className="text-xl font-semibold mt-8 mb-4">10. Contact Us</h2>
        <p>If you have questions about these Terms, contact us at:</p>
        <p className="text-muted-foreground">
          Stack Consulting AI<br />
          2105 Avenida Espada<br />
          San Clemente, CA 92673<br />
          hello@stackconsultingai.com<br />
          (949) 749-0001
        </p>
      </div>
    </main>
  );
}
