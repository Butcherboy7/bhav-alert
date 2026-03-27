"use client";

import React, { useState, useEffect, useRef } from "react";
import { DayPrices, DisplayPrice } from "@/types";
import { fetchPrices, getCityPrices } from "@/lib/prices";
import { generateShareMessage, shareNative } from "@/lib/share";
import { CACHE_KEY, CITY_KEY, CITY_NAME_KEY } from "@/lib/constants";
import CitySelector from "@/components/CitySelector";
import PriceCard from "@/components/PriceCard";
import InstallPrompt from "@/components/InstallPrompt";
import { AdSenseUnit, FallbackAdBanner, FuelAffiliateCard } from "@/components/AdBanner";
import PriceAlertModal, { checkAlerts } from "@/components/PriceAlertModal";
import { useTranslation } from "@/hooks/useTranslation";
import LanguageSelector from "@/components/LanguageSelector";
import RazorpayButton from "@/components/RazorpayButton";

export default function Home() {
  const { t } = useTranslation();
  const [prices, setPrices] = useState<DayPrices | null>(null);
  const [city, setCity] = useState("mumbai");
  const [cityName, setCityName] = useState("Mumbai");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [activeAlert, setActiveAlert] = useState<{ title: string; desc: string } | null>(null);
  
  const [isOffline, setIsOffline] = useState(false);
  const [changesToday, setChangesToday] = useState<{ label: string; val: number }[]>([]);
  const [showChanges, setShowChanges] = useState(true);

  // Pull to refresh tracking
  const [startY, setStartY] = useState(0);

  useEffect(() => {
    const savedCity = localStorage.getItem(CITY_KEY) || "mumbai";
    const savedCityName = localStorage.getItem(CITY_NAME_KEY) || "Mumbai";
    setCity(savedCity);
    setCityName(savedCityName);

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    setIsOffline(!navigator.onLine);

    loadPrices(savedCity);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const loadPrices = async (targetCity: string) => {
    try {
      const data = await fetchPrices();
      if (data) {
        setPrices(data);
        const displayData = getCityPrices(data, targetCity);
        
        // Compute "What changed today"
        const changes = displayData.filter(p => p.change !== 0).map(p => ({
          label: p.name,
          val: p.change
        }));
        setChangesToday(changes);

        // Check alerts
        const triggered = checkAlerts(data as any);
        if (triggered.length > 0) {
          const first = triggered[0];
          setActiveAlert({
            title: `🚨 Alert: ${first.commodity} crossed ₹${first.threshold}!`,
            desc: `Current price has gone ${first.direction} your threshold.`,
          });
        }
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
    loadPrices(key);
  };

  const handleRefresh = () => {
    if (refreshing) return;
    setRefreshing(true);
    localStorage.removeItem(CACHE_KEY);
    loadPrices(city);
  };

  const handleShare = () => {
    if (prices) {
      const msg = generateShareMessage(prices, cityName, t);
      shareNative(msg);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      setStartY(e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startY === 0) return;
    const currentY = e.touches[0].clientY;
    if (currentY - startY > 80 && window.scrollY === 0) {
      handleRefresh();
      setStartY(0);
    }
  };

  const handleTouchEnd = () => {
    setStartY(0);
  };

  const displayPrices: DisplayPrice[] = prices ? getCityPrices(prices, city) : [];
  
  // Use trends data
  const tData = (prices as any)?.trends || {};
  const getTrend = (key: string) => tData[key] || { direction: "stable", percent: 0 };

  const updatedDate = prices ? new Date(prices.updatedAt) : new Date();
  const ageHours = (Date.now() - updatedDate.getTime()) / (1000 * 60 * 60);
  
  let dotColor = "bg-green-400";
  if (ageHours > 2 && ageHours <= 6) dotColor = "bg-yellow-400";
  else if (ageHours > 6) dotColor = "bg-red-500";

  const updatedTimeStr = prices ? updatedDate.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  }) : "--:--";

  const showRealAds = !!process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  return (
    <div 
      className="flex-1 flex flex-col pb-24"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Offline Banner */}
      {isOffline && (
        <div className="bg-amber-500 text-white text-xs font-bold text-center py-2 animate-slide-up">
          📡 {t("offline")}
        </div>
      )}

      {/* Alert Banner */}
      {activeAlert && (
        <div className="bg-red-600 text-white p-4 shadow-lg flex justify-between items-center animate-slide-up">
          <div>
            <h4 className="font-bold text-sm tracking-widest uppercase">{activeAlert.title}</h4>
            <p className="text-xs font-medium opacity-90">{activeAlert.desc}</p>
          </div>
          <button onClick={() => setActiveAlert(null)} className="text-xl px-2">×</button>
        </div>
      )}

      {/* Pull to refresh indicator */}
      {refreshing && (
        <div className="flex justify-center py-4 bg-gray-50 text-orange-500 font-bold text-xs items-center space-x-2">
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{t("refreshNow")}...</span>
        </div>
      )}

      {/* Header */}
      <header className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 space-y-4 shadow-xl shadow-orange-100 rounded-b-[2rem] z-10 transition-all duration-300">
        <LanguageSelector />
        
        <div className="flex justify-between items-center mt-2">
          <CitySelector
            selectedCity={city}
            onCityChange={handleCityChange}
          />
          <div className="flex space-x-2">
            <button
              onClick={() => setIsAlertOpen(true)}
              className="bg-white/20 p-2 rounded-full text-white backdrop-blur-sm border border-white/20 shadow-sm"
            >
              🔔
            </button>
            <button
              onClick={handleRefresh}
              className={`bg-white/20 p-2 rounded-full text-white backdrop-blur-sm border border-white/20 shadow-sm ${
                refreshing ? "animate-spin" : ""
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="flex justify-between items-end pb-2">
          <div className="text-white space-y-1">
            <h2 className="text-4xl font-black text-white">{new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</h2>
            <p className="text-xs font-bold text-orange-200 uppercase tracking-widest flex items-center">
              <span className={`w-1.5 h-1.5 rounded-full mr-2 ${dotColor} ${ageHours < 2 ? 'animate-pulse' : ''}`}></span>
              {t("liveUpdates")}
            </p>
          </div>
        </div>
      </header>

      {/* Changes Summary Row */}
      {changesToday.length > 0 && showChanges && (
        <div className="bg-orange-500 text-white text-[10px] font-bold py-2 px-4 flex items-center justify-between">
          <div className="flex space-x-3 overflow-x-auto scrollbar-hide flex-1 whitespace-nowrap mr-2">
            <span className="uppercase tracking-widest opacity-80">Today's Changes:</span>
            {changesToday.map((c, i) => (
              <span key={i} className={c.val > 0 ? "text-red-100" : "text-green-200"}>
                {c.label} {c.val > 0 ? "↑" : "↓"}₹{Math.abs(c.val)}
              </span>
            ))}
          </div>
          <button onClick={() => setShowChanges(false)} className="px-2 font-black text-sm">×</button>
        </div>
      )}

      {/* Title Bar */}
      <div className="px-6 py-6 flex flex-col space-y-1">
        <h1 className="text-3xl font-black text-gray-800 tracking-tight leading-tight">
          {t("todaysBhav")}
        </h1>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center">
          <span className="opacity-50 mr-1">{t("updatedAt")}:</span>
          {updatedTimeStr} | Bhav Alert India
        </p>
      </div>

      {/* Price Grid */}
      <div className="px-5">
        {!loading && !prices ? (
          <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-[2rem] p-12 flex flex-col items-center justify-center text-center space-y-4">
            <span className="text-4xl">🏜️</span>
            <div className="space-y-1">
              <h3 className="text-gray-800 font-black text-lg">{t("couldNotLoad")}</h3>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">{t("tapRefresh")}</p>
            </div>
            <button
               onClick={handleRefresh}
               className="bg-orange-500 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-orange-100 active:scale-95 transition-all"
            >
              🔄 {t("refreshNow")}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="skeleton h-[120px] w-full rounded-xl shadow-sm opacity-50 border border-gray-100"
                  />
                ))
              : displayPrices.map((p, i) => {
                  let trendKey = "stable";
                  // map name to trend key
                  if (p.name.includes("Petrol")) trendKey = "petrol";
                  else if (p.name.includes("Diesel")) trendKey = "diesel";
                  else if (p.name.includes("24K")) trendKey = "gold24k";
                  else if (p.name.includes("22K")) trendKey = "gold22k";
                  else if (p.name.includes("LPG")) trendKey = "lpg";
                  else if (p.name.includes("Onion")) trendKey = "onion";
                  else if (p.name.includes("Rice")) trendKey = "rice";
                  else if (p.name.includes("Milk")) trendKey = "milk";

                  return (
                    <PriceCard
                      key={i}
                      emoji={p.emoji}
                      name={t(trendKey as any) || p.name}
                      price={p.price}
                      change={p.change}
                      unit={p.unit}
                      trend={getTrend(trendKey)}
                    />
                  );
                })}
          </div>
        )}
      </div>

      {/* Ad Placement 1 */}
      <div className="px-5 mt-6">
        {showRealAds ? <AdSenseUnit slot="1234567890" format="auto" /> : <FallbackAdBanner />}
      </div>
      
      {/* Fuel Ad - Extra placement for affiliate */}
      <div className="px-5 mt-4">
        {!showRealAds && <FuelAffiliateCard />}
      </div>

      {/* WhatsApp share button */}
      <div className="px-5 mt-6">
        <button
          onClick={handleShare}
          className="w-full bg-[#25D366] text-white p-6 rounded-3xl shadow-xl shadow-green-100 flex flex-col items-center justify-center transition-all hover:scale-[0.98] active:scale-95 group overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 -mr-12 -mt-12 bg-white/10 w-32 h-32 rounded-full"></div>
          <div className="flex items-center space-x-3 mb-1">
            <span className="text-2xl">📲</span>
            <span className="text-lg font-black uppercase tracking-tight">{t("shareButton")}</span>
          </div>
          <p className="text-[11px] font-medium text-white/90">{t("shareSubtext")}</p>
        </button>
      </div>

      {/* Side-by-side buttons */}
      <div className="px-5 grid grid-cols-2 gap-4 mt-6">
        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({ title: t("appTitle"), text: t("todaysBhav"), url: window.location.origin });
            }
          }}
          className="bg-gray-100 text-gray-800 py-5 rounded-2xl font-black text-[12px] uppercase tracking-wider shadow-sm flex items-center justify-center hover:bg-gray-200"
        >
          🔗 {t("shareAppLink")}
        </button>
        <button
          onClick={handleRefresh}
          className="bg-gray-100 text-gray-800 py-5 rounded-2xl font-black text-[12px] uppercase tracking-wider shadow-sm flex items-center justify-center hover:bg-gray-200"
        >
          🔄 {t("refreshButton")}
        </button>
      </div>

      {/* Razorpay Support Section */}
      <div className="px-5 mt-10">
        <div className="bg-gradient-to-br from-purple-800 to-indigo-900 rounded-[2rem] p-8 shadow-2xl flex flex-col items-center space-y-6 text-white border border-white/5">
          <div className="space-y-1 text-center">
            <h3 className="text-xl font-black">❤️ {t("supportTitle")}</h3>
            <p className="text-[11px] text-purple-200/80 font-medium uppercase tracking-widest">{t("supportSubtext")} ☕</p>
          </div>
          <div className="grid grid-cols-3 gap-3 w-full">
            <RazorpayButton amount={29} emoji="☕" label="Tea" />
            <RazorpayButton amount={49} emoji="🍕" label="Snack" />
            <RazorpayButton amount={99} emoji="🎉" label="Party" />
          </div>
        </div>
      </div>

      {/* Ad Placement 2 */}
      <div className="px-5 mt-6 mb-4">
        {showRealAds && <AdSenseUnit slot="0987654321" format="horizontal" />}
      </div>

      {/* Price Alert Modal */}
      <PriceAlertModal isOpen={isAlertOpen} onClose={() => setIsAlertOpen(false)} />
      <InstallPrompt />
    </div>
  );
}
