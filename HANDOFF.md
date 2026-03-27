# Bhav Alert - Project Handoff

## Project Overview
**Name**: Bhav Alert - Daily Price Tracker  
**Description**: A Next.js 14 PWA project for tracking daily prices of commodities like Petrol, Diesel, Gold, LPG, etc., across various Indian cities.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (PostCSS + Autoprefixer)
- **Backend/DB**: Firebase Firestore
- **PWA Support**: next-pwa
- **Scraper**: Node.js script using Cheerio + Axios + GoldAPI.io

## Current State (2026-03-27 V2 Upgrade)
The project has just undergone a massive Phase 2 upgrade, including multilingual support, 7-day trend tracking, Price Alerts, affiliate/AdSense integration, SSR city pages, and a secure admin backend.

### Completed Tasks (V2 Upgrade)
- [x] **Gold Price Fix**: Integrated `goldapi.io` for accurate real-time gold prices alongside existing Goodreturns scraping.
- [x] **7-Day Price Trends**: Scraper now computes weekly $\%$ change/direction and stores it in Firestore. UI uses this to display a `TrendBadge`.
- [x] **GitHub Actions Schedule**: Chron job updated to run 6 times a day (6 AM, 10 AM, 12 PM, 3 PM, 6 PM, 9 PM IST).
- [x] **Multilingual Support**: Fully translated into 9 languages (EN, HI, TE, TA, MR, BN, GU, KN, ML). Added useTranslation hook and LanguageSelector.
- [x] **Price Alerts Module**: Added a `PriceAlertModal` saving thresholds to `localStorage`. App detects crossed thresholds and shows a prominent red banner.
- [x] **Razorpay Integration**: Added `RazorpayButton` for 3 donation tiers, gracefully falling back to UPI deep links if env vars missing.
- [x] **AdSense & Affiliates**:
    - Created compliance pages (`/privacy`, `/terms`, `/refund`, `/contact`).
    - Added AdSense logic and script tags to `layout.tsx` + `AdBanner.tsx`.
    - Integrated **Amazon Essentials** affiliate card as a high-conversion fallback.
- [x] **SEO & performance**:
    - Added structured JSON-LD data.
    - SSR implemented for `/[city]/page.tsx`.
    - `manifest.json` updated with categories/screenshots for better PWA install prompts.
    - Added pull-to-refresh handling and offline banner.
- [x] **Vercel Build Stability**: 
    - Fixed Firebase Admin initialization to prevent build-time crashes.
    - Escaped all HTML entities (quotes) to comply with strict production linting.

### Required Setup Instructions

#### 1. GoldAPI.io Key (DONE ✅)
- Added `GOLD_API_KEY="goldapi-eq8vpsmn8r6hlt-io"` to `.env.local`.
- **Action Required**: Add this to GitHub Secrets for the scraper.

#### 2. Google AdSense (IN PROGRESS ⏳)
- Added `NEXT_PUBLIC_ADSENSE_CLIENT_ID` placeholder in `.env.local`.
- **Action Required**: User to follow Step 1-3 to link the site.

#### 3. Razorpay Payment Links
- Go to Razorpay Dashboard > Payment Links.
- Create 3 static universal links for ₹29, ₹49, and ₹99.
- Add them to `.env.local` as `NEXT_PUBLIC_RAZORPAY_LINK_29` etc.

#### 5. Admin Page Usage
- Navigate to `https://bhavalert.vercel.app/admin`.
- Ensure `ADMIN_PASSWORD` is set in your Vercel Environment Variables.
- Use it to instantly override any bad scraped value without needing to access Firebase Console.

### Key Files
- `src/lib/translations.ts`: Contains the 9-language dictionary.
- `src/hooks/useTranslation.ts`: Custom event-driven language hook.
- `src/api/admin/update-price/route.ts`: Secure endpoint for the admin toolkit.
- `scripts/scraper.js`: Core brain that grabs fuel, gold API, and calculates trends.
- `src/components/PriceAlertModal.tsx`: Localized alert engine.
- `.env.local.example`: Master list of all new variables.

---
*Last Updated: 2026-03-27*
