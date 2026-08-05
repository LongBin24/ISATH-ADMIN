import { configureStore } from "@reduxjs/toolkit";
import { adminApi } from "../features/dashboard/api";
import { userManagerApi } from "../features/user-manager/api";

export const store = configureStore({
  reducer: {
    [adminApi.reducerPath]: adminApi.reducer,
    [userManagerApi.reducerPath]: userManagerApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(adminApi.middleware, userManagerApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
