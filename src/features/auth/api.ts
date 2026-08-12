import { baseApi } from "@/api/baseApi";
import { LoginPayload, LoginResponse } from "./types";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginPayload>({
      query: (credentials) => ({
        url: "auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
  overrideExisting: true,
});

export const { useLoginMutation } = authApi;
