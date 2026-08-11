import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_TAGS } from "./tags";
export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({

    baseUrl: process.env.NEXT_PUBLIC_API_URL,

    prepareHeaders: (headers) => {
      const token =
        process.env.NEXT_PUBLIC_ACCESS_TOKEN ??
        document.cookie
          .split("; ")
          .find((row) => row.startsWith("better-auth.session_token="))
          ?.split("=")[1];

      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: Object.values(API_TAGS),
  endpoints: () => ({}),
});
