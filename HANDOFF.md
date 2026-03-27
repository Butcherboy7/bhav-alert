# Bhav Alert - Project Handoff

## Project Overview
**Name**: Bhav Alert - Daily Price Tracker  
**Description**: A Next.js 14 PWA project for tracking daily prices of commodities like Petrol, Diesel, Gold, LPG, etc., across various Indian cities.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Firebase Firestore
- **PWA Support**: next-pwa

## Current State (2026-03-27 12:45 PM)
The project has been initialized with the necessary configuration and library files.

### Completed Tasks
- [x] Initialized `package.json` and config files.
- [x] Implemented Firebase and price fetching logic.
- [x] Created `PriceCard`, `CitySelector`, `InstallPrompt`, and `AdBanner` components.
- [x] Configured `RootLayout` with PWA meta and AdSense.
- [x] Built the Main Page with real-time price tracking and city persistence.
- [x] Integrated sharing, refresh, and donation systems.

### Pending Tasks
- [ ] Deploy to Vercel and configure environment variables.
- [x] Implemented Firestore seed script and installed dependencies.
- [x] Connected to actual Firestore data (ran `seed.js`).
- [ ] Test PWA installation on physical devices.

## Key Files
- `src/components/`: Modular UI components (PriceCard, CitySelector, InstallPrompt).
- `src/app/page.tsx`: Root page with price tracking logic.
- `src/app/layout.tsx`: Root structure with metadata and AdSense.
- `scripts/seed.js`: Seed script for Firestore.

---
*Last Updated: 2026-03-27 1:15 PM*
