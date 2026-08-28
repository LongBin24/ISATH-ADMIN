"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { type AdminLocale, translateAdmin } from "./admin-dictionary";

export type AdminI18nValue = {
  locale: AdminLocale;
  mounted: boolean;
  setLocale: (locale: AdminLocale) => void;
  t: (text: string) => string;
};

const DEFAULT_I18N_VALUE: AdminI18nValue = {
  locale: "en",
  mounted: false,
  setLocale: () => {},
  t: (text: string) => text,
};

const AdminI18nContext = createContext<AdminI18nValue>(DEFAULT_I18N_VALUE);

export function AdminI18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<AdminLocale>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      const stored = window.localStorage.getItem("locale");
      const next: AdminLocale =
        stored === "km" || stored === "en"
          ? stored
          : window.navigator.language.toLowerCase().startsWith("km")
          ? "km"
          : "en";
      setLocaleState(next);
      document.documentElement.lang = next;
      setMounted(true);
    });
    return () => {
      active = false;
    };
  }, []);

  const setLocale = useCallback((next: AdminLocale) => {
    setLocaleState(next);
    window.localStorage.setItem("locale", next);
    document.documentElement.lang = next;
  }, []);

  const value = useMemo(
    () => ({
      locale,
      mounted,
      setLocale,
      t: (text: string) => translateAdmin(locale, text),
    }),
    [locale, mounted, setLocale]
  );

  return <AdminI18nContext.Provider value={value}>{children}</AdminI18nContext.Provider>;
}

export function useAdminI18n(): AdminI18nValue {
  return useContext(AdminI18nContext);
}

export function useOptionalAdminI18n(): AdminI18nValue {
  return useContext(AdminI18nContext);
}
