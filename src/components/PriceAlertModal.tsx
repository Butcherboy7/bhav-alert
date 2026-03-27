"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "@/hooks/useTranslation";

interface PriceAlert {
  id: string;
  commodity: string;
  city: string;
  direction: "above" | "below";
  threshold: number;
  triggered: boolean;
}

const ALERTS_KEY = "bhav_alerts";

const COMMODITIES = [
  { key: "petrol", label: "Petrol", needsCity: true },
  { key: "diesel", label: "Diesel", needsCity: true },
  { key: "gold24k", label: "Gold 24K", needsCity: false },
  { key: "gold22k", label: "Gold 22K", needsCity: false },
  { key: "lpg", label: "LPG", needsCity: false },
  { key: "onion", label: "Onion", needsCity: false },
  { key: "rice", label: "Rice", needsCity: false },
  { key: "milk", label: "Milk", needsCity: false },
];

const CITIES = ["mumbai", "delhi", "bangalore", "hyderabad", "chennai", "kolkata", "pune", "ahmedabad", "jaipur", "lucknow"];

export function getAlerts(): PriceAlert[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(ALERTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveAlerts(alerts: PriceAlert[]) {
  localStorage.setItem(ALERTS_KEY, JSON.stringify(alerts));
}

export function checkAlerts(prices: Record<string, unknown>): PriceAlert[] {
  const alerts = getAlerts();
  const triggered: PriceAlert[] = [];

  for (const alert of alerts) {
    if (alert.triggered) continue;

    let currentPrice = 0;
    const p = prices as Record<string, Record<string, Record<string, number>>>;

    if (alert.commodity === "petrol" || alert.commodity === "diesel") {
      currentPrice = p[alert.commodity]?.[alert.city]?.price || 0;
    } else if (alert.commodity === "gold24k") {
      currentPrice = (prices as Record<string, Record<string, number>>).gold?.price_24k || 0;
    } else if (alert.commodity === "gold22k") {
      currentPrice = (prices as Record<string, Record<string, number>>).gold?.price_22k || 0;
    } else {
      currentPrice = (prices as Record<string, Record<string, number>>)[alert.commodity]?.price || 0;
    }

    if (currentPrice === 0) continue;

    const isTriggered =
      (alert.direction === "above" && currentPrice >= alert.threshold) ||
      (alert.direction === "below" && currentPrice <= alert.threshold);

    if (isTriggered) {
      alert.triggered = true;
      triggered.push({ ...alert });
    }
  }

  if (triggered.length > 0) {
    saveAlerts(alerts);
  }

  return triggered;
}

interface PriceAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PriceAlertModal: React.FC<PriceAlertModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [commodity, setCommodity] = useState("petrol");
  const [city, setCity] = useState("mumbai");
  const [direction, setDirection] = useState<"above" | "below">("above");
  const [threshold, setThreshold] = useState("");

  const selectedCommodity = COMMODITIES.find((c) => c.key === commodity);

  const handleSave = () => {
    if (!threshold || isNaN(Number(threshold))) return;

    const alerts = getAlerts();
    const newAlert: PriceAlert = {
      id: Date.now().toString(),
      commodity,
      city: selectedCommodity?.needsCity ? city : "",
      direction,
      threshold: Number(threshold),
      triggered: false,
    };
    alerts.push(newAlert);
    saveAlerts(alerts);
    onClose();
    setThreshold("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white w-full max-w-md rounded-t-3xl p-6 space-y-5 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-black text-lg text-gray-800">{t("alertTitle")}</h3>

        <div className="space-y-3">
          <select
            value={commodity}
            onChange={(e) => setCommodity(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-700 bg-gray-50"
          >
            {COMMODITIES.map((c) => (
              <option key={c.key} value={c.key}>{c.label}</option>
            ))}
          </select>

          {selectedCommodity?.needsCity && (
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-700 bg-gray-50 capitalize"
            >
              {CITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => setDirection("above")}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                direction === "above" ? "bg-red-500 text-white" : "bg-gray-100 text-gray-600"
              }`}
            >
              {t("alertAbove")} ↑
            </button>
            <button
              onClick={() => setDirection("below")}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                direction === "below" ? "bg-green-500 text-white" : "bg-gray-100 text-gray-600"
              }`}
            >
              {t("alertBelow")} ↓
            </button>
          </div>

          <input
            type="number"
            value={threshold}
            onChange={(e) => setThreshold(e.target.value)}
            placeholder="₹ Price threshold"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-700 bg-gray-50"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 text-gray-600 font-black py-4 rounded-xl text-xs uppercase tracking-wider"
          >
            {t("alertCancel")}
          </button>
          <button
            onClick={handleSave}
            className="flex-1 bg-orange-500 text-white font-black py-4 rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-orange-100 active:scale-95 transition-all"
          >
            {t("alertSave")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PriceAlertModal;
