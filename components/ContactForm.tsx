"use client";

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

import { useState } from "react";
import { Send, CheckCircle, Clock, Phone, Mail, ArrowRight } from "lucide-react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    projectType: "",
    message: ""
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [submittedName, setSubmittedName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          projectType: formData.projectType,
          message: formData.message
        })
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok || json?.success === false) {
        throw new Error(json?.error || "Failed to submit form. Please try again.");
      }

      setSubmittedName(formData.name.split(" ")[0]);
      setStatus("success");

      // Push lead event to GTM dataLayer for GA4 conversion tracking
      if (typeof window !== "undefined" && window.dataLayer) {
        window.dataLayer.push({
          event: "generate_lead",
          lead_source: "contact_form",
          lead_project_type: formData.projectType,
        });
      }
    } catch (error: any) {
      console.error("Error submitting form:", error);
      setStatus("error");
      setErrorMessage(error.message || "Failed to submit form. Please try again.");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <section id="contact" className="py-20 px-4 bg-secondary/30">
      <div className="max-w-3xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Let’s Fix Your Stack</h2>
          <p className="text-xl text-muted-foreground">
            Tell us what’s broken and what “better” looks like. We’ll recommend a practical plan.
          </p>
        </div>

        {/* Success Confirmation */}
        {status === "success" && (
          <div className="bg-card border border-border rounded-xl p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-2">
              Thanks{submittedName ? `, ${submittedName}` : ""}! We got your message.
            </h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Your project details are in our queue. Here's what happens next:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                <Clock className="w-5 h-5 text-primary mx-auto mb-2" />
                <div className="font-semibold text-sm">Within 24 Hours</div>
                <p className="text-xs text-muted-foreground mt-1">
                  We'll review your project details and prepare a response
                </p>
              </div>
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                <Phone className="w-5 h-5 text-primary mx-auto mb-2" />
                <div className="font-semibold text-sm">Quick Call or Email</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Expect a personal follow-up to discuss your needs
                </p>
              </div>
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                <Mail className="w-5 h-5 text-primary mx-auto mb-2" />
                <div className="font-semibold text-sm">Custom Proposal</div>
                <p className="text-xs text-muted-foreground mt-1">
                  You'll receive a tailored plan with timeline and pricing
                </p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-6">
              Need something urgent? Call us directly at{" "}
              <a href="tel:+19497490001" className="text-primary hover:underline font-medium">
                (949) 749-0001
              </a>
            </p>

            <button
              onClick={() => {
                setStatus("idle");
                setFormData({ name: "", email: "", phone: "", projectType: "", message: "" });
              }}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Submit another request
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className={`space-y-6 ${status === "success" ? "hidden" : ""}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-card border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                placeholder="Your name"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-card border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-2">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-card border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                placeholder="(555) 123-4567"
              />
            </div>

            {/* Project Type */}
            <div>
              <label htmlFor="projectType" className="block text-sm font-medium mb-2">
                Project Type *
              </label>
              <select
                id="projectType"
                name="projectType"
                value={formData.projectType}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-card border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              >
                <option value="">Select a service</option>
                <option value="web-development">Web Development</option>
                <option value="automation">Business Automation</option>
                <option value="ecommerce">E-commerce</option>
                <option value="maintenance">Maintenance</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-2">
              Message *
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={6}
              className="w-full px-4 py-3 rounded-lg bg-card border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
              placeholder="Tell us about your project..."
            />
          </div>

          {/* Status Messages */}
          {status === "error" && (
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
              {errorMessage}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "loading" ? (
              <>
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                Sending...
              </>
            ) : (
              <>
                Send Message
                <Send className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
}