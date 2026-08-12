import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_TAGS } from "./tags";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({

    baseUrl: process.env.NEXT_PUBLIC_API_URL,

    prepareHeaders: (headers) => {
      const token =
        typeof window === "undefined"
          ? null
          : window.localStorage.getItem("accessToken") ||
            window.localStorage.getItem("token") ||
            window.sessionStorage.getItem("accessToken") ||
            window.sessionStorage.getItem("token") ||
            document.cookie.match(/(?:^|; )accessToken=([^;]+)/)?.[1];

      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: Object.values(API_TAGS),
  endpoints: () => ({}),
});
