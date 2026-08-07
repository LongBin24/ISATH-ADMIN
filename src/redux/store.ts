import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "@/api/baseApi";
import { adminApi } from "../features/dashboard/api";
import { userManagerApi } from "../features/user-manager/api";
import { categoryApi } from "@/features/categories/api/categoryApi";
import notificationReducer from "../features/notifications/slice";

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [userManagerApi.reducerPath]: userManagerApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    notificationsUI: notificationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      adminApi.middleware,
      userManagerApi.middleware,
      categoryApi.middleware,
      baseApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
