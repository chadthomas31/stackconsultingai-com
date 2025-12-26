"use client";

import { useState } from "react";
import { Calculator, Mail, CheckCircle, ArrowRight } from "lucide-react";

interface CalculatorInputs {
  businessType: string;
  pages: string;
  features: string[];
  timeline: string;
  email: string;
}

export default function PricingCalculator() {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    businessType: "",
    pages: "",
    features: [],
    timeline: "",
    email: ""
  });
  
  const [showEstimate, setShowEstimate] = useState(false);
  const [estimate, setEstimate] = useState({ min: 0, max: 0 });

  const businessTypes = [
    { value: "local-service", label: "Local Service Business", multiplier: 1.0 },
    { value: "ecommerce", label: "E-commerce Store", multiplier: 1.5 },
    { value: "saas", label: "SaaS Platform", multiplier: 2.0 },
    { value: "professional", label: "Professional Services", multiplier: 1.2 },
    { value: "other", label: "Other", multiplier: 1.0 }
  ];

  const pageOptions = [
    { value: "1-3", label: "1-3 Pages", cost: 1500 },
    { value: "4-7", label: "4-7 Pages", cost: 3000 },
    { value: "8-15", label: "8-15 Pages", cost: 5000 },
    { value: "16+", label: "16+ Pages", cost: 8000 }
  ];

  const featureOptions = [
    { value: "contact-form", label: "Contact Form", cost: 0 },
    { value: "booking", label: "Booking System", cost: 1500 },
    { value: "ecommerce", label: "E-commerce", cost: 3000 },
    { value: "auth", label: "User Authentication", cost: 2000 },
    { value: "cms", label: "Content Management", cost: 1000 },
    { value: "api", label: "Custom API Integration", cost: 2500 },
    { value: "analytics", label: "Analytics Dashboard", cost: 1500 }
  ];

  const timelineOptions = [
    { value: "rush", label: "Rush (1-2 weeks)", multiplier: 1.5 },
    { value: "standard", label: "Standard (3-4 weeks)", multiplier: 1.0 },
    { value: "flexible", label: "Flexible (4+ weeks)", multiplier: 0.9 }
  ];

  const handleFeatureToggle = (feature: string) => {
    setInputs(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const calculateEstimate = () => {
    if (!inputs.businessType || !inputs.pages || !inputs.timeline || !inputs.email) {
      alert("Please fill in all required fields");
      return;
    }

    const businessMult = businessTypes.find(b => b.value === inputs.businessType)?.multiplier || 1;
    const baseCost = pageOptions.find(p => p.value === inputs.pages)?.cost || 0;
    const timelineMult = timelineOptions.find(t => t.value === inputs.timeline)?.multiplier || 1;
    
    const featureCost = inputs.features.reduce((total, feature) => {
      const cost = featureOptions.find(f => f.value === feature)?.cost || 0;
      return total + cost;
    }, 0);

    const totalCost = (baseCost + featureCost) * businessMult * timelineMult;
    
    setEstimate({
      min: Math.round(totalCost * 0.85),
      max: Math.round(totalCost * 1.15)
    });
    setShowEstimate(true);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <section id="calculator" className="py-20 px-4 bg-secondary/30">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
            <Calculator className="w-4 h-4" />
            <span>Project Estimator</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">How Much Will Your Project Cost?</h2>
          <p className="text-xl text-muted-foreground">
            Get an instant estimate based on your specific needs
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-8">
          <div className="space-y-6">
            {/* Business Type */}
            <div>
              <label className="block text-sm font-medium mb-3">Business Type *</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {businessTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setInputs(prev => ({ ...prev, businessType: type.value }))}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      inputs.businessType === type.value
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Number of Pages */}
            <div>
              <label className="block text-sm font-medium mb-3">Number of Pages *</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {pageOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setInputs(prev => ({ ...prev, pages: option.value }))}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      inputs.pages === option.value
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="font-semibold">{option.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Features */}
            <div>
              <label className="block text-sm font-medium mb-3">Features (Select all that apply)</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {featureOptions.map((feature) => (
                  <button
                    key={feature.value}
                    type="button"
                    onClick={() => handleFeatureToggle(feature.value)}
                    className={`p-4 rounded-lg border-2 transition-all text-left flex items-start gap-3 ${
                      inputs.features.includes(feature.value)
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 ${
                      inputs.features.includes(feature.value)
                        ? 'border-primary bg-primary'
                        : 'border-border'
                    }`}>
                      {inputs.features.includes(feature.value) && (
                        <CheckCircle className="w-4 h-4 text-primary-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{feature.label}</div>
                      {feature.cost > 0 && (
                        <div className="text-xs text-muted-foreground">+${feature.cost}</div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div>
              <label className="block text-sm font-medium mb-3">Project Timeline *</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {timelineOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setInputs(prev => ({ ...prev, timeline: option.value }))}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      inputs.timeline === option.value
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="calc-email" className="block text-sm font-medium mb-3">
                Email (to see detailed breakdown) *
              </label>
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    id="calc-email"
                    value={inputs.email}
                    onChange={(e) => setInputs(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full pl-12 pr-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
            </div>

            {/* Calculate Button */}
            <button
              onClick={calculateEstimate}
              className="w-full px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
            >
              Calculate Estimate
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Estimate Display */}
          {showEstimate && (
            <div className="mt-8 p-6 rounded-xl bg-primary/10 border-2 border-primary/20 animate-fadeIn">
              <div className="text-center">
                <div className="text-sm font-medium text-primary mb-2">Estimated Project Cost</div>
                <div className="text-4xl font-bold mb-4">
                  {formatPrice(estimate.min)} - {formatPrice(estimate.max)}
                </div>
                <p className="text-sm text-muted-foreground mb-6">
                  This is a ballpark estimate. Final pricing depends on specific requirements and complexity.
                </p>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all"
                >
                  Get Accurate Quote
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Trust Signals */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>✓ No obligation • ✓ Free consultation • ✓ Response within 24 hours</p>
        </div>
      </div>
    </section>
  );
}