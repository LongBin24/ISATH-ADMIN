const STORAGE_KEY = "isath_active_currencies";

const DEFAULT_ACTIVE_MAP: Record<string, boolean> = {
  USD: true,
  KHR: true,
  THB: true,
  EUR: true,
  JPY: true,
  GBP: true,
};

export function getActiveCurrenciesMap(): Record<string, boolean> {
  if (typeof window === "undefined") return DEFAULT_ACTIVE_MAP;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...DEFAULT_ACTIVE_MAP, ...JSON.parse(stored) };
    }
  } catch {
    // fallback
  }
  return DEFAULT_ACTIVE_MAP;
}

export function setCurrencyActiveInStorage(
  code: string,
  active: boolean
): Record<string, boolean> {
  const current = getActiveCurrenciesMap();
  const updated = { ...current, [code.toUpperCase()]: active };
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }
  return updated;
}
