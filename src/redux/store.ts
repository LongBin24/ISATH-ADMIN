import { configureStore } from "@reduxjs/toolkit";
import { adminApi } from "../features/dashboard/api";
import { userManagerApi } from "../features/user-manager/api";
import { categoryApi } from "@/features/categories/api/categoryApi";

export const store = configureStore({
  reducer: {
    [adminApi.reducerPath]: adminApi.reducer,
    [userManagerApi.reducerPath]: userManagerApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(adminApi.middleware, userManagerApi.middleware,categoryApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
