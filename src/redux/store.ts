import { configureStore } from "@reduxjs/toolkit";
import { adminApi } from "../features/dashboard/api";
import { userManagerApi } from "../features/user-manager/api";
import { currencyApi } from "@/features/currencies/CurrencyApi";

export const store = configureStore({
  reducer: {
    [adminApi.reducerPath]: adminApi.reducer,
    [userManagerApi.reducerPath]: userManagerApi.reducer,
    [currencyApi.reducerPath]: currencyApi.reducer, 
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(adminApi.middleware, userManagerApi.middleware,currencyApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
