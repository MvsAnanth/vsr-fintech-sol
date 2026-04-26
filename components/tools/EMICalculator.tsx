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
    principal: "2500000",
    rate: "9.5",
    tenure: "60",
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
    <div className="space-y-8">
      <div className="border-b border-gray-100 pb-4 mb-6">
        <h3 className="text-2xl font-bold text-brand-navy">EMI Calculator</h3>
        <p className="text-gray-500 font-medium text-sm mt-1">Estimate your monthly loan repayments instantly.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Inputs Section */}
        <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-brand-navy mb-2">
            Loan Amount (₹)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text-light">
              ₹
            </span>
            <input
              type="text"
              name="principal"
              value={values.principal}
              onChange={handleChange}
              placeholder="e.g. 2500000"
              className="w-full pl-10 pr-4 py-3 border-2 border-brand-navy/20 rounded-xl focus:outline-none focus:ring-0 focus:border-[#1b5e20] text-brand-navy font-bold bg-white transition-colors"
              inputMode="decimal"
            />
          </div>
          {principal > 0 && (
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs font-medium text-[#1b5e20]">{formatINRLabel(principal)}</p>
              <p className="text-xs text-gray-400 font-medium">₹1L - ₹10Cr</p>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-brand-navy mb-2">
            Annual Interest Rate (%)
          </label>
          <div className="relative">
            <input
              type="text"
              name="rate"
              value={values.rate}
              onChange={handleChange}
              placeholder="e.g. 9.5"
              className="w-full pl-4 pr-10 py-3 border-2 border-brand-navy/20 rounded-xl focus:outline-none focus:ring-0 focus:border-[#1b5e20] text-brand-navy font-bold bg-white transition-colors"
              inputMode="decimal"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-text-light">
              %
            </span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-gray-400 font-medium">5% - 20%</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-brand-navy mb-2">
            Loan Tenure (Months)
          </label>
          <div className="relative">
            <input
              type="text"
              name="tenure"
              value={values.tenure}
              onChange={handleChange}
              placeholder="e.g. 60"
              className="w-full px-4 py-3 border-2 border-brand-navy/20 rounded-xl focus:outline-none focus:ring-0 focus:border-[#1b5e20] text-brand-navy font-bold bg-white transition-colors"
              inputMode="decimal"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-text-light text-sm">
              Months
            </span>
          </div>
          {tenure > 0 && (
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs font-medium text-[#1b5e20]">
                {Math.floor(tenure / 12)} year{Math.floor(tenure / 12) !== 1 ? "s" : ""}{" "}
                {tenure % 12 > 0 ? `${tenure % 12} months` : ""}
              </p>
              <p className="text-xs text-gray-400 font-medium">1 - 360 Months</p>
            </div>
          )}
        </div>

        {/* Formula Help */}
        <div className="flex items-center gap-2 pt-4">
          <Tooltip content={EMI_FORMULA}>
            <button className="flex items-center gap-1.5 text-[#1b5e20] font-medium text-sm hover:underline">
              <span className="text-xs bg-[#1b5e20] text-white rounded-full w-4 h-4 flex items-center justify-center">ℹ</span>
              How is EMI calculated?
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Results Section - Navy Split */}
      <div className="h-full">
        {hasResult ? (
          <div className="bg-brand-navy rounded-2xl p-8 text-white shadow-[var(--shadow-solid-sm)] h-full flex flex-col justify-center">
            
            <div className="mb-8">
              <p className="text-gray-300 font-medium text-sm mb-1">Your Monthly EMI</p>
              <p className="text-4xl md:text-5xl font-bold text-white">
                {formatINR(result.emi)}
              </p>
            </div>

            <div className="space-y-6 mb-8">
              <div>
                <p className="text-gray-300 font-medium text-sm mb-1">Total Interest Payable</p>
                <p className="text-2xl font-bold text-white">
                  {formatINR(result.totalInterest)}
                </p>
              </div>

              <div>
                <p className="text-gray-300 font-medium text-sm mb-1">Total Amount Payable</p>
                <p className="text-2xl font-bold text-white">
                  {formatINR(result.totalPayable)}
                </p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-auto">
              <div className="w-full h-3 bg-white/20 rounded-full flex overflow-hidden mb-3">
                <div
                  className="h-full bg-[#4ade80] transition-all duration-500"
                  style={{ width: `${principalPercent}%` }}
                />
                <div
                  className="h-full bg-[#f87171] transition-all duration-500"
                  style={{ width: `${interestPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-xs font-medium">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#4ade80]" />
                  <span className="text-gray-300">Principal: {principalPercent}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#f87171]" />
                  <span className="text-gray-300">Interest: {interestPercent}%</span>
                </div>
              </div>
            </div>
            
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
            <span className="text-5xl mb-4 grayscale opacity-50">🧮</span>
            <p className="text-brand-navy font-medium">
              Enter loan details to see your EMI breakdown
            </p>
          </div>
        )}
      </div>
    </div>
    </div>
  );
}
