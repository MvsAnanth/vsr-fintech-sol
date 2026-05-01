"use client";

import config from "@/config.json";

const achievements = [
  {
    icon: "🎓",
    title: "MBA + B.Ed Leadership",
    description:
      "Led by Sukanya Vadagandla, combining deep academic expertise in management and education to deliver exceptional financial advisory services.",
    color: "bg-brand-surface",
    textColor: "text-brand-text",
  },
  {
    icon: "🤝",
    title: "Strong Client Relationships",
    description:
      "Built lasting bonds with 500+ clients through personal attention, follow-ups, and genuine care for their financial goals.",
    color: "bg-brand-blue",
    textColor: "text-white",
  },
  {
    icon: "🔍",
    title: "100% Transparent Process",
    description:
      "No hidden charges, no surprise fees. Every step of your loan journey is explained clearly so you always know what to expect.",
    color: "bg-brand-bg",
    textColor: "text-brand-text",
  },
  {
    icon: "💡",
    title: "Expert Loan Guidance",
    description:
      "Deep knowledge across 8+ loan types and partnerships with leading banks helps us find the best match for your unique profile.",
    color: "bg-brand-surface",
    textColor: "text-brand-text",
  },
  {
    icon: "⭐",
    title: "High Customer Satisfaction",
    description:
      "Our clients recommend us to family and friends. Referrals are our biggest source of growth — a testament to genuine service.",
    color: "bg-brand-border",
    textColor: "text-brand-text",
  },
];

const trustMetrics = [
  { value: "500+", label: "Loans Processed", icon: "📋" },
  { value: "8+", label: "Loan Products", icon: "🏦" },
  { value: "48hr", label: "Avg. Approval", icon: "⚡" },
  { value: "100%", label: "Transparent Fees", icon: "✅" },
];

export default function Achievements() {
  return (
    <section id="achievements" className="py-20 bg-brand-bg border-y-2 border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-14">
          <span className="bg-brand-surface border-2 border-brand-border px-3 py-1 font-bold text-sm uppercase tracking-wider text-brand-text shadow-[var(--shadow-solid-sm)]">
            Why Choose Us
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-brand-text mt-6 mb-4">
            Achievements & Trust Signals
          </h2>
          <p className="text-brand-text-light font-bold max-w-xl mx-auto uppercase tracking-wider text-sm">
            Every number, every milestone is earned through hard work,
            integrity, and genuine commitment to our clients&apos; success.
          </p>
        </div>

        {/* Trust Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
          {trustMetrics.map((metric) => (
            <div
              key={metric.label}
              className="bg-brand-surface border-2 border-brand-border shadow-[var(--shadow-solid-sm)] p-5 text-center hover:translate-y-[-4px] hover:shadow-[var(--shadow-solid-md)] transition-all"
            >
              <span className="text-4xl block mb-3 bg-brand-bg border-2 border-brand-border w-16 h-16 mx-auto flex items-center justify-center">{metric.icon}</span>
              <p className="text-4xl font-bold text-brand-blue mb-1">
                {metric.value}
              </p>
              <p className="text-brand-text-light font-bold text-xs uppercase tracking-wider">{metric.label}</p>
            </div>
          ))}
        </div>

        {/* Achievements Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {achievements.map((item) => (
            <div
              key={item.title}
              className={`border-2 border-brand-border ${item.color} shadow-[var(--shadow-solid-sm)] p-6 hover:translate-y-[-4px] hover:shadow-[var(--shadow-solid-md)] transition-all`}
            >
              <div className="w-14 h-14 bg-brand-bg border-2 border-brand-border shadow-[var(--shadow-solid-sm)] flex items-center justify-center text-3xl mb-5">
                {item.icon}
              </div>
              <h3 className={`font-bold text-base mb-3 uppercase tracking-wider ${item.textColor}`}>
                {item.title}
              </h3>
              <p className={`font-bold text-xs leading-relaxed uppercase tracking-wider ${item.textColor === "text-white" ? "text-white/80" : "text-brand-text-light"}`}>
                {item.description}
              </p>
            </div>
          ))}

          {/* Trust Message Card */}
          <div className="bg-brand-surface border-2 border-brand-border shadow-[var(--shadow-solid-md)] p-8 text-brand-text sm:col-span-2 lg:col-span-1 flex flex-col justify-center">
            <div className="w-14 h-14 bg-brand-bg border-2 border-brand-border shadow-[var(--shadow-solid-sm)] flex items-center justify-center text-3xl mb-5">
              💚
            </div>
            <h3 className="font-bold text-xl mb-3 uppercase tracking-wider text-brand-text">Our Promise to You</h3>
            <p className="text-brand-text-light font-bold text-xs leading-relaxed mb-6 uppercase tracking-wider">
              With a background in education and management, we understand
              finance, people, and long-term trust. We&apos;re not just a loan
              agent — we&apos;re your financial partner.
            </p>
            <div className="flex items-center gap-4 bg-brand-bg border-2 border-brand-border p-3 shadow-[var(--shadow-solid-sm)]">
              <div className="w-12 h-12 bg-brand-blue border-2 border-brand-border flex items-center justify-center text-white font-bold text-xl">
                S
              </div>
              <div>
                <p className="text-brand-text font-bold text-sm uppercase tracking-wider">
                  {config.company.managingDirector}
                </p>
                <p className="text-brand-text-light font-bold text-xs uppercase tracking-wider">
                  {config.company.qualification} · MD
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <a
            href={config.whatsapp.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-brand-blue border-2 border-brand-border text-white font-bold px-8 py-4 shadow-[var(--shadow-solid-sm)] hover:translate-y-[-2px] hover:shadow-[var(--shadow-solid-md)] transition-all uppercase tracking-wider"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Start Your Loan Journey Today
          </a>
        </div>
      </div>
    </section>
  );
}
