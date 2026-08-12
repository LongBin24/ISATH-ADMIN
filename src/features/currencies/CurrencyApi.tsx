import { baseApi } from "@/api/baseApi";
import { ENDPOINTS } from "@/api/endpoints";
import {
  ApiResponse,
  CurrencyItem,
  ExchangeRate,
  ProviderStatus,
  SyncResponse,
} from "./types";
import { CURRENCY_METADATA } from "@/app/api/v1/admin/currencies/currencyService";
import {
  getActiveCurrenciesMap,
  setCurrencyActiveInStorage,
} from "./activeCurrencyStorage";

export type { ExchangeRate };

export const currencyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCurrencies: builder.query<CurrencyItem[], void>({
      async queryFn(_arg, _queryApi, _extraOptions, fetchWithBq) {
        const activeMap = getActiveCurrenciesMap();
        let items: CurrencyItem[] = [];

        try {
          const localRes = await fetch("/api/v1/admin/currencies");
          if (localRes.ok) {
            const json = await localRes.json();
            if (json.success && Array.isArray(json.data)) {
              items = json.data;
            }
          }
        } catch {
          // ignore
        }

        if (items.length === 0) {
          const result = await fetchWithBq(ENDPOINTS.ADMIN_CURRENCIES || "admin/currencies");
          if (result.data) {
            const apiRes = result.data as ApiResponse<CurrencyItem[]>;
            if (apiRes && apiRes.success && Array.isArray(apiRes.data)) {
              items = apiRes.data;
            } else if (Array.isArray(result.data)) {
              items = result.data;
            }
          }
        }

        if (items.length === 0) {
          try {
            const openRes = await fetch("https://open.er-api.com/v6/latest/USD");
            if (openRes.ok) {
              const openData = await openRes.json();
              const rates: Record<string, number> = openData.rates || {};
              const priorityCodes = ["USD", "KHR", "THB", "EUR", "JPY", "GBP"];
              items = priorityCodes
                .filter((code) => rates[code] !== undefined)
                .map((code) => {
                  const meta = (CURRENCY_METADATA as any)?.[code] || {
                    name: code,
                    symbol: code,
                    flag: "🌐",
                  };
                  return {
                    code,
                    name: meta.name,
                    symbol: meta.symbol,
                    flag: meta.flag,
                    rate: rates[code],
                    change: 0,
                    active: true,
                    provider: "Open Exchange Rates API",
                  };
                });
            }
          } catch (err) {
            return {
              data: [
                { code: "USD", name: "US Dollar", symbol: "$", active: true, rate: 1, change: 0, flag: "🇺🇸" },
                { code: "KHR", name: "Cambodian Riel", symbol: "៛", active: true, rate: 4100, change: 0.15, flag: "🇰🇭" },
                { code: "THB", name: "Thai Baht", symbol: "฿", active: true, rate: 35, change: -0.05, flag: "🇹🇭" },
              ]
            };
          }
        }

        const mergedItems = items.map((item) => ({
          ...item,
          active: activeMap[item.code] ?? item.active ?? true,
        }));

        return { data: mergedItems };
      },
      providesTags: ["Currency"],
    }),

    getProviderStatus: builder.query<ApiResponse<ProviderStatus>, void>({
      async queryFn(_arg, _queryApi, _extraOptions, fetchWithBq) {
        try {
          const res = await fetch("/api/v1/admin/currencies/provider-status");
          if (res.ok) {
            const data = await res.json();
            return { data };
          }
        } catch {
          // ignore
        }
        const result = await fetchWithBq(ENDPOINTS.ADMIN_CURRENCIES_PROVIDER_STATUS || "admin/currencies/provider-status");
        if (result.error) return { error: result.error };
        return { data: result.data as ApiResponse<ProviderStatus> };
      },
      providesTags: ["Currency"],
    }),

    synchronizeCurrencies: builder.mutation<ApiResponse<SyncResponse>, void>({
      async queryFn(_arg, _queryApi, _extraOptions, fetchWithBq) {
        try {
          const res = await fetch("/api/v1/admin/currencies/synchronize", {
            method: "POST",
          });
          if (res.ok) {
            const data = await res.json();
            return { data };
          }
        } catch {
          // ignore
        }
        const result = await fetchWithBq({
          url: ENDPOINTS.ADMIN_CURRENCIES_SYNCHRONIZE || "admin/currencies/synchronize",
          method: "POST",
        });
        if (result.error) return { error: result.error };
        return { data: result.data as ApiResponse<SyncResponse> };
      },
      invalidatesTags: ["Currency"],
    }),

    activateCurrency: builder.mutation<ApiResponse<CurrencyItem>, string>({
      async queryFn(code, _queryApi, _extraOptions, fetchWithBq) {
        setCurrencyActiveInStorage(code, true);
        try {
          const res = await fetch(`/api/v1/admin/currencies/${code}/activate`, {
            method: "PATCH",
          });
          if (res.ok) {
            const data = await res.json();
            return { data };
          }
        } catch {
          // ignore
        }
        const result = await fetchWithBq({
          url: ENDPOINTS.ADMIN_CURRENCIES_ACTIVATE ? ENDPOINTS.ADMIN_CURRENCIES_ACTIVATE(code) : `admin/currencies/${code}/activate`,
          method: "PATCH",
        });
        if (result.error) return { error: result.error };
        return { data: result.data as ApiResponse<CurrencyItem> };
      },
      invalidatesTags: ["Currency"],
    }),

    deactivateCurrency: builder.mutation<ApiResponse<CurrencyItem>, string>({
      async queryFn(code, _queryApi, _extraOptions, fetchWithBq) {
        setCurrencyActiveInStorage(code, false);
        try {
          const res = await fetch(`/api/v1/admin/currencies/${code}/deactivate`, {
            method: "PATCH",
          });
          if (res.ok) {
            const data = await res.json();
            return { data };
          }
        } catch {
          // ignore
        }
        const result = await fetchWithBq({
          url: ENDPOINTS.ADMIN_CURRENCIES_DEACTIVATE ? ENDPOINTS.ADMIN_CURRENCIES_DEACTIVATE(code) : `admin/currencies/${code}/deactivate`,
          method: "PATCH",
        });
        if (result.error) return { error: result.error };
        return { data: result.data as ApiResponse<CurrencyItem> };
      },
      invalidatesTags: ["Currency"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetCurrenciesQuery,
  useGetProviderStatusQuery,
  useSynchronizeCurrenciesMutation,
  useActivateCurrencyMutation,
  useDeactivateCurrencyMutation,
} = currencyApi;
