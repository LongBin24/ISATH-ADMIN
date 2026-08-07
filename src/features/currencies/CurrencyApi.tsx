import { createApi , fetchBaseQuery} from '@reduxjs/toolkit/query/react';

export interface ExchangeRate{
    code:string;
    name:string;
    rate:number;
    change:number;
    flag:string;
}

const MOCK_EXCHANGE_ATES: ExchangeRate[] = [
  { code: 'USD', name: 'US Dollar', rate: 1, change: 0.0, flag: '🇺🇸' },
  { code: 'KHR', name: 'Cambodian Riel', rate: 4095, change: 0.15, flag: '🇰🇭' },
];

export const currencyApi = createApi({
    reducerPath:'currencyApi',
    baseQuery:fetchBaseQuery(),  //({ baseUrl:'/api/v1'}),
    tagTypes:['ExchangeRates'],
    endpoints:(builder) => ({
        getExchangRates: builder.query<ExchangeRate[],void>({


            // query: () =>'/exchange-rates',
            queryFn: async () => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return { data: MOCK_EXCHANGE_ATES };
      },

            providesTags:['ExchangeRates'],
        }),
    }),
});

export const { useGetExchangRatesQuery, useLazyGetExchangRatesQuery} = currencyApi;