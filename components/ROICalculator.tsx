"use client";

import { useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  DollarSign,
  BarChart3,
  ArrowRight,
  Mail,
  Clock,
  Users,
  Target,
  Percent,
  Sparkles,
} from "lucide-react";

interface ROIInputs {
  visitors: string;
  conversionRate: string;
  customerValue: string;
  investment: string;
  improvement: string;
  email: string;
}

interface ROIResults {
  currentMonthlyRevenue: number;
  projectedMonthlyRevenue: number;
  monthlyIncrease: number;
  annualIncrease: number;
  roiPercentage: number;
  paybackMonths: number;
}

const visitorOptions = [
  { value: "50", label: "0-100", visitors: 50 },
  { value: "300", label: "100-500", visitors: 300 },
  { value: "1250", label: "500-2,000", visitors: 1250 },
  { value: "3500", label: "2,000-5,000", visitors: 3500 },
  { value: "7500", label: "5,000+", visitors: 7500 },
  { value: "unknown-visitors", label: "I don't know", visitors: 500 },
];

const conversionOptions = [
  { value: "0.5", label: "<1%", rate: 0.005 },
  { value: "1.5", label: "1-2%", rate: 0.015 },
  { value: "3.5", label: "2-5%", rate: 0.035 },
  { value: "5", label: "5%+", rate: 0.05 },
  { value: "unknown-rate", label: "I don't know", rate: 0.0235 },
];

const customerValueOptions = [
  { value: "125", label: "$50-$200", amount: 125 },
  { value: "350", label: "$200-$500", amount: 350 },
  { value: "1250", label: "$500-$2,000", amount: 1250 },
  { value: "3000", label: "$2,000+", amount: 3000 },
];

const investmentOptions = [
  { value: "3500", label: "$2k-$5k", amount: 3500 },
  { value: "7500", label: "$5k-$10k", amount: 7500 },
  { value: "15000", label: "$10k-$20k", amount: 15000 },
  { value: "25000", label: "$20k+", amount: 25000 },
];

const improvementOptions = [
  {
    value: "conservative",
    label: "Conservative",
    sublabel: "25% improvement",
    multiplier: 0.25,
  },
  {
    value: "moderate",
    label: "Moderate",
    sublabel: "50% improvement",
    multiplier: 0.5,
  },
  {
    value: "aggressive",
    label: "Aggressive",
    sublabel: "100% improvement",
    multiplier: 1.0,
  },
];

function formatCurrency(value: number): string {
  if (value >= 1000) {
    return "$" + value.toLocaleString("en-US", { maximumFractionDigits: 0 });
  }
  return "$" + value.toFixed(0);
}

