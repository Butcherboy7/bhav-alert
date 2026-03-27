"use client";

import { useState, useEffect, useCallback } from "react";
import { translations, LangKey, TranslationStrings } from "@/lib/translations";

const LANG_KEY = "bhav_lang";
const LANG_EVENT = "bhav_lang_change";

export function useTranslation() {
  const [lang, setLang] = useState<LangKey>("en");

  useEffect(() => {
    const saved = localStorage.getItem(LANG_KEY) as LangKey | null;
    if (saved && translations[saved]) {
      setLang(saved);
    }

    const handleLangChange = (e: Event) => {
      const newLang = (e as CustomEvent).detail as LangKey;
      setLang(newLang);
    };

    window.addEventListener(LANG_EVENT, handleLangChange);
    return () => window.removeEventListener(LANG_EVENT, handleLangChange);
  }, []);

  const changeLang = useCallback((newLang: LangKey) => {
    setLang(newLang);
    localStorage.setItem(LANG_KEY, newLang);
    window.dispatchEvent(new CustomEvent(LANG_EVENT, { detail: newLang }));
  }, []);

  const t = useCallback(
    (key: keyof TranslationStrings): string => {
      return translations[lang]?.[key] || translations.en[key] || key;
    },
    [lang]
  );

  return { t, lang, changeLang };
}
