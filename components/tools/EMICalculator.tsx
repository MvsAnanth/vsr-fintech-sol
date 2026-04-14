"use client";

import { useState, useCallback } from "react";
import { calculateEMI, formatINR, formatINRLabel } from "@/utils/calculators";
import Tooltip from "@/components/ui/Tooltip";

const EMI_FORMULA = `EMI = (P × R × (1+R)^N) / ((1+R)^N - 1)

Where:
• P = Loan amount (Principal)
• R = Monthly interest rate = Annual rate ÷ 12 ÷ 100
• N = Number of EMIs (months)

Example: ₹10 Lakh @ 10% p.a. for 60 months
R = 10/12/100 = 0.00833
EMI ≈ ₹21,247`;

export default function EMICalculator() {
  const [values, setValues] = useState({
    principal: "",
    rate: "",
    tenure: "",
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

  const principal = parseFloat(values.principal) || 0;
  const rate = parseFloat(values.rate) || 0;
  const tenure = parseFloat(values.tenure) || 0;

  const result = calculateEMI(principal, rate, tenure);
  const hasResult = principal > 0 && rate > 0 && tenure > 0;

  const interestPercent =
    result.totalPayable > 0
      ? ((result.totalInterest / result.totalPayable) * 100).toFixed(1)
      : 0;
  const principalPercent =
    result.totalPayable > 0
      ? ((principal / result.totalPayable) * 100).toFixed(1)
      : 0;

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Inputs */}
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Loan Amount (₹)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
              ₹
            </span>
            <input
              type="text"
              name="principal"
              value={values.principal}
              onChange={handleChange}
              placeholder="e.g. 1000000"
              className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 bg-white"
              inputMode="decimal"
            />
          </div>
          {principal > 0 && (
            <p className="text-xs text-gray-400 mt-1">{formatINRLabel(principal)}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Annual Interest Rate (%)
          </label>
          <div className="relative">
            <input
              type="text"
              name="rate"
              value={values.rate}
              onChange={handleChange}
              placeholder="e.g. 10.5"
              className="w-full pl-4 pr-8 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 bg-white"
              inputMode="decimal"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
              %
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Loan Tenure (Months)
          </label>
          <input
            type="text"
            name="tenure"
            value={values.tenure}
            onChange={handleChange}
            placeholder="e.g. 60 (5 years)"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 bg-white"
            inputMode="decimal"
          />
          {tenure > 0 && (
            <p className="text-xs text-gray-400 mt-1">
              {Math.floor(tenure / 12)} year{Math.floor(tenure / 12) !== 1 ? "s" : ""}{" "}
              {tenure % 12 > 0 ? `${tenure % 12} months` : ""}
            </p>
          )}
        </div>

        {/* Formula Help */}
        <div className="flex items-center gap-2">
          <Tooltip content={EMI_FORMULA}>
            <button className="flex items-center gap-1.5 text-blue-600 text-sm hover:text-blue-800 transition-colors">
              <span className="text-base">ℹ️</span>
              How is EMI calculated?
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Results */}
      <div>
        {hasResult ? (
          <div className="space-y-4">
            {/* Monthly EMI — primary result */}
            <div className="bg-gradient-to-br from-[#0f2d5a] to-[#1e4d8c] rounded-2xl p-6 text-center text-white">
              <p className="text-blue-200 text-sm mb-1">Monthly EMI</p>
              <p className="text-4xl font-bold text-white">
                {formatINR(result.emi)}
              </p>
              <p className="text-blue-200 text-xs mt-2">per month</p>
            </div>

            {/* Breakdown */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center">
                <p className="text-xs text-green-600 mb-1">Principal</p>
                <p className="text-lg font-bold text-green-700">
                  {formatINRLabel(principal)}
                </p>
                <p className="text-xs text-green-500">{principalPercent}%</p>
              </div>
              <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 text-center">
                <p className="text-xs text-orange-600 mb-1">Total Interest</p>
                <p className="text-lg font-bold text-orange-700">
                  {formatINRLabel(result.totalInterest)}
                </p>
                <p className="text-xs text-orange-500">{interestPercent}%</p>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex justify-between items-center">
              <span className="text-gray-600 text-sm font-medium">
                Total Payable
              </span>
              <span className="text-gray-900 font-bold">
                {formatINRLabel(result.totalPayable)}
              </span>
            </div>

            {/* Progress bar */}
            <div>
              <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                <span>Principal ({principalPercent}%)</span>
                <span>Interest ({interestPercent}%)</span>
              </div>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden flex">
                <div
                  className="h-full bg-green-500 transition-all duration-500"
                  style={{ width: `${principalPercent}%` }}
                />
                <div
                  className="h-full bg-orange-400 transition-all duration-500"
                  style={{ width: `${interestPercent}%` }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <span className="text-4xl mb-3">🧮</span>
            <p className="text-gray-500 text-sm">
              Enter loan details to see your EMI breakdown
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
