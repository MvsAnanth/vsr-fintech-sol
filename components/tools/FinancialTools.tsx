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
    <section id="tools" className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-green-600 font-semibold text-sm uppercase tracking-wider">
            Free Financial Tools
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2 mb-4">
            Plan Your Finances Smartly
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Use our calculators to estimate your EMI, check loan eligibility,
            and understand your CIBIL score — all in real-time.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-col sm:flex-row bg-gray-100 rounded-2xl p-1.5 mb-8 gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabId)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? "bg-white text-[#0f2d5a] shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 sm:p-8">
          {activeTab === "emi" && <EMICalculator />}
          {activeTab === "eligibility" && <LoanEligibility />}
          {activeTab === "cibil" && <CIBILSection />}
        </div>

        {/* Bottom note */}
        <p className="text-center text-gray-400 text-xs mt-4">
          * All calculations are estimates for planning purposes. Actual loan
          amounts and EMIs may vary based on lender policies and your credit
          profile.
        </p>
      </div>
    </section>
  );
}
