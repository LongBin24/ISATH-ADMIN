"use client";

import { usePathname, useRouter } from "next/navigation";
import { getDictionary, Locale, defaultLocale } from "@/lib/i18n";
import en from "@/messages/en.json";
import kh from "@/messages/kh.json";

export type Messages = typeof en;

export function useI18n() {
  const router = useRouter();
  const pathname = usePathname() || "";

  const segments = pathname.split("/").filter(Boolean);
  const locale: Locale = segments[0] === "en" ? "en" : "kh";
  const dict = (locale === "en" ? en : kh) as Messages;

  const changeLocale = (newLocale: Locale) => {
    if (newLocale === locale) return;

    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    if (typeof window !== "undefined") {
      localStorage.setItem("preferred_locale", newLocale);
    }

    if (!pathname) {
      router.push(`/${newLocale}/dashboard`);
      return;
    }

    let newPath = pathname;
    if (pathname.startsWith("/kh")) {
      newPath = pathname.replace(/^\/kh/, `/${newLocale}`);
    } else if (pathname.startsWith("/en")) {
      newPath = pathname.replace(/^\/en/, `/${newLocale}`);
    } else {
      newPath = `/${newLocale}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
    }

    router.push(newPath);
  };

  return {
    locale,
    dict,
    isKhmer: locale === "kh",
    isEnglish: locale === "en",
    changeLocale,
  };
}

export default useI18n;
