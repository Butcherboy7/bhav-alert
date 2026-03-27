"use client";

import React, { useState, useRef, useEffect } from "react";
import { CITIES } from "@/lib/cities";

interface CitySelectorProps {
  selectedCity: string;
  onCityChange: (key: string, name: string) => void;
}

const CitySelector: React.FC<CitySelectorProps> = ({
  selectedCity,
  onCityChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedCityData = CITIES.find((c) => c.key === selectedCity) || CITIES[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full font-bold text-sm border border-white/30 transition-all hover:bg-white/30 shadow-sm"
      >
        <span>📍 {selectedCityData.name}</span>
        <span className="text-[10px] transform transition-transform duration-200">
          {isOpen ? "▲" : "▼"}
        </span>
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2">
          <div className="p-3 bg-gray-50 border-b border-gray-100">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider px-2">
              Select Your City
            </h3>
          </div>
          <div className="max-h-80 overflow-y-auto overscroll-contain">
            {CITIES.map((city) => (
              <button
                key={city.key}
                onClick={() => {
                  onCityChange(city.key, city.name);
                  setIsOpen(false);
                }}
                className={`w-full flex flex-col items-start px-5 py-3 transition-all ${
                  selectedCity === city.key
                    ? "bg-orange-50 border-l-4 border-orange-500"
                    : "hover:bg-gray-50 border-l-4 border-transparent"
                }`}
              >
                <span
                  className={`text-sm font-bold ${
                    selectedCity === city.key ? "text-orange-600" : "text-gray-800"
                  }`}
                >
                  {city.name}
                </span>
                <span className="text-[10px] text-gray-400 font-medium">
                  {city.state}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CitySelector;
