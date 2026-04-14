"use client";

import config from "@/config.json";

const achievements = [
  {
    icon: "🎓",
    title: "MBA + B.Ed Leadership",
    description:
      "Led by Sukanya Vadagandla, combining deep academic expertise in management and education to deliver exceptional financial advisory services.",
    color: "border-blue-200 bg-blue-50",
    iconBg: "bg-blue-100",
  },
  {
    icon: "🤝",
    title: "Strong Client Relationships",
    description:
      "Built lasting bonds with 500+ clients through personal attention, follow-ups, and genuine care for their financial goals.",
    color: "border-green-200 bg-green-50",
    iconBg: "bg-green-100",
  },
  {
    icon: "🔍",
    title: "100% Transparent Process",
    description:
      "No hidden charges, no surprise fees. Every step of your loan journey is explained clearly so you always know what to expect.",
    color: "border-purple-200 bg-purple-50",
    iconBg: "bg-purple-100",
  },
  {
    icon: "💡",
    title: "Expert Loan Guidance",
    description:
      "Deep knowledge across 8+ loan types and partnerships with leading banks helps us find the best match for your unique profile.",
    color: "border-orange-200 bg-orange-50",
    iconBg: "bg-orange-100",
  },
  {
    icon: "⭐",
    title: "High Customer Satisfaction",
    description:
      "Our clients recommend us to family and friends. Referrals are our biggest source of growth — a testament to genuine service.",
    color: "border-yellow-200 bg-yellow-50",
    iconBg: "bg-yellow-100",
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
    <section id="achievements" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-14">
          <span className="text-green-600 font-semibold text-sm uppercase tracking-wider">
            Why Choose Us
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2 mb-4">
            Achievements & Trust Signals
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Every number, every milestone is earned through hard work,
            integrity, and genuine commitment to our clients&apos; success.
          </p>
        </div>

        {/* Trust Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
          {trustMetrics.map((metric) => (
            <div
              key={metric.label}
              className="bg-white border border-gray-100 rounded-2xl p-5 text-center shadow-sm hover:shadow-md transition-shadow"
            >
              <span className="text-3xl block mb-2">{metric.icon}</span>
              <p className="text-3xl font-bold text-[#0f2d5a] mb-1">
                {metric.value}
              </p>
              <p className="text-gray-500 text-sm">{metric.label}</p>
            </div>
          ))}
        </div>

        {/* Achievements Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {achievements.map((item) => (
            <div
              key={item.title}
              className={`border ${item.color} rounded-2xl p-6 hover:shadow-lg transition-shadow`}
            >
              <div
                className={`w-12 h-12 ${item.iconBg} rounded-xl flex items-center justify-center text-2xl mb-4`}
              >
                {item.icon}
              </div>
              <h3 className="text-gray-900 font-bold text-base mb-2">
                {item.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}

          {/* Trust Message Card */}
          <div className="bg-gradient-to-br from-[#0f2d5a] to-[#1e4d8c] rounded-2xl p-6 text-white sm:col-span-2 lg:col-span-1">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-2xl mb-4">
              💚
            </div>
            <h3 className="font-bold text-base mb-2">Our Promise to You</h3>
            <p className="text-blue-200 text-sm leading-relaxed mb-4">
              With a background in education and management, we understand
              finance, people, and long-term trust. We&apos;re not just a loan
              agent — we&apos;re your financial partner.
            </p>
            <div className="flex items-center gap-3 bg-white/10 rounded-xl p-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-green-400 flex items-center justify-center text-white font-bold">
                S
              </div>
              <div>
                <p className="text-white font-semibold text-sm">
                  {config.company.managingDirector}
                </p>
                <p className="text-blue-300 text-xs">
                  {config.company.qualification} · Managing Director
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <a
            href={config.whatsapp.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#0f2d5a] hover:bg-[#1e4d8c] text-white font-semibold px-8 py-4 rounded-xl transition-colors shadow-lg"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Start Your Loan Journey Today
          </a>
        </div>
      </div>
    </section>
  );
}
