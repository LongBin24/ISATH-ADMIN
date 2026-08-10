import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "../features/notifications/slice";
import { baseApi } from "../api/baseApi";
import { categoryApi } from "@/features/categories/categoryApi";
import { currencyApi } from "@/features/currencies/CurrencyApi";

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    // [categoryApi.reducerPath]: categoryApi.reducer,
    // [currencyApi.reducerPath]: currencyApi.reducer,
    notificationsUI: notificationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      baseApi.middleware,
      // categoryApi.middleware,
      // currencyApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
