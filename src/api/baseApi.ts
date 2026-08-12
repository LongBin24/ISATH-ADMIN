import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_TAGS } from "./tags";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "/api/v1",

    prepareHeaders: (headers) => {
      let token: string | undefined;

      // 1. Try reading token from cookies
      if (typeof document !== "undefined") {
        const cookieRow = document.cookie
          .split("; ")
          .find((row) =>
            row.startsWith("better-auth.session_token=") ||
            row.startsWith("token=") ||
            row.startsWith("access_token=") ||
            row.startsWith("auth_token=")
          );
        if (cookieRow) {
          token = cookieRow.split("=")[1];
        }
      }

      // 2. Try reading token from localStorage if not found in cookies
      if (!token && typeof window !== "undefined") {
        token =
          localStorage.getItem("token") ||
          localStorage.getItem("access_token") ||
          localStorage.getItem("auth_token") ||
          localStorage.getItem("better-auth.session_token") ||
          undefined;
      }

      // 3. Fallback dev token from environment variable if configured
      if (!token && process.env.NEXT_PUBLIC_DEV_BEARER_TOKEN) {
        token = process.env.NEXT_PUBLIC_DEV_BEARER_TOKEN;
      }

      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: Object.values(API_TAGS),
  endpoints: () => ({}),
});
