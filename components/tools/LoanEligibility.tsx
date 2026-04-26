"use client";

import { useState, useCallback } from "react";
import { calculateEligibility, formatINR, formatINRLabel } from "@/utils/calculators";
import Tooltip from "@/components/ui/Tooltip";

const ELIGIBILITY_FORMULA = `Eligible EMI = (Monthly Income × 0.5) − Existing EMIs
Estimated Loan ≈ Eligible EMI × tenure factor

Logic:
• Banks allow max 50% of income towards EMIs
• Existing EMIs are deducted from eligible EMI budget
• Remaining EMI capacity determines loan amount

Example:
Income: ₹50,000/month
Existing EMIs: ₹5,000
Eligible EMI = ₹25,000 − ₹5,000 = ₹20,000
Estimated Loan ≈ ₹10–12 Lakhs (at 10% for 60 months)`;

export default function LoanEligibility() {
  const [values, setValues] = useState({
    income: "80000",
    existingEMI: "12000",
    rate: "9.5",
  });

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      if (value === "" || /^\d*\.?\d*$/.test(value)) {
        setValues((prev) => ({ ...prev, [name]: value }));
      }
    },
    []
  );

  const income = parseFloat(values.income) || 0;
  const existingEMI = parseFloat(values.existingEMI) || 0;
  const rate = parseFloat(values.rate) || 10;

  const result = calculateEligibility(income, existingEMI, rate);
  const hasResult = income > 0;

  const maxEMIBudget = income * 0.5;
  const utilizationPercent =
    maxEMIBudget > 0
      ? Math.min(((existingEMI / maxEMIBudget) * 100), 100).toFixed(0)
      : 0;

  return (
    <div className="space-y-8">
      <div className="border-b border-gray-100 pb-4 mb-6">
        <h3 className="text-2xl font-bold text-brand-navy">Loan Eligibility Calculator</h3>
        <p className="text-gray-500 font-medium text-sm mt-1">Check how much loan you can comfortably afford.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Inputs Section */}
        <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-brand-navy mb-2">
            Monthly Net Income (₹)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text-light">
              ₹
            </span>
            <input
              type="text"
              name="income"
              value={values.income}
              onChange={handleChange}
              placeholder="e.g. 50000"
              className="w-full pl-10 pr-4 py-3 border-2 border-brand-navy/20 rounded-xl focus:outline-none focus:ring-0 focus:border-[#1b5e20] text-brand-navy font-bold bg-white transition-colors"
              inputMode="decimal"
            />
          </div>
          {income > 0 && (
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs font-medium text-brand-blue">
                Max EMI budget (50%): {formatINR(maxEMIBudget)}
              </p>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-brand-navy mb-2">
            Existing EMIs per Month (₹)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text-light">
              ₹
            </span>
            <input
              type="text"
              name="existingEMI"
              value={values.existingEMI}
              onChange={handleChange}
              placeholder="0 if none"
              className="w-full pl-10 pr-4 py-3 border-2 border-brand-navy/20 rounded-xl focus:outline-none focus:ring-0 focus:border-[#1b5e20] text-brand-navy font-bold bg-white transition-colors"
              inputMode="decimal"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-brand-navy mb-2">
            Expected Interest Rate (%)
          </label>
          <div className="relative">
            <input
              type="text"
              name="rate"
              value={values.rate}
              onChange={handleChange}
              placeholder="e.g. 10.5"
              className="w-full pl-4 pr-10 py-3 border-2 border-brand-navy/20 rounded-xl focus:outline-none focus:ring-0 focus:border-[#1b5e20] text-brand-navy font-bold bg-white transition-colors"
              inputMode="decimal"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-text-light">
              %
            </span>
          </div>
        </div>

        {/* EMI Burden Indicator */}
        {income > 0 && (
          <div className="pt-2">
            <div className="flex justify-between text-xs font-medium text-brand-navy mb-2">
              <span>Current EMI Burden</span>
              <span
                className={
                  Number(utilizationPercent) > 50
                    ? "text-[#f87171] font-bold"
                    : "text-[#1b5e20] font-bold"
                }
              >
                {utilizationPercent}% of budget
              </span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full flex overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  Number(utilizationPercent) > 50 ? "bg-[#f87171]" : "bg-[#4ade80]"
                }`}
                style={{ width: `${Math.min(Number(utilizationPercent), 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {Number(utilizationPercent) > 50
                ? "High EMI burden — may affect eligibility"
                : "Healthy EMI-to-income ratio"}
            </p>
          </div>
        )}

        {/* Formula Help */}
        <div className="flex items-center gap-2 pt-4">
          <Tooltip content={ELIGIBILITY_FORMULA}>
            <button className="flex items-center gap-1.5 text-[#1b5e20] font-medium text-sm hover:underline">
              <span className="text-xs bg-[#1b5e20] text-white rounded-full w-4 h-4 flex items-center justify-center">ℹ</span>
              How is eligibility calculated?
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Results Section - Navy Split */}
      <div className="h-full">
        {hasResult && result.eligibleEMI > 0 ? (
          <div className="bg-brand-navy rounded-2xl p-8 text-white shadow-[var(--shadow-solid-sm)] h-full flex flex-col">
            
            <div className="mb-8 text-center sm:text-left">
              <p className="text-[#4ade80] font-medium text-sm mb-1 uppercase tracking-wider">
                Estimated Loan Eligibility
              </p>
              <p className="text-4xl md:text-5xl font-bold text-white mb-2">
                {formatINRLabel(result.estimatedLoanAmount)}
              </p>
              <p className="text-gray-400 text-xs">
                Approximate amount (varies by bank & profile)
              </p>
            </div>

            <div className="bg-white/10 rounded-xl p-5 mb-8">
              <div className="flex justify-between items-center mb-1">
                <p className="text-sm font-medium text-white">
                  Monthly EMI Capacity
                </p>
                <p className="text-xl font-bold text-[#4ade80]">
                  {formatINR(result.eligibleEMI)}
                </p>
              </div>
              <p className="text-xs text-gray-400">
                After deducting existing EMIs
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Calculation Breakdown</p>
              <div className="flex justify-between text-sm text-gray-300">
                <span>50% of Income (Budget)</span>
                <span className="font-medium text-white">{formatINR(maxEMIBudget)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-300">
                <span>Minus Existing EMIs</span>
                <span className="font-medium text-[#f87171]">
                  −{formatINR(existingEMI)}
                </span>
              </div>
            </div>

            <div className="mt-auto bg-[#fff3cd] text-[#856404] rounded-xl p-4 flex gap-3 items-start">
              <span className="text-lg leading-none">💡</span>
              <p className="text-xs font-medium leading-relaxed">
                This is an estimate. Actual eligibility depends on CIBIL score,
                employment type, and bank policies. Contact us for an accurate
                assessment.
              </p>
            </div>
            
          </div>
        ) : hasResult && result.eligibleEMI <= 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-red-50 rounded-2xl border-2 border-dashed border-red-200 text-[#b71c1c]">
            <span className="text-5xl mb-4 opacity-80">⚠</span>
            <p className="font-bold text-lg mb-2">
              EMI Burden Too High
            </p>
            <p className="text-sm">
              Your existing EMIs exceed 50% of income. Contact us to explore
              debt consolidation options.
            </p>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
            <span className="text-5xl mb-4 grayscale opacity-50">📊</span>
            <p className="text-brand-navy font-medium">
              Enter your income details to check eligibility
            </p>
          </div>
        )}
      </div>
    </div>
    </div>
  );
}
