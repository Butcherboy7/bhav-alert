"use client";

import React from "react";

export const FallbackAdBanner: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-blue-700 to-indigo-800 rounded-3xl p-6 shadow-xl border border-blue-500/30 flex items-center justify-between text-white my-6 relative overflow-hidden group">
      {/* Decorative patterns */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-32 h-32 bg-blue-400/20 rounded-full blur-xl"></div>

      <div className="relative z-10 flex flex-col space-y-1">
        <div className="flex items-center space-x-2">
          <span className="text-xl">💰</span>
          <h3 className="font-black text-lg tracking-tight">
            Invest in Digital Gold
          </h3>
        </div>
        <p className="text-xs text-blue-100/90 font-medium">
          Start with ₹1 on PhonePe/Paytm
        </p>
      </div>

      <a
        href="https://phon.pe/gold"
        target="_blank"
        rel="sponsored"
        className="relative z-10 bg-orange-500 text-white font-black px-6 py-3 rounded-2xl shadow-lg transition-all hover:scale-105 active:scale-95 text-xs uppercase tracking-wider flex items-center hover:bg-orange-600"
      >
        Buy Gold →
      </a>
    </div>
  );
};
