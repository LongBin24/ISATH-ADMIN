// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import { API_TAGS } from "./tags";

// export const baseApi = createApi({
//   reducerPath: "baseApi",
//   baseQuery: fetchBaseQuery({
//     baseUrl: process.env.NEXT_PUBLIC_API_URL || "/api/v1",

//     prepareHeaders: (headers) => {
// <<<<<<< HEAD
//       let token: string | undefined;

//       // 1. Try reading token from cookies
//       if (typeof document !== "undefined") {
//         const cookieRow = document.cookie
//           .split("; ")
//           .find((row) =>
//             row.startsWith("better-auth.session_token=") ||
//             row.startsWith("token=") ||
//             row.startsWith("access_token=") ||
//             row.startsWith("auth_token=")
//           );
//         if (cookieRow) {
//           token = cookieRow.split("=")[1];
//         }
//       }

//       // 2. Try reading token from localStorage if not found in cookies
//       if (!token && typeof window !== "undefined") {
//         token =
//           localStorage.getItem("token") ||
//           localStorage.getItem("access_token") ||
//           localStorage.getItem("auth_token") ||
//           localStorage.getItem("better-auth.session_token") ||
//           undefined;
//       }

//       // 3. Fallback dev token from environment variable if configured
//       if (!token && process.env.NEXT_PUBLIC_DEV_BEARER_TOKEN) {
//         token = process.env.NEXT_PUBLIC_DEV_BEARER_TOKEN;
//       }
// =======
//       const token =
//         typeof window === "undefined"
//           ? null
//           : window.localStorage.getItem("accessToken") ||
//             window.localStorage.getItem("token") ||
//             window.sessionStorage.getItem("accessToken") ||
//             window.sessionStorage.getItem("token") ||
//             document.cookie.match(/(?:^|; )accessToken=([^;]+)/)?.[1];
// >>>>>>> feature/admin-api-integration

//       if (token) {
//         headers.set("authorization", `Bearer ${token}`);
//       }

//       return headers;
//     },
//   }),
//   tagTypes: Object.values(API_TAGS),
//   endpoints: () => ({}),
// });
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_TAGS } from "./tags";
import { authClient } from "../lib/auth/auth-client"; // ១. ត្រូវ Import authClient មកប្រើ

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,

    // ២. ប្រើ async prepareHeaders ដើម្បីទាញ Token ពី Better Auth ផ្ទាល់
    prepareHeaders: async (headers) => {
      try {
        const session = await authClient.getSession();
        const token = session?.data?.session?.token;

        if (token) {
          headers.set("authorization", `Bearer ${token}`);
        }
      } catch (error) {
        console.error("RTK Query auth error:", error);
      }
      return headers;
    },
  }),
  tagTypes: Object.values(API_TAGS),
  endpoints: () => ({}),
});