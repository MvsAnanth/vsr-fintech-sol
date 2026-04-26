# VSR Fintech Solutions - Financial Services Website

> **Version:** 1.0.0  
> **Managing Director:** Sukanya Vadagandla (B.Ed, MBA)  
> **Contact:** +91 9391300146  
> **Stack:** Next.js 16 · Tailwind CSS v4 · TypeScript · No Backend

---

## Overview

VSR Fintech Solutions is a high-performance, mobile-first, fully responsive single-page website for a financial services company. The site is designed to build trust instantly, clearly explain loan services, and drive WhatsApp conversions.

---

## Features

| Feature | Details |
|---------|---------|
| **Hero Section** | Full-screen gradient, headline, CTA buttons, stats |
| **Services (8 types)** | Home, Personal, Business, Education, LAP, Project, NRI, Insurance |
| **EMI Calculator** | Real-time EMI with principal/interest breakdown |
| **Loan Eligibility** | 50% income rule with interactive EMI burden meter |
| **CIBIL Guide** | Score ranges, tips, low-CIBIL help |
| **Video Section** | YouTube embed placeholder (configurable) |
| **Achievements** | Trust metrics, MD profile, achievement cards |
| **Contact Section** | Phone + WhatsApp + pre-filled inquiry form |
| **Floating WhatsApp** | Bottom-right sticky button with pulse animation |
| **SEO Metadata** | Title, description, OG tags, robots |

---

## Project Structure

```
vsr_fintech_sol/
├── app/
│   ├── globals.css          # Global styles + custom animations
│   ├── layout.tsx           # Root layout with SEO metadata
│   └── page.tsx             # Main page assembling all sections
├── components/
│   ├── Navbar.tsx           # Sticky nav with mobile hamburger menu
│   ├── Hero.tsx             # Hero section with CTA
│   ├── Services.tsx         # 8 service cards with WhatsApp CTAs
│   ├── VideoSection.tsx     # Video embed + content flow steps
│   ├── Achievements.tsx     # Trust signals + MD profile
│   ├── Contact.tsx          # Contact form → WhatsApp redirect
│   ├── Footer.tsx           # Footer with links and contact info
│   ├── WhatsAppButton.tsx   # Floating WhatsApp button
│   ├── tools/
│   │   ├── FinancialTools.tsx   # Tab container for calculators
│   │   ├── EMICalculator.tsx    # Real-time EMI calculator
│   │   ├── LoanEligibility.tsx  # Eligibility estimator
│   │   └── CIBILSection.tsx     # CIBIL guide + tips
│   └── ui/
│       └── Tooltip.tsx      # Info tooltip for calculator formulas
├── utils/
│   └── calculators.ts       # Pure calculator logic (EMI, eligibility, formatting)
├── config.json              # Centralized config (company info, WhatsApp, SEO)
├── scripts/
│   ├── start.sh             # Start dev or prod server
│   └── stop.sh              # Stop server on port 3000
└── CHANGELOG.md             # Version history
```

---

## Quick Start

### Development

```bash
# Option 1: Using the start script
./scripts/start.sh

# Option 2: Direct npm
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
# Build and start
./scripts/start.sh prod

# Or manually
npm run build
npm run start
```

### Stop Server

```bash
./scripts/stop.sh
```

---

## Configuration

All key settings live in [`config.json`](config.json). Edit this file to update:

```json
{
  "version": "1.0.0",
  "site": {
    "name": "VSR Fintech Sol",
    "url": "https://vsrfintechsol.com"
  },
  "company": {
    "managingDirector": "Sukanya Vadagandla",
    "qualification": "B.Ed, MBA",
    "phone": "+91 9391300146"
  },
  "whatsapp": {
    "number": "919391300146",
    "defaultMessage": "Hi I want to apply for a loan"
  },
  "seo": {
    "title": "...",
    "description": "..."
  }
}
```

---

## Adding a Real Video

In `components/VideoSection.tsx`, change:

```tsx
const videoPlaceholder = true;  // ← change to false
```

And replace `VIDEO_ID` in the iframe src with your YouTube video ID:

```tsx
src="https://www.youtube.com/embed/YOUR_VIDEO_ID?autoplay=0&rel=0"
```

---

## Deployment (Vercel — Recommended)

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import repo
3. Framework: **Next.js** (auto-detected)
4. Deploy

**Or deploy via CLI:**

```bash
npm i -g vercel
vercel
```

### Environment Variables

No environment variables needed — this is a fully frontend-only application.

---

## WhatsApp Integration

Every CTA on the site opens WhatsApp with a pre-filled message. The base URL is configured in `config.json`:

```
https://wa.me/919391300146?text=Hi%20I%20want%20to%20apply%20for%20a%20loan
```

Service-specific messages are generated dynamically (e.g., "Hi, I want to apply for a Home Loan").

---

## Calculator Logic

Located in [`utils/calculators.ts`](utils/calculators.ts):

**EMI Formula:**
```
EMI = (P × R × (1+R)^N) / ((1+R)^N - 1)
R = Annual Rate / 12 / 100
```

**Loan Eligibility:**
```
Eligible EMI = (Monthly Income × 0.5) − Existing EMIs
Loan Amount ≈ Reverse EMI calculation at 60-month tenure
```

---

## Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js | 16.x | React framework with App Router |
| React | 19.x | UI library |
| Tailwind CSS | 4.x | Utility-first styling |
| TypeScript | 5.x | Type safety |

---

## Browser Support

- Chrome 90+
- Firefox 90+
- Safari 14+
- Edge 90+
- Mobile: iOS Safari 14+, Chrome Android

---

## Journey Documentation

See [CHANGELOG.md](CHANGELOG.md) for a complete history of changes.
