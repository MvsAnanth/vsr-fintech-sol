"use client";

import { motion } from "framer-motion";
import config from "@/config.json";
import { ArrowRight, Briefcase, Home, TrendingUp, PhoneCall } from "lucide-react";

const stats = [
  { value: "500+", label: "Happy Clients" },
  { value: "8+", label: "Loan Types" },
  { value: "48hr", label: "Fast Approval" },
  { value: "100%", label: "Transparent" },
];

export default function Hero() {
  const scrollToContact = () => {
    const el = document.querySelector("#contact");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home" className="pt-32 pb-20 overflow-hidden relative bg-brand-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Trust badge */}
            <div className="inline-flex items-center gap-2 bg-white border-2 border-brand-navy px-4 py-2 mb-6 shadow-[var(--shadow-solid-sm)]">
              <span className="w-3 h-3 rounded-none bg-green-500 border border-brand-navy animate-pulse" />
              <span className="text-brand-navy text-sm font-bold uppercase tracking-wider">
                Trusted by 500+ clients
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-brand-navy leading-tight mb-6">
              Instant <span className="text-brand-blue">Loans</span> <br />
              Zero Hassle.
            </h1>
            <p className="text-xl text-brand-text-light mb-8 max-w-lg font-medium">
              {config.seo.description}. Fast Approval. Low Interest. Trusted Guidance.
            </p>
            
            <div className="flex flex-wrap gap-4 mb-10">
              <motion.button
                onClick={scrollToContact}
                whileHover={{ y: -4, boxShadow: "var(--shadow-solid-md)" }}
                whileTap={{ y: 0, boxShadow: "none" }}
                className="bg-brand-blue text-white px-8 py-4 font-bold text-lg transition-transform shadow-[var(--shadow-solid-sm)] border-2 border-brand-navy flex items-center gap-2"
              >
                Apply Now <ArrowRight className="w-5 h-5" />
              </motion.button>
              <motion.a
                href={config.whatsapp.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -4, boxShadow: "var(--shadow-solid-md)" }}
                whileTap={{ y: 0, boxShadow: "none" }}
                className="bg-white text-brand-navy px-8 py-4 font-bold text-lg transition-transform shadow-[var(--shadow-solid-sm)] border-2 border-brand-navy"
              >
                WhatsApp Us
              </motion.a>
            </div>

            {/* Quick Contact Inline */}
            <div className="flex items-center gap-4 bg-white border-2 border-brand-navy p-4 shadow-[var(--shadow-solid-sm)] max-w-md">
               <div className="bg-brand-blue p-2 border-2 border-brand-navy">
                 <PhoneCall className="w-6 h-6 text-white" />
               </div>
               <div>
                 <p className="text-xs font-bold text-brand-text-light uppercase tracking-wider">Call for Guidance</p>
                 <a href={`tel:${config.company.phone}`} className="text-lg font-bold text-brand-navy hover:text-brand-blue">
                   {config.company.phone}
                 </a>
               </div>
            </div>
          </motion.div>

          {/* Right 3D Solid Elements */}
          <div className="relative h-[600px] hidden lg:block">
            {/* Base platform */}
            <motion.div
              initial={{ opacity: 0, rotateX: 60, rotateZ: -45, y: 100 }}
              animate={{ opacity: 1, rotateX: 60, rotateZ: -45, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-brand-border border-4 border-brand-navy shadow-[24px_24px_0px_#071a3a]"
            />
            
            {/* Floating blocks */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: [0, -15, 0] }}
              transition={{ 
                opacity: { duration: 0.5, delay: 0.5 },
                y: { repeat: Infinity, duration: 4, ease: "easeInOut" }
              }}
              className="absolute top-8 right-8 w-48 h-48 bg-brand-blue border-4 border-brand-navy shadow-[12px_12px_0px_#071a3a] flex flex-col items-center justify-center text-white"
            >
              <Home className="w-16 h-16 mb-4" strokeWidth={1.5} />
              <span className="font-bold text-lg tracking-wider">MORTGAGE</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: [0, 15, 0] }}
              transition={{ 
                opacity: { duration: 0.5, delay: 0.7 },
                y: { repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }
              }}
              className="absolute bottom-16 left-12 w-44 h-44 bg-white border-4 border-brand-navy shadow-[12px_12px_0px_#071a3a] flex flex-col items-center justify-center text-brand-navy"
            >
              <Briefcase className="w-12 h-12 mb-3 text-brand-blue" strokeWidth={1.5} />
              <span className="font-bold text-sm tracking-wider">BUSINESS</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[#e8c45a] border-4 border-brand-navy shadow-[12px_12px_0px_#071a3a] flex items-center justify-center z-20"
            >
              <TrendingUp className="w-16 h-16 text-brand-navy" strokeWidth={2} />
            </motion.div>
          </div>
          
        </div>

        {/* Stats Strip */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              whileHover={{ y: -4, boxShadow: "var(--shadow-solid-sm)" }}
              className="bg-white border-2 border-brand-navy p-6 shadow-[var(--shadow-solid-sm)] text-center transition-transform"
            >
              <p className="text-3xl lg:text-4xl font-bold text-brand-blue mb-1">{stat.value}</p>
              <p className="text-brand-text-light font-bold text-sm tracking-wider uppercase">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
