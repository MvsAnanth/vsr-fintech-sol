# Changelog — VSR Fintech Sol

All notable changes to this project are documented here.

---

## [1.0.0] — 2026-04-14

### Initial Release

**Project scaffolded** using `create-next-app` with Next.js 16, Tailwind CSS v4, TypeScript.

### Components Created

| Component | Purpose |
|-----------|---------|
| `Navbar.tsx` | Sticky navigation with mobile hamburger menu, smooth scroll |
| `Hero.tsx` | Full-screen hero with gradient, stats cards, CTA buttons |
| `Services.tsx` | 8 loan service cards with WhatsApp CTAs |
| `tools/FinancialTools.tsx` | Tab-based calculator container |
| `tools/EMICalculator.tsx` | Real-time EMI with visual breakdown + tooltip |
| `tools/LoanEligibility.tsx` | Eligibility estimator with EMI burden meter |
| `tools/CIBILSection.tsx` | CIBIL score guide, tips, low-CIBIL assistance |
| `VideoSection.tsx` | YouTube embed placeholder + journey flow steps |
| `Achievements.tsx` | Trust signals, metrics, MD profile card |
| `Contact.tsx` | Phone + WhatsApp + pre-filled form → WA redirect |
| `Footer.tsx` | Full footer with links, contact, and branding |
| `WhatsAppButton.tsx` | Floating sticky WhatsApp button (pulse animation) |
| `ui/Tooltip.tsx` | Click-based formula tooltip for calculators |

### Utilities Created

- `utils/calculators.ts` — Pure TypeScript: `calculateEMI`, `calculateEligibility`, `formatINR`, `formatINRLabel`

### Configuration

- `config.json` — Centralized company info, WhatsApp URL, SEO metadata, version
- `scripts/start.sh` — Dev/prod server launcher
- `scripts/stop.sh` — Port 3000 process killer

### Design Decisions

- **Color palette:** Deep Blue (#0f2d5a) + Green (#16a34a) — finance + trust
- **WhatsApp-first:** Every section has at least one WhatsApp CTA
- **No backend:** 100% frontend static site — deployable on Vercel/Netlify
- **Calculator formulas:** Shown in click-triggered tooltips (not modals) for clean UX
- **Form-to-WhatsApp:** Contact form pre-fills WhatsApp message, no server needed
- **Mobile-first:** Navbar collapses, cards stack, stats grid 2-col on mobile
- **Floating WA button:** Appears after 200px scroll on mobile; always visible on desktop
- **Video placeholder:** Clean placeholder until actual video content is provided

### SEO

- Full Open Graph tags
- Twitter card meta
- Robots crawl enabled
- Author metadata from config
- Descriptive page title and meta description

---

---

## [1.0.1] — 2026-04-14

### Netlify Deployment Support

- Changed port from 3000 → 5001
- Added `output: "export"` to `next.config.ts` — enables static HTML/CSS/JS build in `/out`
- Added `trailingSlash: true` for Netlify clean URL compatibility
- Created `netlify.toml` — build command, publish dir (`out`), Node version, SPA redirect rule
- Static export verified: `npm run build` generates `/out/index.html` successfully

*Future changes should be documented here with version, date, and description.*
