"use client";

import { useState } from "react";
import config from "@/config.json";

const KYC_DOCUMENTS = [
  "PAN Card",
  "Aadhaar Card",
  "Passport size photographs (latest)",
  "Current address proof (if different from Aadhaar)"
];

const CHECKLISTS: Record<string, { category: string, items: string[] }[]> = {
  "Home Loan": [
    {
      category: "For Salaried Employees",
      items: [
        "Latest 3 months’ payslips",
        "Latest 6 months’ salary credit bank statement (till date)",
        "Latest 2 years’ Form 16 (Part A & B)",
        "Employment ID Card",
        "Offer Letter / Appointment Letter"
      ]
    },
    {
      category: "For Self-Employed Applicants",
      items: [
        "Latest 2–3 years Income Tax Returns (ITR) with computation",
        "Profit & Loss Statement & Balance Sheet (CA certified) – last 2–3 years",
        "Latest 6–12 months current account bank statements",
        "Business Registration Certificate / Shop Act / GST Registration",
        "GST Returns (last 6–12 months, if applicable)",
        "Trade License (if applicable)"
      ]
    },
    {
      category: "Property Documents",
      items: [
        "Agreement of Sale",
        "Link Documents (Chain for last 25 years)",
        "Approved Building Plan & Permission Copy",
        "Latest Property Tax Receipt",
        "Latest Encumbrance Certificate (EC)"
      ]
    },
    {
      category: "Additional Documents (If Applicable)",
      items: [
        "Co-applicant documents (KYC + Income)",
        "Processing fee cheque / payment proof",
        "Existing loan statements (if any ongoing loans)"
      ]
    }
  ],
  "Personal Loan": [
    {
      category: "Salaried",
      items: [
        "Latest 3 months’ payslips",
        "Latest 6 months’ salary bank statement",
        "Form 16 (last 1–2 years)"
      ]
    },
    {
      category: "Self-Employed",
      items: [
        "ITR (last 2–3 years)",
        "P&L Statement & Balance Sheet (CA certified)",
        "Last 6–12 months bank statement"
      ]
    }
  ],
  "Business Loan": [
    {
      category: "Salaried (if applying as co-applicant/partner)",
      items: [
        "Salary slips (3 months)",
        "Bank statement (6 months)",
        "Form 16"
      ]
    },
    {
      category: "Self-Employed / Business Owners",
      items: [
        "ITR (last 2–3 years with computation)",
        "P&L & Balance Sheet (last 2–3 years, CA certified)",
        "Current account bank statements (6–12 months)",
        "GST Registration & Returns (6–12 months)",
        "Business Proof (Registration / Shop Act / Trade License)"
      ]
    }
  ],
  "Education Loan": [
    {
      category: "Student Documents",
      items: [
        "Admission Letter from college/university",
        "Fee Structure",
        "Academic records (10th, 12th, Degree mark sheets)",
        "Passport (for abroad studies)"
      ]
    },
    {
      category: "Co-applicant (Parent/Guardian) – Salaried",
      items: [
        "Salary slips (3 months)",
        "Bank statement (6 months)",
        "Form 16"
      ]
    },
    {
      category: "Co-applicant – Self-Employed",
      items: [
        "ITR (2–3 years)",
        "P&L & Balance Sheet",
        "Bank statements"
      ]
    }
  ],
  "Loan Against Property": [
    {
      category: "Salaried",
      items: [
        "Payslips (3 months)",
        "Bank statement (6 months)",
        "Form 16"
      ]
    },
    {
      category: "Self-Employed",
      items: [
        "ITR (2–3 years)",
        "P&L & Balance Sheet",
        "Bank statement (6–12 months)"
      ]
    },
    {
      category: "Property Documents",
      items: [
        "Sale Deed / Agreement",
        "Link Documents (last 25 years)",
        "Approved Building Plan",
        "Property Tax Receipt",
        "Encumbrance Certificate (EC)"
      ]
    }
  ],
  "Project Funding": [
    {
      category: "Business / Project Details",
      items: [
        "Detailed Project Report (DPR)",
        "Project Cost & Revenue Estimates",
        "Business Plan"
      ]
    },
    {
      category: "Financial Documents",
      items: [
        "ITR (last 3 years)",
        "Balance Sheet & P&L (last 3 years)",
        "Bank statements (last 12 months)",
        "GST Returns"
      ]
    },
    {
      category: "Company Documents",
      items: [
        "Certificate of Incorporation",
        "MOA & AOA",
        "Board Resolution"
      ]
    },
    {
      category: "Property / Project Documents",
      items: [
        "Land Ownership Documents",
        "Approvals & Licenses",
        "Building Plan Approval",
        "Estimate from contractor"
      ]
    }
  ]
};

const COMMON_ADDITIONAL = [
  "Co-applicant documents (if applicable)",
  "Existing loan statements (if any)",
  "CIBIL / credit details (as required by bank)",
  "Processing fee payment proof"
];

