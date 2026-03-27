# Bhav Alert - Daily Price Tracker India 📱

A Next.js 14 PWA app for tracking daily prices of Petrol, Diesel, Gold, LPG, and groceries across 20+ Indian cities.

## ✨ Features
- **📊 Live Price Grid**: Tracks 8 categories (Fuel, Gold, LPG, Veggies).
- **📍 City Selection**: Auto-persists location for hyperlocal tracking.
- **📲 PWA Support**: Install to home screen for offline support and zero-latency alerts.
- **🔗 Smart Sharing**: WhatsApp and Native sharing with beautifully formatted messages.
- **🤖 Automated Scraper**: Daily price updates via GitHub Actions.

## 🚀 Setup & Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-repo/bhav-alert
    cd bhav-alert
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Variables**:
    Create a `.env.local` file with your Firebase and AdSense credentials:
    ```env
    NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
    NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-your_id
    ```

## 🔥 Firebase Setup

1.  Create a Firebase Project at [Firebase Console](https://console.firebase.google.com/).
2.  Enable **Firestore Database**.
3.  Add a **Web App** and copy the config to `.env.local`.
4.  **Seeding Initial Data**: Create a collection named `prices` and a document named `latest`. 
    Use this JSON structure as a starting point:
    ```json
    {
      "petrol": { "mumbai": { "price": 106.31, "change": 0 } },
      "diesel": { "mumbai": { "price": 94.27, "change": 0 } },
      "gold": { "price_24k": 76540, "price_22k": 70340, "change_24k": 0, "change_22k": 0 },
      "lpg": { "price": 903, "change": 0 },
      "onion": { "price": 40, "change": 0 },
      "rice": { "price": 45, "change": 0 },
      "milk": { "price": 28, "change": 0 },
      "updatedAt": "2026-03-27T00:00:00Z"
    }
    ```

## 🛠️ Scraper Automation

The price scraper is located in `scripts/scraper.js` and runs via **GitHub Actions**.

### To enable automated updates:
1.  **Firebase Service Account**: Go to Project Settings > Service Accounts and click "Generate new private key".
2.  **GitHub Secrets**: In your repo, go to Settings > Secrets and Variables > Actions.
    *   `FIREBASE_SERVICE_ACCOUNT`: Paste the entire JSON content from your service account key file.
    *   `DATA_GOV_API_KEY`: (Optional) Your API key from data.gov.in.

The scraper runs at **6:15 AM** and **12:00 PM IST** daily.

## 📦 Deployment

1.  Connect your repo to **Vercel**.
2.  Add all environment variables from `.env.local`.
3.  Deploy!

## 📜 License
MIT