export default function ROICalculator() {
  const [inputs, setInputs] = useState<ROIInputs>({
    visitors: "",
    conversionRate: "",
    customerValue: "",
    investment: "",
    improvement: "",
    email: "",
  });

  const [results, setResults] = useState<ROIResults | null>(null);
  const [showResults, setShowResults] = useState(false);

  const calculateROI = () => {
    if (
      !inputs.visitors ||
      !inputs.conversionRate ||
      !inputs.customerValue ||
      !inputs.investment ||
      !inputs.improvement ||
      !inputs.email
    ) {
      alert("Please fill in all fields to see your ROI projection");
      return;
    }

    const visitors =
      visitorOptions.find((o) => o.value === inputs.visitors)?.visitors ?? 500;
    const rate =
      conversionOptions.find((o) => o.value === inputs.conversionRate)?.rate ??
      0.0235;
    const value =
      customerValueOptions.find((o) => o.value === inputs.customerValue)
        ?.amount ?? 350;
    const investment =
      investmentOptions.find((o) => o.value === inputs.investment)?.amount ??
      7500;
    const multiplier =
      improvementOptions.find((o) => o.value === inputs.improvement)
        ?.multiplier ?? 0.5;

    const currentMonthlyRevenue = visitors * rate * value;
    const projectedMonthlyRevenue =
      currentMonthlyRevenue * (1 + multiplier);
    const monthlyIncrease = projectedMonthlyRevenue - currentMonthlyRevenue;
    const annualIncrease = monthlyIncrease * 12;
    const roiPercentage =
      investment > 0 ? ((annualIncrease - investment) / investment) * 100 : 0;
    const paybackMonths =
      monthlyIncrease > 0 ? investment / monthlyIncrease : Infinity;

    setResults({
      currentMonthlyRevenue,
      projectedMonthlyRevenue,
      monthlyIncrease,
      annualIncrease,
      roiPercentage,
      paybackMonths,
    });
    setShowResults(true);
  };

  const maxBarRevenue = results
    ? Math.max(results.projectedMonthlyRevenue, 1)
    : 1;

  return (
    <section id="roi-calculator" className="py-20 px-4 bg-secondary/30">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
            <TrendingUp className="w-4 h-4" />
            <span>ROI Calculator</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Calculate Your Website ROI
          </h1>
          <p className="text-xl text-muted-foreground">
            See how much revenue a new website could generate for your business.
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-8">
          <div className="space-y-8">
            {/* Monthly Visitors */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-3">
                <Users className="w-4 h-4 text-primary" />
                Current Monthly Website Visitors *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {visitorOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      setInputs((prev) => ({
                        ...prev,
                        visitors: option.value,
                      }))
                    }
                    className={`p-4 rounded-lg border-2 transition-all text-center ${
                      inputs.visitors === option.value
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="font-semibold">{option.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Conversion Rate */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-3">
                <Target className="w-4 h-4 text-primary" />
                Current Conversion Rate *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {conversionOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      setInputs((prev) => ({
                        ...prev,
                        conversionRate: option.value,
                      }))
                    }
                    className={`p-4 rounded-lg border-2 transition-all text-center ${
                      inputs.conversionRate === option.value
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="font-semibold">{option.label}</div>
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                &quot;I don&apos;t know&quot; uses the industry average of 2.35%
              </p>
            </div>

            {/* Average Customer Value */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-3">
                <DollarSign className="w-4 h-4 text-primary" />
                Average Customer Value *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {customerValueOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      setInputs((prev) => ({
                        ...prev,
                        customerValue: option.value,
                      }))
                    }
                    className={`p-4 rounded-lg border-2 transition-all text-center ${
                      inputs.customerValue === option.value
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="font-semibold">{option.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Website Investment */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-3">
                <BarChart3 className="w-4 h-4 text-primary" />
                Website Investment *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {investmentOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      setInputs((prev) => ({
                        ...prev,
                        investment: option.value,
                      }))
                    }
                    className={`p-4 rounded-lg border-2 transition-all text-center ${
                      inputs.investment === option.value
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="font-semibold">{option.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Expected Improvement */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-3">
                <Sparkles className="w-4 h-4 text-primary" />
                Expected Improvement with New Site *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {improvementOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      setInputs((prev) => ({
                        ...prev,
                        improvement: option.value,
                      }))
                    }
                    className={`p-4 rounded-lg border-2 transition-all text-center ${
                      inputs.improvement === option.value
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="font-semibold">{option.label}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {option.sublabel}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="roi-email"
                className="flex items-center gap-2 text-sm font-medium mb-3"
              >
                <Mail className="w-4 h-4 text-primary" />
                Email (to receive your ROI report) *
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  id="roi-email"
                  value={inputs.email}
                  onChange={(e) =>
                    setInputs((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="w-full pl-12 pr-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Calculate Button */}
            <button
              onClick={calculateROI}
              className="w-full px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
            >
              Calculate My ROI
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Results Display */}
          {showResults && results && (
            <div className="mt-10 space-y-8 animate-fadeIn">
              {/* Divider */}
              <div className="border-t border-border" />

              {/* ROI Headline */}
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">
                  Your Projected ROI
                </h3>
                <p className="text-muted-foreground text-sm">
                  Based on your inputs and industry benchmarks
                </p>
              </div>

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* ROI Percentage */}
                <div className="p-6 rounded-xl bg-primary/10 border-2 border-primary/20 text-center">
                  <Percent className="w-6 h-6 text-primary mx-auto mb-2" />
                  <div className="text-sm text-muted-foreground mb-1">
                    First-Year ROI
                  </div>
                  <div className="text-4xl font-bold text-primary">
                    {results.roiPercentage > 0
                      ? `${Math.round(results.roiPercentage)}%`
                      : "N/A"}
                  </div>
                </div>

                {/* Monthly Revenue Increase */}
                <div className="p-6 rounded-xl bg-primary/10 border-2 border-primary/20 text-center">
                  <TrendingUp className="w-6 h-6 text-primary mx-auto mb-2" />
                  <div className="text-sm text-muted-foreground mb-1">
                    Monthly Revenue Increase
                  </div>
                  <div className="text-4xl font-bold text-primary">
                    {formatCurrency(results.monthlyIncrease)}
                  </div>
                </div>

                {/* Payback Period */}
                <div className="p-6 rounded-xl bg-primary/10 border-2 border-primary/20 text-center sm:col-span-2 lg:col-span-1">
                  <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
                  <div className="text-sm text-muted-foreground mb-1">
                    Payback Period
                  </div>
                  <div className="text-4xl font-bold text-primary">
                    {results.paybackMonths === Infinity
                      ? "N/A"
                      : results.paybackMonths < 1
                        ? "<1 mo"
                        : `${Math.ceil(results.paybackMonths)} mo`}
                  </div>
                </div>
              </div>

              {/* Revenue Breakdown */}
              <div className="p-6 rounded-xl bg-card border border-border">
                <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Revenue Breakdown
                </h4>

                <div className="space-y-6">
                  {/* Current Revenue */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">
                        Current Monthly Revenue
                      </span>
                      <span className="font-semibold">
                        {formatCurrency(results.currentMonthlyRevenue)}
                      </span>
                    </div>
                    <div className="h-4 rounded-full bg-border overflow-hidden">
                      <div
                        className="h-full rounded-full bg-muted-foreground/40 transition-all duration-700"
                        style={{
                          width: `${(results.currentMonthlyRevenue / maxBarRevenue) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Projected Revenue */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">
                        Projected Monthly Revenue
                      </span>
                      <span className="font-semibold text-primary">
                        {formatCurrency(results.projectedMonthlyRevenue)}
                      </span>
                    </div>
                    <div className="h-4 rounded-full bg-border overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-700"
                        style={{
                          width: `${(results.projectedMonthlyRevenue / maxBarRevenue) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Annual Increase */}
                  <div className="pt-4 border-t border-border flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Annual Revenue Increase
                    </span>
                    <span className="text-2xl font-bold text-primary">
                      {formatCurrency(results.annualIncrease)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Disclaimer */}
              <p className="text-xs text-muted-foreground text-center">
                These projections are estimates based on industry averages.
                Actual results may vary depending on your industry, market
                conditions, and implementation quality.
              </p>

              {/* CTA */}
              <div className="p-6 rounded-xl bg-primary/10 border-2 border-primary/20 text-center">
                <h4 className="text-xl font-bold mb-2">
                  Ready to start earning more?
                </h4>
                <p className="text-muted-foreground mb-4 text-sm">
                  Let&apos;s discuss how we can help you hit these numbers.
                </p>
                <Link
                  href="/#contact"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all"
                >
                  Schedule Free Consultation
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Trust Signals */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            No obligation -- Free consultation -- Response within 24 hours
          </p>
        </div>
      </div>
    </section>
  );
}