const services = [
  {
    icon: "🏠",
    title: "Home Loan",
    description: "Own your dream home with affordable EMIs and quick approval",
    benefits: ["Up to 90% funding", "Tenure up to 30 years", "Doorstep service"],
    bgColor: "bg-white",
  },
  {
    icon: "👤",
    title: "Personal Loan",
    description: "Instant personal loans for any emergency or planned expense",
    benefits: ["No collateral needed", "Quick disbursal 48hrs", "Flexible repayment"],
    bgColor: "bg-white",
  },
  {
    icon: "🏢",
    title: "Business Loan",
    description: "Scale your business with dedicated financing solutions",
    benefits: ["Minimal documentation", "Competitive rates", "Working capital support"],
    bgColor: "bg-white",
  },
  {
    icon: "🎓",
    title: "Education Loan",
    description: "Invest in your future with education financing",
    benefits: ["Covers tuition + living", "Moratorium period", "India & abroad"],
    bgColor: "bg-white",
  },
  {
    icon: "🏗️",
    title: "Loan Against Property",
    description: "Unlock equity from your property for any financial need",
    benefits: ["Up to 75% of property value", "Lower interest rates", "Long tenure option"],
    bgColor: "bg-white",
  },
  {
    icon: "💼",
    title: "Project Funding",
    description: "End-to-end funding support for large-scale projects",
    benefits: ["Infrastructure projects", "SME & MSME funding", "Government scheme tie-ups"],
    bgColor: "bg-white",
  },
  {
    icon: "🌍",
    title: "NRI Services",
    description: "Specialized loan and investment services for NRIs",
    benefits: ["Home loans in India", "NRE/NRO account advisory", "Repatriation support"],
    bgColor: "bg-white",
  },
  {
    icon: "🛡️",
    title: "Insurance",
    description: "Protect your assets and secure your family's future",
    benefits: ["Life & health cover", "Loan protection plans", "Best premium rates"],
    bgColor: "bg-white",
  },
];

function getWhatsAppLink(service: string) {
  const message = encodeURIComponent(
    `Hi, I want to apply for a ${service}. Please guide me.`
  );
  return `https://wa.me/${config.whatsapp.number}?text=${message}`;
}

