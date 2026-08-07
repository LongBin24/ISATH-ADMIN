import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "@/api/baseApi";
import { adminApi } from "../features/dashboard/api";
import { userManagerApi } from "../features/user-manager/api";
import notificationReducer from "../features/notifications/slice";

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [userManagerApi.reducerPath]: userManagerApi.reducer,
    notificationsUI: notificationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      baseApi.middleware,
      adminApi.middleware,
      userManagerApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
