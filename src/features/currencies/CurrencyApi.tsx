import { baseApi } from "@/api/baseApi";
import {
  ApiResponse,
  CurrencyItem,
  ExchangeRate,
  ProviderStatus,
  SyncResponse,
} from "./types";

export type { ExchangeRate };

export const currencyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCurrencies: builder.query<CurrencyItem[], void>({
      async queryFn(_arg, _queryApi, _extraOptions, baseQuery) {
        let result = await baseQuery("admin/currencies");
        if (!result.data) {
          result = await baseQuery("currencies");
        }

        if (result.data) {
          const response = result.data as ApiResponse<CurrencyItem[]> | CurrencyItem[];
          const list = Array.isArray(response) ? response : response.data || [];
          return { data: list };
        }

        return {
          data: [
            { code: "USD", name: "US Dollar", symbol: "$", active: true, rate: 1, change: 0, flag: "🇺🇸" },
            { code: "KHR", name: "Cambodian Riel", symbol: "៛", active: true, rate: 4100, change: 0.15, flag: "🇰🇭" },
            { code: "THB", name: "Thai Baht", symbol: "฿", active: true, rate: 35, change: -0.05, flag: "🇹🇭" },
          ],
        };
      },
      providesTags: ["Currency"],
    }),

    // 1. GET /api/v1/admin/currencies/provider-status
    getProviderStatus: builder.query<ApiResponse<ProviderStatus>, void>({
      query: () => "admin/currencies/provider-status",
      providesTags: ["Currency"],
    }),

    // 2. POST /api/v1/admin/currencies/synchronize
    synchronizeCurrencies: builder.mutation<ApiResponse<SyncResponse>, void>({
      query: () => ({
        url: "admin/currencies/synchronize",
        method: "POST",
      }),
      invalidatesTags: ["Currency"],
    }),

    // 3. PATCH /api/v1/admin/currencies/{code}/activate
    activateCurrency: builder.mutation<ApiResponse<CurrencyItem>, string>({
      query: (code) => ({
        url: `admin/currencies/${code}/activate`,
        method: "PATCH",
      }),
      invalidatesTags: ["Currency"],
    }),

    // 4. PATCH /api/v1/admin/currencies/{code}/deactivate
    deactivateCurrency: builder.mutation<ApiResponse<CurrencyItem>, string>({
      query: (code) => ({
        url: `admin/currencies/${code}/deactivate`,
        method: "PATCH",
      }),
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
