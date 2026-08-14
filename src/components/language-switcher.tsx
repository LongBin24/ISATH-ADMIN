"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Globe, Check, ChevronDown } from "lucide-react";

export interface LanguageOption {
  code: "kh" | "en";
  name: string;
  nativeName: string;
  flag: string;
}

const languages: LanguageOption[] = [
  {
    code: "kh",
    name: "Khmer",
    nativeName: "ខ្មែរ",
    flag: "🇰🇭",
  },
  {
    code: "en",
    name: "English",
    nativeName: "English",
    flag: "🇺🇸",
  },
];

interface LanguageSwitcherProps {
  variant?: "dropdown" | "compact" | "pill";
  className?: string;
}

export default function LanguageSwitcher({
  variant = "dropdown",
  className = "",
}: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Determine current locale from pathname
  const currentLocale = pathname?.startsWith("/en") ? "en" : "kh";
  const activeLanguage =
    languages.find((lang) => lang.code === currentLocale) || languages[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageChange = (newLocale: "kh" | "en") => {
    setIsOpen(false);
    if (newLocale === currentLocale) return;

    // Set cookie for persistence
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    localStorage.setItem("preferred_locale", newLocale);

    if (!pathname) {
      router.push(`/${newLocale}/dashboard`);
      return;
    }

    // Replace locale prefix in current path or prepend
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

  if (variant === "compact") {
    return (
      <div
        className={`flex items-center rounded-xl bg-slate-100 p-1 dark:bg-slate-800 ${className}`}
      >
        {languages.map((lang) => (
          <button
            key={lang.code}
            type="button"
            onClick={() => handleLanguageChange(lang.code)}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
              activeLanguage.code === lang.code
                ? "bg-white text-[#003377] shadow-xs dark:bg-slate-700 dark:text-[#FFC83D]"
                : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            <span>{lang.flag}</span>
            <span>{lang.code.toUpperCase()}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div
      className={`relative inline-block text-left ${className}`}
      ref={dropdownRef}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between min-w-[120px] h-10 gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-xs transition hover:border-[#FFC83D] hover:text-[#003377] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-[#FFC83D] font-google-sans whitespace-nowrap shrink-0"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="flex items-center gap-2">
          <span className="text-base leading-none">{activeLanguage.flag}</span>
          <span className="hidden sm:inline font-semibold">
            {activeLanguage.nativeName}
          </span>
          <span className="sm:hidden font-semibold">
            {activeLanguage.code.toUpperCase()}
          </span>
        </div>
        <ChevronDown
          size={14}
          className={`text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 origin-top-right rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl ring-1 ring-black/5 backdrop-blur-lg focus:outline-none dark:border-slate-800 dark:bg-slate-900 z-50 animate-in fade-in zoom-in-95 duration-150 font-google-sans">
          {/* <div className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          </div> */}
          {languages.map((lang) => {
            const isSelected = activeLanguage.code === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleLanguageChange(lang.code)}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition ${
                  isSelected
                    ? "bg-[#FFC83D]/15 font-bold text-[#003377] dark:text-[#FFC83D]"
                    : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base">{lang.flag}</span>
                  <div className="text-left">
                    <p className="leading-tight">{lang.nativeName}</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500">
                      {lang.name}
                    </p>
                  </div>
                </div>
                {isSelected && (
                  <Check
                    size={14}
                    className="text-[#003377] dark:text-[#FFC83D]"
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
