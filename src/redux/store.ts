import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "../features/notifications/slice";
import { baseApi } from "../api/baseApi";
import { alertRulesApi } from "../features/alert/api";

const authSlice = {
  name: "auth",
  reducer: (state = { token: "your-jwt-token-goes-here" }, action: any) =>
    state, 
};

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    [alertRulesApi.reducerPath]: alertRulesApi.reducer,
        auth: authSlice.reducer,

    // [categoryApi.reducerPath]: categoryApi.reducer,
    // [currencyApi.reducerPath]: currencyApi.reducer,
    notificationsUI: notificationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      baseApi.middleware,
      alertRulesApi.middleware
      // categoryApi.middleware,
      // currencyApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
