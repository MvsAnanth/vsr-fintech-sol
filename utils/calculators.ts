/**
 * Financial Calculator Utilities
 * VSR Fintech Solutions - v1.0.0
 */

export interface EMIResult {
  emi: number;
  totalPayable: number;
  totalInterest: number;
}

export interface EligibilityResult {
  eligibleEMI: number;
  estimatedLoanAmount: number;
}

/**
 * EMI Calculator
 * Formula: EMI = (P × R × (1+R)^N) / ((1+R)^N - 1)
 * Where:
 *   P = Principal loan amount
 *   R = Monthly interest rate (Annual rate / 12 / 100)
 *   N = Number of months (tenure)
 */
export function calculateEMI(
  principal: number,
  annualRate: number,
  tenureMonths: number
): EMIResult {
  if (!principal || !annualRate || !tenureMonths) {
    return { emi: 0, totalPayable: 0, totalInterest: 0 };
  }

  const R = annualRate / 12 / 100;
  const N = tenureMonths;
  const P = principal;

  if (R === 0) {
    const emi = P / N;
    return { emi, totalPayable: P, totalInterest: 0 };
  }

  const power = Math.pow(1 + R, N);
  const emi = (P * R * power) / (power - 1);
  const totalPayable = emi * N;
  const totalInterest = totalPayable - P;

  return { emi, totalPayable, totalInterest };
}

/**
 * Loan Eligibility Calculator
 * Formula:
 *   Eligible EMI = (Monthly Income × 0.5) − Existing EMIs
 *   Estimated Loan Amount ≈ Eligible EMI × 60
 */
export function calculateEligibility(
  monthlyIncome: number,
  existingEMIs: number,
  interestRate: number
): EligibilityResult {
  if (!monthlyIncome) {
    return { eligibleEMI: 0, estimatedLoanAmount: 0 };
  }

  const eligibleEMI = monthlyIncome * 0.5 - (existingEMIs || 0);

  if (eligibleEMI <= 0) {
    return { eligibleEMI: 0, estimatedLoanAmount: 0 };
  }

  // Use tenure of 60 months and interest rate for reverse EMI calculation
  const R = (interestRate || 10) / 12 / 100;
  const N = 60;
  const power = Math.pow(1 + R, N);

  // Reverse EMI formula: P = EMI × ((1+R)^N - 1) / (R × (1+R)^N)
  const estimatedLoanAmount = eligibleEMI * ((power - 1) / (R * power));

  return { eligibleEMI, estimatedLoanAmount };
}

/**
 * Format number as Indian currency (INR)
 */
export function formatINR(amount: number): string {
  if (!amount || isNaN(amount)) return "₹0";

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

/**
 * Format number with Indian number system (lakhs, crores)
 */
export function formatINRLabel(amount: number): string {
  if (!amount || isNaN(amount)) return "₹0";

  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  }
  return formatINR(amount);
}
