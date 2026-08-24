"use client";

import { useEffect, useState } from "react";

export type Locale = "en" | "km";

export function useLocale() {
  const [locale, setLocale] = useState<Locale>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const storedLocale = window.localStorage.getItem("locale");
    const browserPrefersKhmer = window.navigator.language?.toLowerCase().startsWith("km");
    const initialLocale: Locale =
      storedLocale === "en" || storedLocale === "km" ? storedLocale : browserPrefersKhmer ? "km" : "en";

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocale(initialLocale);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    window.localStorage.setItem("locale", locale);
  }, [mounted, locale]);

  return {
    locale,
    mounted,
    setLocale,
    toggleLocale: () => setLocale((current) => (current === "en" ? "km" : "en")),
  };
}