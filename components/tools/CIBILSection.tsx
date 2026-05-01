"use client";

import config from "@/config.json";

const scoreRanges = [
  {
    range: "750 – 900",
    label: "Excellent",
    color: "bg-[#4ade80]",
    textColor: "text-[#4ade80]",
    bgColor: "bg-[#1a3b1a]",
    borderColor: "border-[#2d5a2d]",
    description: "Best loan rates & fastest approvals. You're in the top tier.",
    icon: "🏆",
    width: "w-full",
  },
  {
    range: "700 – 749",
    label: "Good",
    color: "bg-brand-blue",
    textColor: "text-brand-blue",
    bgColor: "bg-[#1a2a3b]",
    borderColor: "border-[#2d4a6a]",
    description: "Most banks will approve your loan. Good rates available.",
    icon: "✅",
    width: "w-5/6",
  },
  {
    range: "650 – 699",
    label: "Fair",
    color: "bg-[#fbc02d]",
    textColor: "text-[#fbc02d]",
    bgColor: "bg-[#2a2614]",
    borderColor: "border-[#4a4020]",
    description: "Some lenders may approve with slightly higher rates.",
    icon: "⚠",
    width: "w-3/4",
  },
  {
    range: "Below 650",
    label: "Needs Work",
    color: "bg-[#ef5350]",
    textColor: "text-[#ef5350]",
    bgColor: "bg-[#2e1a1a]",
    borderColor: "border-[#5a2d2d]",
    description: "Don't worry — we specialize in helping low CIBIL applicants!",
    icon: "💪",
    width: "w-1/2",
  },
];

const tips = [
  { tip: "Pay all EMIs and credit card bills on time", icon: "⏰" },
  { tip: "Keep credit utilization below 30%", icon: "💳" },
  { tip: "Don't apply for too many loans simultaneously", icon: "🚫" },
  { tip: "Maintain older credit accounts — history matters", icon: "📅" },
  { tip: "Regularly check your credit report for errors", icon: "🔍" },
];

function getWhatsAppLink(msg: string) {
  return `https://wa.me/${config.whatsapp.number}?text=${encodeURIComponent(msg)}`;
}

export default function CIBILSection() {
  return (
    <div className="space-y-8">
      <div className="border-b border-brand-border pb-4 mb-6">
        <h3 className="text-2xl font-bold text-brand-text">CIBIL Score Guide</h3>
        <p className="text-brand-text-light font-medium text-sm mt-1">Understand your credit score and how it impacts your loan approval.</p>
      </div>

      {/* What is CIBIL */}
      <div className="bg-brand-bg border-2 border-brand-border rounded-xl p-6">
        <h3 className="text-brand-text font-bold text-lg mb-3 flex items-center gap-2">
          <span className="text-2xl">📋</span> What is a CIBIL Score?
        </h3>
        <p className="text-brand-text-light font-medium text-sm leading-relaxed">
          A CIBIL score (Credit Information Bureau India Limited) is a 3-digit
          number ranging from <strong className="text-brand-text">300 to 900</strong> that represents your
          creditworthiness. Banks and financial institutions use this score to
          decide whether to approve your loan and at what interest rate. The
          higher your score, the better your loan terms.
        </p>
      </div>

      {/* Score Ranges */}
      <div>
        <h3 className="text-brand-text font-bold text-base mb-4 uppercase tracking-wider">
          Score Ranges Explained
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {scoreRanges.map((item) => (
            <div
              key={item.range}
              className={`${item.bgColor} border border-brand-border transition-colors rounded-xl p-5`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <span className={`font-bold text-sm uppercase tracking-wider ${item.textColor}`}>
                      {item.label}
                    </span>
                    <span className="text-brand-text-light font-medium text-xs ml-2">
                      {item.range}
                    </span>
                  </div>
                </div>
              </div>
              <div className="w-full h-2 bg-brand-surface rounded-full overflow-hidden mb-3 shadow-inner">
                <div
                  className={`h-full ${item.color} ${item.width} transition-all duration-700 rounded-full`}
                />
              </div>
              <p className="text-xs font-medium text-brand-text-light leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Low CIBIL Help */}
      <div className="bg-brand-navy rounded-xl p-6 text-white shadow-[var(--shadow-solid-sm)] flex flex-col sm:flex-row items-center gap-6 border border-brand-border">
        <div className="flex-1">
          <h3 className="font-bold text-xl mb-2 text-brand-blue">
            Low CIBIL Score? We Can Still Help!
          </h3>
          <p className="font-medium text-gray-300 text-sm mb-0">
            Don&apos;t let a low credit score stop your dreams. We work with
            specialized lenders who consider your complete financial profile —
            not just a number. Contact us to explore your options.
          </p>
        </div>
        <a
          href={getWhatsAppLink(
            "Hi, I have a low CIBIL score and need loan assistance. Can you help?"
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-brand-blue border-2 border-brand-border text-white font-bold px-6 py-3 rounded-xl hover:bg-brand-blue-hover transition-colors uppercase tracking-wider text-xs whitespace-nowrap"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Chat with Expert
        </a>
      </div>

      {/* Tips */}
      <div>
        <h3 className="text-brand-text font-bold text-base mb-4 uppercase tracking-wider">
          Tips to Improve Your CIBIL Score
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tips.map((item) => (
            <div
              key={item.tip}
              className="flex items-start gap-3 bg-brand-surface border border-brand-border rounded-xl p-4 hover:shadow-md transition-shadow"
            >
              <span className="text-xl flex-shrink-0">{item.icon}</span>
              <p className="text-brand-text font-medium text-xs pt-1 leading-relaxed">{item.tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
