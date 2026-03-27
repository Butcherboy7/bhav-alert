"use client";

import React, { useState, useEffect } from "react";
import TrendBadge from "@/components/TrendBadge";

interface PriceCardProps {
  emoji: string;
  name: string;
  price: number;
  change: number;
  unit: string;
  trend?: { direction: "up" | "down" | "stable"; percent: number };
}

const PriceCard: React.FC<PriceCardProps> = ({
  emoji,
  name,
  price,
  change,
  unit,
  trend,
}) => {
  const [flash, setFlash] = useState<"up" | "down" | null>(null);

  useEffect(() => {
    if (change > 0) {
      setFlash("up");
    } else if (change < 0) {
      setFlash("down");
    }
    const timer = setTimeout(() => setFlash(null), 600);
    return () => clearTimeout(timer);
  }, [price, change]);

  const formatPrice = (p: number) => {
    if (p === 0) return "--";
    if (p >= 1000) return p.toLocaleString("en-IN");
    return p % 1 === 0 ? p.toFixed(0) : p.toFixed(2);
  };

  const isUp = change > 0;
  const isDown = change < 0;

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-100 min-h-[120px] p-4 flex flex-col items-center justify-center text-center transition-all duration-300 active:scale-95 ${
        flash === "up"
          ? "ring-2 ring-red-300 bg-red-50/50"
          : flash === "down"
          ? "ring-2 ring-green-300 bg-green-50/50"
          : ""
      }`}
    >
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
        className={`mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center ${
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

      {trend && (
        <TrendBadge trend={trend.direction} percentChange={trend.percent} />
      )}
    </div>
  );
};

export default PriceCard;
