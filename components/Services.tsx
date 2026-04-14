"use client";

import config from "@/config.json";

const services = [
  {
    icon: "🏠",
    title: "Home Loan",
    description: "Own your dream home with affordable EMIs and quick approval",
    benefits: ["Up to 90% funding", "Tenure up to 30 years", "Doorstep service"],
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-100",
  },
  {
    icon: "👤",
    title: "Personal Loan",
    description: "Instant personal loans for any emergency or planned expense",
    benefits: ["No collateral needed", "Quick disbursal 48hrs", "Flexible repayment"],
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-100",
  },
  {
    icon: "🏢",
    title: "Business Loan",
    description: "Scale your business with dedicated financing solutions",
    benefits: ["Minimal documentation", "Competitive rates", "Working capital support"],
    color: "from-orange-500 to-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-100",
  },
  {
    icon: "🎓",
    title: "Education Loan",
    description: "Invest in your future with education financing",
    benefits: ["Covers tuition + living", "Moratorium period", "India & abroad"],
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-100",
  },
  {
    icon: "🏗️",
    title: "Loan Against Property",
    description: "Unlock equity from your property for any financial need",
    benefits: ["Up to 75% of property value", "Lower interest rates", "Long tenure option"],
    color: "from-teal-500 to-teal-600",
    bgColor: "bg-teal-50",
    borderColor: "border-teal-100",
  },
  {
    icon: "💼",
    title: "Project Funding",
    description: "End-to-end funding support for large-scale projects",
    benefits: ["Infrastructure projects", "SME & MSME funding", "Government scheme tie-ups"],
    color: "from-indigo-500 to-indigo-600",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-100",
  },
  {
    icon: "🌍",
    title: "NRI Services",
    description: "Specialized loan and investment services for NRIs",
    benefits: ["Home loans in India", "NRE/NRO account advisory", "Repatriation support"],
    color: "from-cyan-500 to-cyan-600",
    bgColor: "bg-cyan-50",
    borderColor: "border-cyan-100",
  },
  {
    icon: "🛡️",
    title: "Insurance",
    description: "Protect your assets and secure your family's future",
    benefits: ["Life & health cover", "Loan protection plans", "Best premium rates"],
    color: "from-rose-500 to-rose-600",
    bgColor: "bg-rose-50",
    borderColor: "border-rose-100",
  },
];

function getWhatsAppLink(service: string) {
  const message = encodeURIComponent(
    `Hi, I want to apply for a ${service}. Please guide me.`
  );
  return `https://wa.me/${config.whatsapp.number}?text=${message}`;
}

export default function Services() {
  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-14">
          <span className="text-green-600 font-semibold text-sm uppercase tracking-wider">
            What We Offer
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2 mb-4">
            Comprehensive Loan Solutions
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            From home loans to project funding — we have the right financial
            product for every need, backed by expert guidance.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <div
              key={service.title}
              className={`group bg-white border ${service.borderColor} rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col`}
            >
              {/* Icon */}
              <div
                className={`w-12 h-12 ${service.bgColor} rounded-xl flex items-center justify-center text-2xl mb-4`}
              >
                {service.icon}
              </div>

              <h3 className="text-gray-900 font-bold text-base mb-2">
                {service.title}
              </h3>
              <p className="text-gray-500 text-sm mb-4 flex-1">
                {service.description}
              </p>

              {/* Benefits */}
              <ul className="space-y-1.5 mb-5">
                {service.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-2 text-xs text-gray-600">
                    <svg
                      className="w-3.5 h-3.5 text-green-500 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {benefit}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <a
                href={getWhatsAppLink(service.title)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-[#0f2d5a] hover:bg-green-600 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Apply via WhatsApp
              </a>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-500 mb-4">
            Not sure which loan is right for you?
          </p>
          <a
            href={config.whatsapp.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-4 rounded-xl transition-colors shadow-lg shadow-green-500/30"
          >
            Get Free Expert Advice on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
