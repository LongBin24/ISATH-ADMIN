// import { createApi , fetchBaseQuery} from '@reduxjs/toolkit/query/react';

// export interface ExchangeRate{
//     code:string;
//     name:string;
//     rate:number;
//     change:number;
//     flag:string;
// }

// const MOCK_EXCHANGE_ATES: ExchangeRate[] = [
//   { code: 'USD', name: 'US Dollar', rate: 1, change: 0.0, flag: '🇺🇸' },
//   { code: 'KHR', name: 'Cambodian Riel', rate: 4095, change: 0.15, flag: '🇰🇭' },
// ];

// export const currencyApi = createApi({
//     reducerPath:'currencyApi',
//     baseQuery:fetchBaseQuery(),  //({ baseUrl:'/api/v1'}),
//     tagTypes:['ExchangeRates'],
//     endpoints:(builder) => ({
//         getExchangRates: builder.query<ExchangeRate[],void>({

//             // query: () =>'/exchange-rates',
//             queryFn: async () => {
//         await new Promise((resolve) => setTimeout(resolve, 500));
//         return { data: MOCK_EXCHANGE_ATES };
//       },

//             providesTags:['ExchangeRates'],
//         }),
//     }),
// });

// export const { useGetExchangRatesQuery, useLazyGetExchangRatesQuery} = currencyApi;

import { baseApi } from "@/api/baseApi";
import {
  CurrencyItem,
  ApiResponse,
  SyncResponse,
  ProviderStatus,
  ExchangeRate,
} from "./types";

const MOCK_CURRENCIES: CurrencyItem[] = [
  {
    code: "USD",
    name: "US Dollar",
    rate: 1,
    change: 0.0,
    flag: "🇺🇸",
    active: true,
    symbol: "$",
  },
  {
    code: "KHR",
    name: "Cambodian Riel",
    rate: 4100,
    change: 0.15,
    flag: "🇰🇭",
    active: true,
    symbol: "៛",
  },
  {
    code: "THB",
    name: "Thai Baht",
    rate: 35,
    change: -0.05,
    flag: "🇹🇭",
    active: true,
    symbol: "฿",
  },
];
export type { ExchangeRate };
export const currencyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCurrencies: builder.query<CurrencyItem[], void>({
      async queryFn(_arg, _queryApi, _extraOptions, baseQuery) {
        const result = await baseQuery("/admin/currencies");

        if (result.data) {
          const realData = (result.data as ApiResponse<CurrencyItem[]>).data;

          return {
            data: realData.map((c) => ({
              ...c,
              rate: c.code === "KHR" ? 4100 : 1,
              change: 0.1,
              flag: c.code === "KHR" ? "🇰🇭" : "🇺🇸",
            })),
          };
        }

        return {
          data: [
            {
              code: "USD",
              name: "US Dollar",
              rate: 1,
              change: 0.0,
              flag: "🇺🇸",
              active: true,
              symbol: "$",
            },
            {
              code: "KHR",
              name: "Cambodian Riel",
              rate: 4100,
              change: 0.15,
              flag: "🇰🇭",
              active: true,
              symbol: "៛",
            },
          ],
        };
        console.log("Using Mock Data for Demo");
        return { data: MOCK_CURRENCIES };
      },
      providesTags: ["Currency"],
    }),

    getProviderStatus: builder.query<ApiResponse<ProviderStatus>, void>({
      query: () => "/admin/currencies/provider-status",
      providesTags: ["Currency"],
    }),

    synchronizeCurrencies: builder.mutation<ApiResponse<SyncResponse>, void>({
      async queryFn() {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return {
          data: {
            success: true,
            message: "ធ្វើសមកាលកម្មជោគជ័យ",
            data: { synchronizationId: "mock-id", status: "COMPLETED" },
          } as any,
        };
      },
      invalidatesTags: [{ type: "Currency" as const, id: "LIST" }],
    }),

    activateCurrency: builder.mutation<ApiResponse<CurrencyItem>, string>({
      query: (code) => ({
        url: `/admin/currencies/${code}/activate`,
        method: "PATCH",
      }),
      invalidatesTags: ["Currency"],
    }),

    deactivateCurrency: builder.mutation<ApiResponse<CurrencyItem>, string>({
      query: (code) => ({
        url: `/admin/currencies/${code}/deactivate`,
        method: "PATCH",
      }),

      invalidatesTags: [{ type: "Currency" as const, id: "LIST" }],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetCurrenciesQuery,
  useSynchronizeCurrenciesMutation,
  useActivateCurrencyMutation,
  useDeactivateCurrencyMutation,
} = currencyApi;
