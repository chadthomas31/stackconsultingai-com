import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Stack Consulting AI",
  description:
    "Privacy practices for Stack Consulting AI website forms, calls, analytics, newsletter subscriptions, and SMS follow-up.",
  alternates: { canonical: "https://stackconsultingai.com/privacy" },
};

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-background text-foreground pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto prose prose-invert">
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
        <p className="text-muted-foreground mb-4">Last updated: March 31, 2026</p>

        <h2 className="text-xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
        <p>Stack Consulting AI (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) collects information you voluntarily provide when you:</p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>Fill out a contact form on our website</li>
          <li>Book an appointment through our calendar</li>
          <li>Interact with our chat widget</li>
          <li>Call our business phone number</li>
          <li>Subscribe to our newsletter</li>
        </ul>
        <p className="mt-4">This may include your name, email address, phone number, business name, and details about your project or inquiry.</p>

        <h2 className="text-xl font-semibold mt-8 mb-4">2. How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>Respond to your inquiries and provide requested services</li>
          <li>Send appointment confirmations and reminders via SMS or email</li>
          <li>Follow up on service requests</li>
          <li>Improve our website and services</li>
          <li>Send occasional updates about our services (with your consent)</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-4">3. SMS/Text Messaging</h2>
        <p>By submitting your phone number through our chat widget, you consent to receive customer care text messages from Stack Consulting AI related to your inquiry. Message frequency varies. Message and data rates may apply. Text STOP to cancel. Text HELP for help.</p>

        <h2 className="text-xl font-semibold mt-8 mb-4">4. Information Sharing</h2>
        <p>We do not sell, trade, or rent your personal information to third parties. We may share information with trusted service providers who assist us in operating our business (e.g., CRM platforms, email services), subject to confidentiality agreements.</p>

        <h2 className="text-xl font-semibold mt-8 mb-4">5. Cookies and Analytics</h2>
        <p>Our website uses cookies and analytics tools (including Google Analytics and Google Tag Manager) to understand how visitors use our site. You can control cookie preferences through your browser settings.</p>

        <h2 className="text-xl font-semibold mt-8 mb-4">6. Data Security</h2>
        <p>We implement reasonable security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.</p>

        <h2 className="text-xl font-semibold mt-8 mb-4">7. Your Rights</h2>
        <p>You may request to access, update, or delete your personal information at any time by contacting us at hello@stackconsultingai.com.</p>

        <h2 className="text-xl font-semibold mt-8 mb-4">8. Contact Us</h2>
        <p>If you have questions about this Privacy Policy, contact us at:</p>
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
