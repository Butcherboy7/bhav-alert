"use client";

import React from "react";

interface TrendBadgeProps {
  trend: "up" | "down" | "stable";
  percentChange: number;
}

const TrendBadge: React.FC<TrendBadgeProps> = ({ trend, percentChange }) => {
  if (trend === "stable" && percentChange === 0) {
    return (
      <span className="text-[9px] text-gray-400 font-medium mt-0.5">
        → Stable
      </span>
    );
  }

  if (trend === "up") {
    return (
      <span className="text-[9px] text-red-500 font-bold mt-0.5">
        ↑{percentChange}% this week
      </span>
    );
  }

  return (
    <span className="text-[9px] text-green-500 font-bold mt-0.5">
      ↓{percentChange}% this week
    </span>
  );
};

export default TrendBadge;