export default function Services() {
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const handleDownloadPDF = () => {
    if (!selectedService) return;

    // Create a printable HTML string
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    let htmlContent = `
      <html>
        <head>
          <title>${selectedService} Document Checklist</title>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; padding: 40px; line-height: 1.6; }
            h1 { color: #071a3a; text-align: center; margin-bottom: 5px; }
            h2 { color: #666; text-align: center; margin-top: 0; margin-bottom: 30px; font-weight: normal; font-size: 18px; }
            h3 { color: #1b5e20; border-bottom: 2px solid #1b5e20; padding-bottom: 5px; margin-top: 25px; }
            ul { padding-left: 20px; }
            li { margin-bottom: 8px; }
            .footer { text-align: center; margin-top: 50px; font-size: 12px; color: #888; border-top: 1px solid #ddd; padding-top: 20px; }
          </style>
        </head>
        <body>
          <h1>VSR Fintech Solutions</h1>
          <h2>${selectedService} Document Checklist</h2>
          
          <h3>KYC Documents (For All Applicants)</h3>
          <ul>
            ${KYC_DOCUMENTS.map(doc => `<li>${doc}</li>`).join('')}
          </ul>
    `;

    if (CHECKLISTS[selectedService]) {
      CHECKLISTS[selectedService].forEach(section => {
        htmlContent += `
          <h3>${section.category}</h3>
          <ul>
            ${section.items.map(item => `<li>${item}</li>`).join('')}
          </ul>
        `;
      });
      
      htmlContent += `
        <h3>Additional Documents (If Applicable)</h3>
        <ul>
          ${COMMON_ADDITIONAL.map(item => `<li>${item}</li>`).join('')}
        </ul>
      `;
    } else {
      htmlContent += `
        <p>For specific requirements, please reach out to our experts directly.</p>
      `;
    }

    htmlContent += `
          <div class="footer">
            Printed from VSR Fintech Solutions • Please contact us via WhatsApp for any queries.
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    
    // Slight delay to allow CSS to apply before printing
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  return (
    <section id="services" className="py-20 bg-[#f8f9fa] border-b-2 border-brand-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-14">
          <span className="bg-white border-2 border-brand-navy px-4 py-1.5 font-bold text-xs uppercase tracking-wider text-brand-navy shadow-[var(--shadow-solid-sm)] rounded-full">
            What We Offer
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-brand-navy mt-6 mb-4">
            Comprehensive Loan Solutions
          </h2>
          <p className="text-brand-text-light font-bold max-w-xl mx-auto uppercase tracking-wider text-sm">
            From home loans to project funding — we have the right financial
            product for every need, backed by expert guidance.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <div
              key={service.title}
              className={`group ${service.bgColor} border border-gray-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col`}
            >
              {/* Icon */}
              <div
                className="w-14 h-14 bg-[#f8f9fa] border border-gray-200 rounded-xl flex items-center justify-center text-2xl mb-6 shadow-sm"
              >
                {service.icon}
              </div>

              <h3 className="text-brand-navy font-bold text-xl mb-2 uppercase tracking-wider">
                {service.title}
              </h3>
              <p className="text-gray-500 font-medium text-xs mb-6 flex-1">
                {service.description}
              </p>

              {/* Benefits */}
              <ul className="space-y-3 mb-6">
                {service.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3 text-[10px] font-bold text-brand-navy uppercase tracking-wider">
                    <span className="bg-[#4ade80] text-[#1b5e20] p-0.5 rounded-full">
                      <svg
                        className="w-3 h-3 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                    {benefit}
                  </li>
                ))}
              </ul>

              {/* CTAs */}
              <div className="flex gap-3 mt-auto">
                <button
                  onClick={() => setSelectedService(service.title)}
                  className="flex-1 flex items-center justify-center bg-gray-50 border border-gray-200 text-brand-navy text-xs font-bold py-3 uppercase tracking-wider rounded-xl shadow-sm hover:bg-gray-100 transition-colors"
                >
                  View Details
                </button>
                <a
                  href={getWhatsAppLink(service.title)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold py-3 px-5 rounded-xl shadow-sm hover:bg-[#20ba56] transition-colors"
                  title="Apply via WhatsApp"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  <span className="text-xs uppercase tracking-wider">Apply</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Details/Checklist Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-brand-navy/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setSelectedService(null)}
          />
          <div className="relative bg-white border border-gray-200 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col animate-fade-in-up">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50 rounded-t-2xl">
              <div>
                <h3 className="text-xl font-bold text-brand-navy uppercase tracking-wider">
                  {selectedService} Details
                </h3>
                <p className="text-xs font-medium text-gray-500 mt-1">
                  Required documents and checklist
                </p>
              </div>
              <button 
                onClick={() => setSelectedService(null)}
                className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-lg shadow-sm text-brand-navy hover:bg-gray-100 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-8 custom-scrollbar">
              
              {/* KYC - Always show */}
              <div>
                <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-2">
                  <span className="text-2xl">👤</span>
                  <h4 className="text-sm font-bold text-brand-navy uppercase tracking-wider">KYC Documents (For All)</h4>
                </div>
                <ul className="space-y-3">
                  {KYC_DOCUMENTS.map((doc, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-[#4ade80] mt-0.5">✓</span>
                      <span className="text-sm font-medium text-gray-600">{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Specific Checklist */}
              {CHECKLISTS[selectedService] ? (
                CHECKLISTS[selectedService].map((section, sIdx) => (
                  <div key={sIdx}>
                    <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-2">
                      <span className="text-xl">📑</span>
                      <h4 className="text-sm font-bold text-brand-navy uppercase tracking-wider">{section.category}</h4>
                    </div>
                    <ul className="space-y-3">
                      {section.items.map((doc, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="text-brand-blue mt-0.5">✓</span>
                          <span className="text-sm font-medium text-gray-600">{doc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              ) : (
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    For specific requirements regarding {selectedService}, please reach out to our experts directly on WhatsApp.
                  </p>
                </div>
              )}

              {/* Common Additional */}
              {CHECKLISTS[selectedService] && (
                <div>
                  <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-2">
                    <span className="text-xl">📌</span>
                    <h4 className="text-sm font-bold text-brand-navy uppercase tracking-wider">Additional Documents (If Applicable)</h4>
                  </div>
                  <ul className="space-y-3">
                    {COMMON_ADDITIONAL.map((doc, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="text-gray-400 mt-0.5">✓</span>
                        <span className="text-sm font-medium text-gray-600">{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl flex flex-col sm:flex-row gap-4 justify-between items-center">
              <button 
                onClick={handleDownloadPDF}
                className="flex items-center gap-2 px-5 py-3 text-brand-navy font-bold text-xs uppercase tracking-wider hover:text-brand-blue transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download PDF
              </button>
              
              <div className="flex gap-3 w-full sm:w-auto">
                <button 
                  onClick={() => setSelectedService(null)}
                  className="flex-1 sm:flex-none px-6 py-3 bg-white border border-gray-200 text-brand-navy font-bold text-xs uppercase tracking-wider rounded-xl shadow-sm hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <a
                  href={getWhatsAppLink(selectedService)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none px-6 py-3 bg-[#25D366] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-sm flex items-center justify-center gap-2 hover:bg-[#20ba56] transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e0e3e5; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}} />
    </section>
  );
}
