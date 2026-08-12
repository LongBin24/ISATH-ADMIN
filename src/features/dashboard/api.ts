import { baseApi } from "@/api/baseApi";
import {
  DashboardStats,
  InActiveSummary,
  ProcessSummary,
  User,
  UserSummary,
} from "./type";

type ApiEnvelope<T> = { data: T };
type CurrentUser = {
  profile: {
    id: string;
    username: string;
    firstName?: string;
    lastName?: string;
    displayName?: string;
    email?: string;
    accountStatus?: string;
    createdAt?: string;
  };
};
type TransactionPage = { page?: { totalElements?: number }; content?: unknown[] };

const getData = <T,>(response: unknown): T =>
  (response as ApiEnvelope<T>).data ?? (response as T);

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStats: builder.query<DashboardStats, void>({
      async queryFn(_arg, _queryApi, _extraOptions, baseQuery) {
        const result = await baseQuery("transactions?pageNumber=0&pageSize=1");
        if (result.error) return { error: result.error };

        const transactions = getData<TransactionPage>(result.data);
        return {
          data: {
            // The published API does not expose an administrator user-count endpoint.
            totalUsers: 0,
            totalProcess: transactions.page?.totalElements ?? 0,
            inActiveUsers: 0,
          },
        };
      },
    }),
    getUsers: builder.query<User[], void>({
      async queryFn(_arg, _queryApi, _extraOptions, baseQuery) {
        const result = await baseQuery("users/me");
        if (result.error) return { error: result.error };

        const user = getData<CurrentUser>(result.data).profile;
        return {
          data: [
            {
              id: user.id,
              name:
                user.displayName ??
                `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() ??
                user.username,
              email: user.email ?? "",
              role: "admin",
              status: user.accountStatus === "ACTIVE" ? "active" : "inactive",
              lastActive: user.createdAt ?? "",
              totalExpenses: 0,
            },
          ],
        };
      },
      providesTags: ["User"],
    }),
    createUser: builder.mutation<User, Partial<User>>({
      queryFn: () => ({
        error: {
          status: 501,
          data: "The published API does not provide an administrator user-creation endpoint.",
        },
      }),
    }),
    getUserSummary: builder.query<UserSummary, void>({
      queryFn: () => ({
        data: { totalUsers: 0, totalAdmins: 0, totalActiveUsers: 0, newUsersToday: 0 },
      }),
    }),
    getProcessSummary: builder.query<ProcessSummary, void>({
      async queryFn(_arg, _queryApi, _extraOptions, baseQuery) {
        const result = await baseQuery("transactions?pageNumber=0&pageSize=1");
        if (result.error) return { error: result.error };

        const transactions = getData<TransactionPage>(result.data);
        return {
          data: {
            totalProcesses: transactions.page?.totalElements ?? 0,
            totalCompleted: 0,
            totalIncome: 0,
            totalExpenses: 0,
          },
        };
      },
    }),
    getInActiveSummary: builder.query<InActiveSummary, void>({
      queryFn: () => ({
        data: { totalInActive: 0, moreThan30Days: 0, moreThan90Days: 0, pendingClose: 0 },
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetStatsQuery,
  useGetUsersQuery,
  useCreateUserMutation,
  useGetUserSummaryQuery,
  useGetProcessSummaryQuery,
  useGetInActiveSummaryQuery,
} = adminApi;
