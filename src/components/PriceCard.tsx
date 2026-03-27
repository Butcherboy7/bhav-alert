"use client";

import React from "react";

interface PriceCardProps {
  emoji: string;
  name: string;
  price: number;
  change: number;
  unit: string;
}

const PriceCard: React.FC<PriceCardProps> = ({
  emoji,
  name,
  price,
  change,
  unit,
}) => {
  const formatPrice = (p: number) => {
    if (p === 0) return "--";
    if (p >= 1000) return p.toLocaleString("en-IN");
    return p % 1 === 0 ? p.toFixed(0) : p.toFixed(2);
  };

  const isUp = change > 0;
  const isDown = change < 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 min-h-[120px] p-4 flex flex-col items-center justify-center text-center transition-transform active:scale-95">
      <span className="text-2xl mb-1">{emoji}</span>
      <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
        {name}
      </span>
      <div className="flex flex-col items-center my-1">
        <span className="text-xl font-bold text-gray-800">
          ₹{formatPrice(price)}
        </span>
        <span className="text-[10px] text-gray-400 font-medium">{unit}</span>
      </div>

      <div
        className={`mt-2 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center ${
          isUp
            ? "bg-red-50 text-red-600"
            : isDown
            ? "bg-green-50 text-green-600"
            : "bg-gray-50 text-gray-500"
        }`}
      >
        {isUp ? (
          <>
            <span className="mr-0.5">↑</span> ₹{change}
          </>
        ) : isDown ? (
          <>
            <span className="mr-0.5">↓</span> ₹{Math.abs(change)}
          </>
        ) : (
          "— No change"
        )}
      </div>
    </div>
  );
};

export default PriceCard;
