"use client";

import React from "react";
import { LANGUAGES, LangKey } from "@/lib/translations";
import { useTranslation } from "@/hooks/useTranslation";

const LanguageSelector: React.FC = () => {
  const { lang, changeLang } = useTranslation();

  return (
    <div className="flex gap-1.5 overflow-x-auto scrollbar-hide py-1 px-1 -mx-1">
      {LANGUAGES.map((l) => (
        <button
          key={l.key}
          onClick={() => changeLang(l.key)}
          className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all whitespace-nowrap ${
            lang === l.key
              ? "bg-white text-orange-600 shadow-sm"
              : "bg-white/20 text-white/80 hover:bg-white/30"
          }`}
        >
          {l.short}
        </button>
      ))}
    </div>
  );
};

export default LanguageSelector;
