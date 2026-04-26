"use client";

import { useState } from "react";
import config from "@/config.json";

const loanTypes = [
  "Home Loan",
  "Personal Loan",
  "Business Loan",
  "Education Loan",
  "Loan Against Property",
  "Project Funding",
  "NRI Services",
  "Insurance",
  "Other / Not Sure",
];

interface FormData {
  name: string;
  phone: string;
  loanType: string;
}

export default function Contact() {
  const [form, setForm] = useState<FormData>({
    name: "",
    phone: "",
    loanType: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const getWhatsAppMessage = () => {
    const msg = `Hi! I'm ${form.name || "interested"}${form.loanType ? ` and I want to apply for a ${form.loanType}` : " in your loan services"}. My contact number is ${form.phone || "provided separately"}. Please guide me.`;
    return encodeURIComponent(msg);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const url = `https://wa.me/${config.whatsapp.number}?text=${getWhatsAppMessage()}`;
    window.open(url, "_blank");
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-20 bg-white border-b-2 border-brand-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-14">
          <span className="bg-brand-bg border-2 border-brand-navy px-3 py-1 font-bold text-sm uppercase tracking-wider text-brand-navy shadow-[var(--shadow-solid-sm)]">
            Get In Touch
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-brand-navy mt-6 mb-4">
            Start Your Loan Application Today
          </h2>
          <p className="text-brand-text-light font-bold max-w-xl mx-auto uppercase tracking-wider text-sm">
            No lengthy forms. No waiting. Just send us a message and our expert
            team will guide you through the entire process.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Contact Info */}
          <div className="space-y-6">
            {/* MD Card */}
            <div className="bg-brand-navy border border-gray-200 shadow-[var(--shadow-solid-md)] p-8 rounded-2xl text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
              
              <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center text-brand-navy font-bold text-2xl shadow-sm">
                  {config.company.managingDirector.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-xl uppercase tracking-wider text-white">
                    {config.company.managingDirector}
                  </h3>
                  <p className="text-[#4ade80] font-bold text-xs uppercase tracking-wider">
                    Managing Director · {config.company.qualification}
                  </p>
                  <p className="text-gray-400 font-bold text-[10px] uppercase tracking-wider">VSR Fintech Sol</p>
                </div>
              </div>
              <p className="text-gray-200 font-medium text-sm leading-relaxed relative z-10">
                &quot;We believe everyone deserves access to the right
                financial products at the right time. Let me personally guide
                you to the best loan solution for your needs.&quot;
              </p>
            </div>

            {/* Contact Options */}
            <div className="space-y-4">
              <a
                href={`tel:${config.company.phone}`}
                className="flex items-center gap-4 bg-white border border-gray-200 shadow-sm p-5 rounded-2xl transition-all hover:shadow-md group"
              >
                <div className="w-12 h-12 bg-[#f8f9fa] rounded-xl flex items-center justify-center border border-gray-100">
                  <svg
                    className="w-6 h-6 text-brand-blue"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-400 font-bold text-[10px] mb-0.5 uppercase tracking-wider">Call Directly</p>
                  <p className="text-brand-navy font-bold text-lg">
                    {config.company.phone}
                  </p>
                </div>
                <svg
                  className="w-5 h-5 text-gray-300 ml-auto group-hover:text-brand-navy transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </a>

              <a
                href={config.whatsapp.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 bg-white border border-gray-200 shadow-sm p-5 rounded-2xl transition-all hover:shadow-md group"
              >
                <div className="w-12 h-12 bg-[#e8f5e9] rounded-xl flex items-center justify-center border border-[#c8e6c9]">
                  <svg
                    className="w-6 h-6 text-[#1b5e20]"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-400 font-bold text-[10px] mb-0.5 uppercase tracking-wider">WhatsApp</p>
                  <p className="text-[#1b5e20] font-bold text-lg">
                    Chat with us instantly
                  </p>
                </div>
                <svg
                  className="w-5 h-5 text-gray-300 ml-auto group-hover:text-[#1b5e20] transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </a>
            </div>

            {/* Business hours note */}
            <div className="flex items-center gap-4 bg-gray-50 border border-gray-200 shadow-sm p-5 rounded-2xl">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-xl shadow-sm border border-gray-100">
                🕐
              </div>
              <div>
                <p className="text-brand-navy font-bold text-xs uppercase tracking-wider">Available Mon–Sat</p>
                <p className="text-gray-500 font-medium text-xs">9:00 AM – 7:00 PM IST</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white border border-gray-200 shadow-md rounded-2xl p-8 relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full -mr-16 -mt-16" />
            
            {submitted ? (
              <div className="text-center py-12 relative z-10">
                <div className="w-20 h-20 bg-[#e8f5e9] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-[#c8e6c9]">
                  <svg
                    className="w-10 h-10 text-[#1b5e20]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-brand-navy font-bold text-2xl mb-3 uppercase tracking-wider">
                  Request Sent!
                </h3>
                <p className="text-gray-500 font-medium text-sm mb-8 max-w-xs mx-auto">
                  WhatsApp has been opened with your inquiry. Our team will get back to you shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="bg-brand-navy text-white px-8 py-3 rounded-xl font-bold uppercase tracking-wider hover:bg-brand-blue transition-all shadow-sm"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <div className="relative z-10">
                <h3 className="text-brand-navy font-bold text-2xl mb-2 uppercase tracking-wider">
                  Quick Inquiry
                </h3>
                <p className="text-gray-400 font-bold text-[10px] mb-8 uppercase tracking-wider">
                  Submit details to chat with us on WhatsApp
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="e.g. John Doe"
                      required
                      className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue text-brand-navy font-bold bg-gray-50 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+91 XXXXX XXXXX"
                      required
                      className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue text-brand-navy font-bold bg-gray-50 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">
                      Service Required
                    </label>
                    <div className="relative">
                      <select
                        name="loanType"
                        value={form.loanType}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue text-brand-navy font-bold bg-gray-50 transition-all appearance-none"
                      >
                        <option value="">Select loan type</option>
                        {loanTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-3 bg-brand-navy text-white font-bold py-4 rounded-xl uppercase tracking-wider shadow-lg hover:bg-brand-blue transition-all mt-8 relative z-30 border-2 border-brand-navy"
                  >
                    <svg className="w-5 h-5 text-[#4ade80]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    <span>Submit via WhatsApp</span>
                  </button>

                  <p className="text-center font-bold text-gray-400 text-[9px] uppercase tracking-wider mt-4">
                    Fast & Secure Inquiry Process
                  </p>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
