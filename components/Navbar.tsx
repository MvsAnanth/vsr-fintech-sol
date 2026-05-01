"use client";

import { useState, useEffect } from "react";
import config from "@/config.json";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "Calculators", href: "#tools" },
  { label: "About", href: "#achievements" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b-2 border-transparent ${
        scrolled
          ? "bg-brand-navy border-brand-border shadow-[var(--shadow-solid-sm)]"
          : "bg-brand-navy"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <div className="relative h-14 w-auto flex-shrink-0">
              <img
                src="/images/vsr-logo.jpeg"
                alt="VSR Fintech Logo"
                className="h-full w-auto object-contain"
              />
            </div>
            <div className="border-l-2 border-brand-border pl-4">
              <p className="text-brand-text font-bold text-lg leading-none tracking-tight uppercase">
                {config.site.name}
              </p>
              <p className="text-brand-blue text-[10px] font-bold mt-1 leading-none tracking-wider uppercase">
                Financial Solutions
              </p>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="text-brand-text-light hover:text-brand-blue hover:-translate-y-0.5 text-sm font-semibold transition-transform cursor-pointer"
              >
                {link.label}
              </button>
            ))}
            <a
              href={config.whatsapp.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-brand-blue hover:bg-brand-blue-hover text-white text-sm font-bold px-6 py-3 transition-transform hover:-translate-y-1 shadow-[var(--shadow-solid-sm)] hover:shadow-[var(--shadow-solid-md)] flex items-center gap-2 border-2 border-brand-border"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Apply Now
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-brand-text p-2 hover:bg-brand-surface"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-brand-navy border-t-2 border-brand-border py-4 px-2 shadow-[var(--shadow-solid-md)] mb-4">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="block w-full text-left text-brand-text hover:text-brand-blue hover:bg-brand-surface px-4 py-3 text-sm font-semibold transition-colors"
              >
                {link.label}
              </button>
            ))}
            <div className="px-4 pt-4 pb-2">
              <a
                href={config.whatsapp.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center bg-brand-blue text-white text-sm font-bold px-4 py-3 shadow-[var(--shadow-solid-sm)] border-2 border-brand-border"
              >
                Apply via WhatsApp
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
