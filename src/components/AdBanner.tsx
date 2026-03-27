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

/* ─── Gold Affiliate Card ─── */
export const GoldAffiliateCard: React.FC = () => {
  const paytmUrl = process.env.NEXT_PUBLIC_PAYTM_AFFILIATE_URL || "https://paytm.com/gold";

  return (
    <a
      href={paytmUrl}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="block bg-gradient-to-br from-amber-600 to-yellow-700 rounded-2xl p-5 shadow-lg border border-amber-400/30 text-white relative overflow-hidden group transition-all hover:scale-[0.99] active:scale-95"
    >
      <div className="absolute top-0 right-0 -mr-10 -mt-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
      <div className="relative z-10 flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xl">💰</span>
            <h3 className="font-black text-sm tracking-tight">Buy Digital Gold</h3>
          </div>
          <p className="text-[10px] text-amber-100/80 font-medium">Start with ₹1 on Paytm</p>
        </div>
        <span className="bg-white/20 px-4 py-2 rounded-xl text-xs font-bold backdrop-blur-sm">
          Buy →
        </span>
      </div>
    </a>
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
    <div className="space-y-3">
      <GoldAffiliateCard />
      <GroceryAffiliateCard />
    </div>
  );
};
