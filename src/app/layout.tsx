import type { Metadata, Viewport } from "next";
import "./globals.css";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Bhav Alert - Petrol, Gold, LPG Price Today India",
  description: "Check today's petrol price, gold rate, LPG cylinder price, onion price. Daily updates for 20+ Indian cities.",
  keywords: "petrol price today, gold rate today, diesel price, LPG price, onion price",
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
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </head>
      <body className="bg-gray-50 flex flex-col min-h-screen text-gray-900 overflow-x-hidden antialiased selection:bg-orange-100 selection:text-orange-900">
        <main className="w-full max-w-md mx-auto min-h-screen flex flex-col bg-white shadow-2xl overflow-hidden shadow-gray-200">
          {children}
        </main>
      </body>
    </html>
  );
}
