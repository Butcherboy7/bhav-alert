"use client";

import React, { useState, useEffect } from "react";

const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 1. Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      checkVisibility();
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // 2. Check if already in standalone mode
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches;

    const checkVisibility = () => {
      if (isStandalone) return;

      // 3. Check if dismissed within last 3 days
      const lastDismissed = localStorage.getItem("install_dismissed");
      if (lastDismissed) {
        const threeDaysMs = 3 * 24 * 60 * 60 * 1000;
        if (Date.now() - parseInt(lastDismissed) < threeDaysMs) {
          return;
        }
      }

      // 4. Show after 10 second delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 10000);

      return () => clearTimeout(timer);
    };

    checkVisibility();

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleDismiss = () => {
    localStorage.setItem("install_dismissed", Date.now().toString());
    setIsVisible(false);
  };

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setIsVisible(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] px-4 pb-4 md:px-0 md:max-w-md md:mx-auto animate-slide-up">
      <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl shadow-2xl p-5 border border-white/20 text-white flex flex-col space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="font-black text-lg leading-tight">
              📲 Install Bhav Alert
            </h4>
            <p className="text-[11px] text-white/80 font-medium">
              Daily price alerts on home screen! Faster, easier & offline support.
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="text-[11px] font-bold bg-black/10 px-3 py-1.5 rounded-lg hover:bg-black/20"
          >
            Baad mein
          </button>
        </div>
        <button
          onClick={handleInstall}
          className="w-full bg-white text-orange-600 font-black py-4 rounded-xl shadow-lg transition-transform active:scale-95 text-sm uppercase tracking-widest flex items-center justify-center space-x-2"
        >
          <span>Install ✓</span>
          <span className="text-white bg-orange-500 rounded-full w-5 h-5 flex items-center justify-center text-[10px]">
            +
          </span>
        </button>
      </div>
    </div>
  );
};

export default InstallPrompt;
