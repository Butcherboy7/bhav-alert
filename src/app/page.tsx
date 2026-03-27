"use client";

import React, { useState, useEffect } from "react";
import { DayPrices, DisplayPrice } from "@/types";
import { fetchPrices, getCityPrices } from "@/lib/prices";
import { generateShareMessage, shareNative } from "@/lib/share";
import { CACHE_KEY, CITY_KEY, CITY_NAME_KEY } from "@/lib/constants";
import CitySelector from "@/components/CitySelector";
import PriceCard from "@/components/PriceCard";
import InstallPrompt from "@/components/InstallPrompt";
import { FallbackAdBanner } from "@/components/AdBanner";

export default function Home() {
  const [prices, setPrices] = useState<DayPrices | null>(null);
  const [city, setCity] = useState("mumbai");
  const [cityName, setCityName] = useState("Mumbai");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Read saved city from localStorage
    const savedCity = localStorage.getItem(CITY_KEY);
    const savedCityName = localStorage.getItem(CITY_NAME_KEY);
    if (savedCity) setCity(savedCity);
    if (savedCityName) setCityName(savedCityName);

    loadPrices();
  }, []);

  const loadPrices = async () => {
    try {
      const data = await fetchPrices();
      if (data) {
        setPrices(data);
      }
    } catch (error) {
      console.error("Failed to load prices", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleCityChange = (key: string, name: string) => {
    setCity(key);
    setCityName(name);
    localStorage.setItem(CITY_KEY, key);
    localStorage.setItem(CITY_NAME_KEY, name);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    localStorage.removeItem(CACHE_KEY);
    loadPrices();
  };

  const handleShare = () => {
    if (prices) {
      const msg = generateShareMessage(prices, cityName);
      shareNative(msg);
    }
  };

  const displayPrices: DisplayPrice[] = prices ? getCityPrices(prices, city) : [];
  const upCount = displayPrices.filter((p) => p.change > 0).length;

  const todayStr = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const updatedTimeStr = prices ? new Date(prices.updatedAt).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  }) : "--:--";

  return (
    <div className="flex-1 flex flex-col pb-24">
      {/* 1. Header (bg-gradient orange) */}
      <header className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 space-y-4 shadow-xl shadow-orange-100 rounded-b-[2rem] z-10 transition-all duration-300">
        <div className="flex justify-between items-center">
          <CitySelector
            selectedCity={city}
            onCityChange={handleCityChange}
          />
          <button
            onClick={handleRefresh}
            className={`bg-white/20 p-2 rounded-full text-white backdrop-blur-sm border border-white/20 shadow-sm ${
              refreshing ? "animate-spin" : ""
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
        <div className="flex justify-between items-end pb-2">
          <div className="text-white space-y-1">
            <h2 className="text-4xl font-black text-white">{todayStr}</h2>
            <p className="text-xs font-bold text-orange-200 uppercase tracking-widest flex items-center">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              Live Price Updates
            </p>
          </div>
          {upCount > 0 && (
            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20">
               <span className="text-white font-black text-xs uppercase tracking-tighter">
                🔴 {upCount} prices up!
              </span>
            </div>
          )}
        </div>
      </header>

      {/* 2. Title Bar */}
      <div className="px-6 py-8 flex flex-col space-y-1">
        <h1 className="text-3xl font-black text-gray-800 tracking-tight leading-tight">
          आज का भाव
        </h1>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center">
          <span className="opacity-50 mr-1">Updated:</span>
          {updatedTimeStr} | Daily tracker India
        </p>
      </div>

      {/* 3. Price Grid */}
      <div className="px-5">
        {!loading && !prices ? (
          <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-[2rem] p-12 flex flex-col items-center justify-center text-center space-y-4">
            <span className="text-4xl">🏜️</span>
            <div className="space-y-1">
              <h3 className="text-gray-800 font-black text-lg">Could not load prices</h3>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Please tap refresh to try again</p>
            </div>
            <button
               onClick={handleRefresh}
               className="bg-orange-500 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-orange-100 active:scale-95 transition-all"
            >
              🔄 Refresh Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="skeleton h-[120px] w-full rounded-2xl shadow-sm opacity-50"
                  />
                ))
              : displayPrices.map((p, i) => (
                  <PriceCard
                    key={i}
                    emoji={p.emoji}
                    name={p.name}
                    price={p.price}
                    change={p.change}
                    unit={p.unit}
                  />
                ))}
          </div>
        )}
      </div>

      {/* 4. FallbackAdBanner */}
      <div className="px-5 mt-4">
        <FallbackAdBanner />
      </div>

      {/* 5. Big WhatsApp share button */}
      <div className="px-5 mt-4">
        <button
          onClick={handleShare}
          className="w-full bg-[#25D366] text-white p-6 rounded-3xl shadow-xl shadow-green-100 flex flex-col items-center justify-center transition-all hover:scale-[0.98] active:scale-95 group overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 -mr-12 -mt-12 bg-white/10 w-32 h-32 rounded-full"></div>
          <div className="flex items-center space-x-3 mb-1">
            <span className="text-2xl">📲</span>
            <span className="text-lg font-black uppercase tracking-tight">WhatsApp pe Share karo</span>
          </div>
          <p className="text-xs font-medium text-white/90">Aaj ka bhav bhejo dosto ko!</p>
        </button>
      </div>

      {/* 6. Side-by-side buttons */}
      <div className="px-5 grid grid-cols-2 gap-4 mt-6">
        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({ title: 'Bhav Alert', text: 'Daily fuel & gold prices tracker India', url: window.location.origin });
            }
          }}
          className="bg-gray-100 text-gray-800 py-5 rounded-2xl font-black text-[12px] uppercase tracking-wider shadow-sm flex items-center justify-center hover:bg-gray-200"
        >
          🔗 Share App Link
        </button>
        <button
          onClick={handleRefresh}
          className="bg-gray-100 text-gray-800 py-5 rounded-2xl font-black text-[12px] uppercase tracking-wider shadow-sm flex items-center justify-center hover:bg-gray-200"
        >
          🔄 Refresh Prices
        </button>
      </div>

      {/* 7. Purple donation card */}
      <div className="px-5 mt-10">
        <div className="bg-gradient-to-br from-purple-800 to-indigo-900 rounded-[2rem] p-8 shadow-2xl flex flex-col items-center space-y-6 text-white border border-white/5">
          <div className="space-y-1 text-center">
            <h3 className="text-xl font-black">❤️ Support Bhav Alert</h3>
            <p className="text-[11px] text-purple-200/80 font-medium uppercase tracking-widest">Aapko app accha laga? Chai pilao ☕</p>
          </div>
          <div className="grid grid-cols-3 gap-3 w-full">
            {[29, 49, 99].map((amt) => (
              <a
                key={amt}
                href={`upi://pay?pa=YOUR_UPI_ID@upi&pn=BhavAlert&am=${amt}&cu=INR`}
                className="bg-white/10 hover:bg-white/20 border border-white/10 py-4 rounded-xl flex flex-col items-center transition-all group active:scale-90"
              >
                <span className="text-[10px] opacity-70 mb-0.5">Pay</span>
                <span className="text-lg font-black">₹{amt}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* 8. Second FallbackAdBanner */}
      <div className="px-5 mt-6">
        <FallbackAdBanner />
      </div>

      {/* 9. Footer */}
      <footer className="mt-12 mb-8 px-10 text-center space-y-4">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Bhav Alert v1.0 | Prices from public sources</p>
        <p className="text-[9px] leading-relaxed text-gray-300 font-medium px-4">
          Disclaimer: Prices are for informational purposes only. Local city variations and dealer margins may apply. Always verify with actual vendors before purchase.
        </p>
      </footer>

      {/* 10. InstallPrompt */}
      <InstallPrompt />
    </div>
  );
}
