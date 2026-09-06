import { baseApi } from "@/api/baseApi";
import { LoginPayload, LoginResponse, LogoutPayload, LogoutResponse } from "./types";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginPayload>({
      query: (credentials) => ({
        url: "auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    logout: builder.mutation<LogoutResponse, LogoutPayload>({
      query: (body) => ({
        url: "auth/logout",
        method: "POST",
        body,
      }),
    }),
  }),
  overrideExisting: true,
});

export const { useLoginMutation, useLogoutMutation } = authApi;
