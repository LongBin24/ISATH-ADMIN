import { baseApi } from "@/api/baseApi";
import { ENDPOINTS } from "@/api/endpoints";
import type { ApiResponse, CurrencyItem, ExchangeRate, ProviderStatus, SyncResponse } from "./types";

export type { ExchangeRate };

function unwrapData<T>(response: ApiResponse<T> | T): T {
  return response && typeof response === "object" && "data" in response
    ? (response as ApiResponse<T>).data
    : (response as T);
}

export const currencyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCurrencies: builder.query<CurrencyItem[], void>({
      query: () => ENDPOINTS.ADMIN_CURRENCIES,
      transformResponse: (response: ApiResponse<CurrencyItem[]> | CurrencyItem[]) => unwrapData(response),
      providesTags: ["Currency"],
    }),

    getProviderStatus: builder.query<ProviderStatus, void>({
      query: () => ENDPOINTS.ADMIN_CURRENCIES_PROVIDER_STATUS,
      transformResponse: (response: ApiResponse<ProviderStatus> | ProviderStatus) => unwrapData(response),
      providesTags: ["Currency"],
    }),

    synchronizeCurrencies: builder.mutation<SyncResponse, void>({
      query: () => ({
        url: ENDPOINTS.ADMIN_CURRENCIES_SYNCHRONIZE,
        method: "POST",
      }),
      transformResponse: (response: ApiResponse<SyncResponse> | SyncResponse) => unwrapData(response),
      invalidatesTags: ["Currency"],
    }),

    activateCurrency: builder.mutation<CurrencyItem, string>({
      query: (code) => ({
        url: ENDPOINTS.ADMIN_CURRENCIES_ACTIVATE(code),
        method: "PATCH",
      }),
      transformResponse: (response: ApiResponse<CurrencyItem> | CurrencyItem) => unwrapData(response),
      invalidatesTags: ["Currency"],
    }),

    deactivateCurrency: builder.mutation<CurrencyItem, string>({
      query: (code) => ({
        url: ENDPOINTS.ADMIN_CURRENCIES_DEACTIVATE(code),
        method: "PATCH",
      }),
      transformResponse: (response: ApiResponse<CurrencyItem> | CurrencyItem) => unwrapData(response),
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
