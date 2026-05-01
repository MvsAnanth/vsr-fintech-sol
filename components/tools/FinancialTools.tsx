"use client";

import { useState } from "react";
import EMICalculator from "./EMICalculator";
import LoanEligibility from "./LoanEligibility";
import CIBILSection from "./CIBILSection";

const tabs = [
  { id: "emi", label: "EMI Calculator", icon: "🧮" },
  { id: "eligibility", label: "Loan Eligibility", icon: "📊" },
  { id: "cibil", label: "CIBIL Help", icon: "📈" },
];

type TabId = "emi" | "eligibility" | "cibil";

export default function FinancialTools() {
  const [activeTab, setActiveTab] = useState<TabId>("emi");

  return (
    <section id="tools" className="py-20 bg-brand-bg border-y-2 border-brand-border">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="bg-brand-surface border-2 border-brand-border px-4 py-1.5 font-bold text-xs uppercase tracking-wider text-brand-text shadow-[var(--shadow-solid-sm)] rounded-full">
            Free Financial Tools
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-brand-text mt-6 mb-4">
            Plan Your Finances Smartly
          </h2>
          <p className="text-brand-text-light max-w-xl mx-auto font-medium">
            Use our calculators to estimate your EMI, check loan eligibility,
            and understand your CIBIL score — all in real-time.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-col sm:flex-row bg-brand-surface border-2 border-brand-border p-1.5 mb-8 rounded-2xl shadow-[var(--shadow-solid-sm)] max-w-3xl mx-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabId)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-xs font-bold transition-all uppercase tracking-wider rounded-xl ${
                activeTab === tab.id
                  ? "bg-brand-blue text-white shadow-md"
                  : "bg-transparent text-brand-text hover:bg-brand-bg"
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-brand-surface border-2 border-brand-border rounded-2xl shadow-[var(--shadow-solid-md)] p-6 sm:p-8">
          {activeTab === "emi" && <EMICalculator />}
          {activeTab === "eligibility" && <LoanEligibility />}
          {activeTab === "cibil" && <CIBILSection />}
        </div>

        {/* Bottom note */}
        <p className="text-center text-brand-text-light text-xs font-medium uppercase tracking-wider mt-8">
          * All calculations are estimates for planning purposes. Actual loan
          amounts and EMIs may vary based on lender policies and your credit
          profile.
        </p>
      </div>
    </section>
  );
}
