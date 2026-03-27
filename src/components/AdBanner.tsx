"use client";

import React, { useEffect, useRef } from "react";

/* ─── AdSense Unit ─── */
interface AdSenseUnitProps {
  slot: string;
  format?: "auto" | "horizontal" | "rectangle";
}

export const AdSenseUnit: React.FC<AdSenseUnitProps> = ({ slot, format = "auto" }) => {
  const adRef = useRef<boolean>(false);
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  useEffect(() => {
    if (adRef.current || !clientId) return;
    adRef.current = true;
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []) as any[];
      ((window as any).adsbygoogle as any[]).push({});
    } catch {
      // AdSense not loaded
    }
  }, [clientId]);

  if (!clientId) return null;

  return (
    <div className="my-4">
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={clientId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
};

/* ─── Amazon Essentials Grid ─── */
export const EssentialsGrid: React.FC = () => {
  const products = [
    { 
      id: "stove", 
      emoji: "🔥", 
      name: "Modern LPG Stoves", 
      desc: "Save gas with high efficiency", 
      url: process.env.NEXT_PUBLIC_AMAZON_STOVE_URL || "https://amazon.in" 
    },
    { 
      id: "lighter", 
      emoji: "🧨", 
      name: "Safety Lighters", 
      desc: "Kitchen must-have", 
      url: process.env.NEXT_PUBLIC_AMAZON_LIGHTER_URL || "https://amazon.in" 
    },
    { 
      id: "groceries", 
      emoji: "🌾", 
      name: "Bulk Pantry Deals", 
      desc: "Rice, Dal & Pulles", 
      url: process.env.NEXT_PUBLIC_AMAZON_GROCERY_URL || "https://amazon.in" 
    },
    { 
      id: "fuel", 
      emoji: "🚗", 
      name: "Fuel Additives", 
      desc: "Better mileage hacks", 
      url: process.env.NEXT_PUBLIC_AMAZON_FUEL_URL || "https://amazon.in" 
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 mt-4">
      {products.map((p) => (
        <a
          key={p.id}
          href={p.url}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm active:scale-95 transition-transform"
        >
          <span className="text-2xl mb-2 block">{p.emoji}</span>
          <h4 className="font-bold text-xs text-gray-800 leading-tight">{p.name}</h4>
          <p className="text-[9px] text-gray-500 mt-1">{p.desc}</p>
          <div className="mt-3 text-[10px] font-bold text-orange-500 flex items-center">
            View Deals <span className="ml-1">→</span>
          </div>
        </a>
      ))}
    </div>
  );
};

/* ─── Grocery Affiliate Card ─── */
export const GroceryAffiliateCard: React.FC = () => {
  const blinkitUrl = process.env.NEXT_PUBLIC_BLINKIT_AFFILIATE_URL || "https://blinkit.com";

  return (
    <a
      href={blinkitUrl}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="block bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-5 shadow-lg border border-green-400/30 text-white relative overflow-hidden group transition-all hover:scale-[0.99] active:scale-95"
    >
      <div className="absolute top-0 right-0 -mr-10 -mt-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
      <div className="relative z-10 flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xl">🛒</span>
            <h3 className="font-black text-sm tracking-tight">Order Groceries</h3>
          </div>
          <p className="text-[10px] text-green-100/80 font-medium">10-min delivery on Blinkit</p>
        </div>
        <span className="bg-white/20 px-4 py-2 rounded-xl text-xs font-bold backdrop-blur-sm">
          Order →
        </span>
      </div>
    </a>
  );
};

/* ─── Fuel Affiliate Card ─── */
export const FuelAffiliateCard: React.FC = () => {
  const fuelUrl = process.env.NEXT_PUBLIC_FUEL_AFFILIATE_URL || "#";

  return (
    <a
      href={fuelUrl}
      target={fuelUrl !== "#" ? "_blank" : "_self"}
      rel="noopener noreferrer sponsored"
      className="block bg-gradient-to-br from-blue-700 to-indigo-800 rounded-2xl p-5 shadow-lg border border-blue-400/30 text-white relative overflow-hidden group transition-all hover:scale-[0.99] active:scale-95"
    >
      <div className="absolute top-0 right-0 -mr-10 -mt-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
      <div className="relative z-10 flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xl">💳</span>
            <h3 className="font-black text-sm tracking-tight">Save on Fuel</h3>
          </div>
          <p className="text-[10px] text-blue-100/80 font-medium">Get cashback with HDFC/ICICI cards</p>
        </div>
        <span className="bg-white/20 px-4 py-2 rounded-xl text-xs font-bold backdrop-blur-sm">
          Apply →
        </span>
      </div>
    </a>
  );
};

/* ─── Fallback Ad Banner (when AdSense not active) ─── */
export const FallbackAdBanner: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <h3 className="font-black text-xs uppercase tracking-widest text-gray-400">🔥 Budget Essentials</h3>
      </div>
      <EssentialsGrid />
    </div>
  );
};
