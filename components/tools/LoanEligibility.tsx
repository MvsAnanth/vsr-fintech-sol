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
    income: "",
    existingEMI: "",
    rate: "",
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
    <div className="grid md:grid-cols-2 gap-8">
      {/* Inputs */}
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Monthly Income (₹)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
              ₹
            </span>
            <input
              type="text"
              name="income"
              value={values.income}
              onChange={handleChange}
              placeholder="e.g. 50000"
              className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 bg-white"
              inputMode="decimal"
            />
          </div>
          {income > 0 && (
            <p className="text-xs text-gray-400 mt-1">
              Max EMI budget (50%): {formatINR(maxEMIBudget)}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Existing EMIs per Month (₹)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
              ₹
            </span>
            <input
              type="text"
              name="existingEMI"
              value={values.existingEMI}
              onChange={handleChange}
              placeholder="0 if none"
              className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 bg-white"
              inputMode="decimal"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Expected Interest Rate (%)
          </label>
          <div className="relative">
            <input
              type="text"
              name="rate"
              value={values.rate}
              onChange={handleChange}
              placeholder="e.g. 10"
              className="w-full pl-4 pr-8 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 bg-white"
              inputMode="decimal"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
              %
            </span>
          </div>
        </div>

        {/* EMI Burden Indicator */}
        {income > 0 && (
          <div>
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Current EMI Burden</span>
              <span
                className={
                  Number(utilizationPercent) > 50
                    ? "text-red-500 font-semibold"
                    : "text-green-600 font-semibold"
                }
              >
                {utilizationPercent}%
              </span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  Number(utilizationPercent) > 50 ? "bg-red-500" : "bg-green-500"
                }`}
                style={{ width: `${Math.min(Number(utilizationPercent), 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {Number(utilizationPercent) > 50
                ? "High EMI burden — may affect eligibility"
                : "Healthy EMI-to-income ratio"}
            </p>
          </div>
        )}

        {/* Formula Help */}
        <div className="flex items-center gap-2">
          <Tooltip content={ELIGIBILITY_FORMULA}>
            <button className="flex items-center gap-1.5 text-blue-600 text-sm hover:text-blue-800 transition-colors">
              <span className="text-base">ℹ️</span>
              How is eligibility calculated?
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Results */}
      <div>
        {hasResult && result.eligibleEMI > 0 ? (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-6 text-center text-white">
              <p className="text-green-100 text-sm mb-1">
                Estimated Loan Eligibility
              </p>
              <p className="text-4xl font-bold text-white">
                {formatINRLabel(result.estimatedLoanAmount)}
              </p>
              <p className="text-green-200 text-xs mt-2">
                approximate (varies by bank & profile)
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex justify-between items-center">
              <div>
                <p className="text-xs text-blue-600 font-medium">
                  Monthly EMI Capacity
                </p>
                <p className="text-xs text-gray-500">
                  After existing EMIs
                </p>
              </div>
              <p className="text-lg font-bold text-blue-700">
                {formatINR(result.eligibleEMI)}
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-3">Calculation Breakdown</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">50% of Income</span>
                  <span className="font-medium">{formatINR(maxEMIBudget)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Minus Existing EMIs</span>
                  <span className="font-medium text-red-500">
                    −{formatINR(existingEMI)}
                  </span>
                </div>
                <div className="border-t pt-2 flex justify-between text-sm font-bold">
                  <span>Eligible EMI</span>
                  <span className="text-green-600">
                    {formatINR(result.eligibleEMI)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex gap-2">
              <span className="text-amber-500 text-base flex-shrink-0">💡</span>
              <p className="text-xs text-amber-700">
                This is an estimate. Actual eligibility depends on CIBIL score,
                employment type, and bank policies. Contact us for an accurate
                assessment.
              </p>
            </div>
          </div>
        ) : hasResult && result.eligibleEMI <= 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center py-12 bg-red-50 rounded-2xl border border-red-100">
            <span className="text-4xl mb-3">⚠️</span>
            <p className="text-red-600 font-semibold text-sm mb-2">
              EMI Burden Too High
            </p>
            <p className="text-red-400 text-xs px-4">
              Your existing EMIs exceed 50% of income. Contact us to explore
              debt consolidation options.
            </p>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <span className="text-4xl mb-3">📊</span>
            <p className="text-gray-500 text-sm">
              Enter your income details to check eligibility
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
