import type { Metadata, Viewport } from "next";
import "./globals.css";
import Script from "next/script";

export const metadata: Metadata = {
  metadataBase: new URL("https://bhav-alert.vercel.app"),
  title: "Bhav Alert - Petrol, Gold, LPG Price Today India",
  description: "Check today's petrol price, gold rate, LPG cylinder price, onion price. Daily updates for 20+ Indian cities.",
  keywords: "petrol price today, gold rate today, diesel price, LPG price, onion price",
  openGraph: {
    images: ["/og-image.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#FF6B00",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  return (
    <html lang="en">
      <head>
        {adsenseId && (
          <>
            <meta name="google-adsense-account" content={adsenseId} />
            <Script
              async
              src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
              crossOrigin="anonymous"
              strategy="afterInteractive"
            />
          </>
        )}
        <Script
          id="json-ld"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Bhav Alert",
              "description": "Daily commodity price tracker for India",
              "url": "https://bhavalert.vercel.app",
              "applicationCategory": "FinanceApplication",
              "operatingSystem": "Any",
              "offers": { "@type": "Offer", "price": "0" },
            }),
          }}
        />
      </head>
      <body className="bg-gray-50 flex flex-col min-h-screen text-gray-900 overflow-x-hidden antialiased selection:bg-orange-100 selection:text-orange-900">
        <main className="w-full max-w-md mx-auto min-h-screen flex flex-col bg-white shadow-2xl overflow-hidden shadow-gray-200">
          {children}

          <footer className="mt-auto pt-16 pb-8 px-10 text-center space-y-4">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Bhav Alert v2.0 | Prices from public sources</p>
            <p className="text-[9px] leading-relaxed text-gray-400 font-medium px-4">
              Disclaimer: Prices are for informational purposes only. Local city variations and dealer margins may apply. Always verify with actual vendors before purchase.
            </p>
            <div className="flex justify-center flex-wrap gap-4 text-[10px] uppercase font-bold text-gray-400 mt-4">
              <a href="/privacy" className="hover:text-orange-500">Privacy Policy</a>
              <a href="/terms" className="hover:text-orange-500">Terms of Service</a>
              <a href="/refund" className="hover:text-orange-500">Refund Policy</a>
              <a href="/contact" className="hover:text-orange-500">Contact Us</a>
            </div>
          </footer>
        </main>
      </body>
    </html>
  );
}
