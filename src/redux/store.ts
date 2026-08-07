import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "../features/notifications/slice";
import { baseApi } from "../api/baseApi";
import { categoryApi } from "@/features/categories/api/categoryApi";

// រាល់ api ទាំងអស់ (adminApi, userManagerApi, categoryApi) 
// ត្រូវបាន inject เข้า baseApi រួចហើយ ដូច្នេះមិនចាំបាច់ import មកដាក់ទីនេះទេ។

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    notificationsUI: notificationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      baseApi.middleware,
      categoryApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;