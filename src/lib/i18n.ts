import en from "@/messages/en.json";
import kh from "@/messages/kh.json";

export type Locale = "kh" | "en";

export const defaultLocale: Locale = "kh";
export const locales: Locale[] = ["kh", "en"];

const dictionaries = {
  kh,
  en,
};

export function getDictionary(locale: string = defaultLocale) {
  if (locale === "en") return dictionaries.en;
  return dictionaries.kh;
}

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}
