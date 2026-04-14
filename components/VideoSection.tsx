"use client";

import { useState } from "react";
import config from "@/config.json";

// Content flow cards shown before/alongside the video
const flowSteps = [
  {
    step: "01",
    title: "The Problem",
    desc: "Loan rejections, high interest, confusing paperwork — sound familiar?",
    icon: "😟",
  },
  {
    step: "02",
    title: "Meet VSR Fintech",
    desc: "Expert guidance to navigate the complex world of loans with ease.",
    icon: "🤝",
  },
  {
    step: "03",
    title: "Our Services",
    desc: "8+ loan types, insurance, NRI services — all under one roof.",
    icon: "🏦",
  },
  {
    step: "04",
    title: "Why Trust Us",
    desc: "MBA leadership, 500+ happy clients, 100% transparent process.",
    icon: "🌟",
  },
];

export default function VideoSection() {
  const [videoLoaded, setVideoLoaded] = useState(false);

  // Placeholder video - to be replaced with actual video URL
  const videoPlaceholder = true;

  return (
    <section id="video" className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-green-400 font-semibold text-sm uppercase tracking-wider">
            Watch & Learn
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2 mb-4">
            See How VSR Fintech Can Help You
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            A quick 60-second overview of how we help clients get the loans they
            deserve, even with low CIBIL scores.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Video Player */}
          <div className="relative">
            {videoPlaceholder ? (
              /* Placeholder until actual video is provided */
              <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl flex flex-col items-center justify-center border border-gray-600 overflow-hidden">
                {/* Decorative background */}
                <div className="absolute inset-0 bg-[#0f2d5a]/40" />
                <div className="relative text-center px-6">
                  <div className="w-20 h-20 bg-green-500/20 border-2 border-green-400 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <svg
                      className="w-8 h-8 text-green-400 ml-1"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <p className="text-white font-semibold text-lg mb-2">
                    Video Coming Soon
                  </p>
                  <p className="text-gray-400 text-sm mb-6">
                    Our 60-second introduction video will be available here.
                    <br />
                    In the meantime, connect with us directly.
                  </p>
                  <a
                    href={config.whatsapp.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Talk to Us on WhatsApp
                  </a>
                </div>
              </div>
            ) : (
              /* Actual YouTube embed - replace VIDEO_ID */
              <div className="aspect-video rounded-2xl overflow-hidden border border-gray-600">
                <iframe
                  src="https://www.youtube.com/embed/VIDEO_ID?autoplay=0&rel=0"
                  title="VSR Fintech Sol Introduction"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  onLoad={() => setVideoLoaded(true)}
                />
              </div>
            )}
          </div>

          {/* Flow Steps */}
          <div className="space-y-4">
            {flowSteps.map((step) => (
              <div
                key={step.step}
                className="flex items-start gap-4 bg-gray-800/50 border border-gray-700 rounded-xl p-4 hover:bg-gray-800 transition-colors"
              >
                <div className="w-10 h-10 bg-green-500/10 border border-green-500/30 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                  {step.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-green-400 text-xs font-mono font-bold">
                      {step.step}
                    </span>
                    <h3 className="text-white font-semibold text-sm">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-gray-400 text-sm">{step.desc}</p>
                </div>
              </div>
            ))}

            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-green-400 font-semibold text-sm">
                  Ready to get started?
                </p>
                <p className="text-gray-400 text-xs">
                  Free consultation — no obligation
                </p>
              </div>
              <a
                href={config.whatsapp.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 hover:bg-green-400 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
              >
                Contact Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
