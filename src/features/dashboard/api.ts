import { baseApi } from "@/api/baseApi";
import {
  User,
  DashboardStats,
  UserSummary,
  ProcessSummary,
  InActiveSummary,
} from "./type";

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStats: builder.query<DashboardStats, void>({
      query: () => "admin/stats",
    }),
    getUsers: builder.query<User[], void>({
      query: () => "users",
      providesTags: ["User"],
    }),
    createUser: builder.mutation<User, Partial<User>>({
      query: (body) => ({ url: "users", method: "POST", body }),
      invalidatesTags: ["User"],
    }),
    getUserSummary: builder.query<UserSummary, void>({
      query: () => "admin/user/summary",
      providesTags: ["User"],
    }),
    getProcessSummary: builder.query<ProcessSummary, void>({
      query: () => "admin/process/summary",
      providesTags: ["Process"],
    }),
    getInActiveSummary: builder.query<InActiveSummary, void>({
      query: () => "admin/process/summary",
      providesTags: ["InActive"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetStatsQuery,
  useGetUsersQuery,
  useCreateUserMutation,
  useGetUserSummaryQuery,
  useGetProcessSummaryQuery,
  useGetInActiveSummaryQuery,
} = adminApi;
