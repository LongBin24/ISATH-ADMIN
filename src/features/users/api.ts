import { baseApi } from "@/api/baseApi";
import { ENDPOINTS } from "@/api/endpoints";
import {
  AdminUser,
  AdminUserPageResponse,
  ApiResponse,
  GetUsersQueryParams,
  User,
  UserOnboardingStatus,
} from "./types";

export function mapAdminUserToUser(u: AdminUser): User {
  const name =
    u.displayName ||
    `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim() ||
    u.username ||
    u.email;

  let status: "active" | "inactive" | "suspended" | "deleted" = "inactive";
  if (u.accountStatus === "ACTIVE") status = "active";
  else if (u.accountStatus === "SUSPENDED") status = "suspended";
  else if (u.accountStatus === "DELETED") status = "deleted";

  return {
    id: u.id,
    name,
    email: u.email,
    role: "user",
    status,
    lastActive: u.updatedAt || u.createdAt,
    avatarUrl: u.profileImageUrl,
    rawUser: u,
  };
}

export function buildUserQueryParams(params?: GetUsersQueryParams): string {
  const queryParams = new URLSearchParams();

  queryParams.set("pageNumber", String(params?.pageNumber ?? 0));
  queryParams.set("pageSize", String(params?.pageSize ?? 20));

  if (params?.query || params?.search) {
    queryParams.set("query", params.query || params.search || "");
  }
  if (params?.accountStatus && params.accountStatus !== "ALL") {
    queryParams.set("accountStatus", params.accountStatus);
  }
  if (params?.emailVerified !== undefined) {
    queryParams.set("emailVerified", String(params.emailVerified));
  }
  if (params?.onboardingCompleted !== undefined) {
    queryParams.set("onboardingCompleted", String(params.onboardingCompleted));
  }
  if (params?.sortBy) {
    queryParams.set("sortBy", params.sortBy);
  }
  if (params?.sortDirection) {
    queryParams.set("sortDirection", params.sortDirection);
  }

  return queryParams.toString();
}

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /api/v1/admin/users
    getAdminUsers: builder.query<ApiResponse<AdminUserPageResponse>, GetUsersQueryParams | void>({
      query: (params) => `${ENDPOINTS.ADMIN_USERS}?${buildUserQueryParams(params || undefined)}`,
      providesTags: ["User"],
    }),

    // Legacy/UI compatible getUsers hook returning User[]
    getUsers: builder.query<User[], GetUsersQueryParams | void>({
      async queryFn(params, _queryApi, _extraOptions, fetchWithBq) {
        const queryString = buildUserQueryParams(params || undefined);
        const url = `${ENDPOINTS.ADMIN_USERS}?${queryString}`;

        const result = await fetchWithBq(url);

        if (result.data) {
          const resData = result.data as {
            data?: { content?: AdminUser[] } | AdminUser[];
            content?: AdminUser[];
          };
          let usersList: AdminUser[] = [];
          if (resData.data && typeof resData.data === "object" && "content" in resData.data && Array.isArray(resData.data.content)) {
            usersList = resData.data.content;
          } else if (resData.content && Array.isArray(resData.content)) {
            usersList = resData.content;
          } else if (Array.isArray(resData.data)) {
            usersList = resData.data;
          }

          if (usersList.length > 0) {
            return { data: usersList.map(mapAdminUserToUser) };
          }
        }

        // Fallback to me or empty if backend unavailable
        const meRes = await fetchWithBq("users/me");
        if (meRes.data) {
          const meData = meRes.data as {
            data?: { profile?: AdminUser };
            profile?: AdminUser;
          };
          const profile = meData?.data?.profile || meData?.profile;
          if (profile) {
            return {
              data: [
                {
                  id: profile.id,
                  name: profile.displayName || `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || profile.username || profile.email,
                  email: profile.email || '',
                  role: 'admin',
                  status: profile.accountStatus === 'ACTIVE' ? 'active' : 'inactive',
                  lastActive: profile.createdAt || new Date().toISOString(),
                },
              ],
            };
          }
        }

        return { data: [] };
      },
      providesTags: ["User"],
    }),

    // GET /api/v1/admin/users/{userId}
    getUserById: builder.query<ApiResponse<AdminUser>, string>({
      query: (userId) => ENDPOINTS.ADMIN_USER_BY_ID(userId),
      providesTags: (_result, _error, id) => [{ type: "User", id }],
    }),

    // GET /api/v1/admin/users/{userId}/onboarding
    getUserOnboarding: builder.query<ApiResponse<UserOnboardingStatus>, string>({
      query: (userId) => ENDPOINTS.ADMIN_USER_ONBOARDING(userId),
    }),

    // POST /api/v1/admin/users/{userId}/suspend
    suspendUser: builder.mutation<ApiResponse<AdminUser>, string>({
      query: (userId) => ({
        url: ENDPOINTS.ADMIN_USER_SUSPEND(userId),
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),

    // POST /api/v1/admin/users/{userId}/reactivate
    reactivateUser: builder.mutation<ApiResponse<AdminUser>, string>({
      query: (userId) => ({
        url: ENDPOINTS.ADMIN_USER_REACTIVATE(userId),
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),

    // Create user placeholder (registration is via Keycloak)
    createUser: builder.mutation<User, Partial<User>>({
      queryFn: () => ({
        error: {
          status: 501,
          data: "User registration is managed via Keycloak.",
        },
      }),
      invalidatesTags: ["User"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAdminUsersQuery,
  useGetUsersQuery,
  useGetUserByIdQuery,
  useGetUserOnboardingQuery,
  useSuspendUserMutation,
  useReactivateUserMutation,
  useCreateUserMutation,
} = usersApi;

// Backwards compatibility alias
export const userManagerApi = usersApi;
