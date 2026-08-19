import { baseApi } from "@/api/baseApi";
import { ENDPOINTS } from "@/api/endpoints";
import {
  AdminCreatedUserResponse,
  AdminUser,
  AdminUserPageResponse,
  ApiResponse,
  CreateAdminUserPayload,
  GetUsersQueryParams,
  User,
  UserOnboardingStatus,
  UserStatistics,
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

// The backend doesn't reliably match the documented response shapes in
// practice: GET /admin/users returns neither the {success, data, ...}
// envelope nor a flat Spring Page — it returns {content, page: {number,
// size, totalElements, totalPages}}, the same PagedModel nesting used by
// notifications/alert-rules/AI-templates, contradicting its own OpenAPI doc.
// These helpers normalize whatever shape actually comes back (enveloped or
// not, flat pagination fields or nested under `page`) into one consistent
// structure so the UI doesn't silently render an empty state.
function unwrapPage(raw: unknown): AdminUserPageResponse {
  const obj = raw as Record<string, unknown> | null | undefined;
  const body = (obj?.data && typeof obj.data === "object" ? obj.data : obj) as Record<string, unknown> | undefined;
  const content = Array.isArray(body?.content) ? (body!.content as AdminUser[]) : [];
  const pageMeta = (body?.page && typeof body.page === "object" ? body.page : body) as
    | Record<string, unknown>
    | undefined;
  const totalElements = typeof pageMeta?.totalElements === "number" ? pageMeta.totalElements : content.length;
  const totalPages =
    typeof pageMeta?.totalPages === "number" ? pageMeta.totalPages : totalElements > 0 ? 1 : 0;
  const size = typeof pageMeta?.size === "number" ? pageMeta.size : content.length;
  const number = typeof pageMeta?.number === "number" ? pageMeta.number : 0;

  return { content, totalElements, totalPages, size, number };
}

function unwrapStatistics(raw: unknown): UserStatistics {
  const obj = raw as { data?: { totalUsers?: unknown }; totalUsers?: unknown } | null | undefined;
  if (obj?.data && typeof obj.data.totalUsers === "number") return obj.data as UserStatistics;
  if (obj && typeof obj.totalUsers === "number") return obj as unknown as UserStatistics;
  return {
    totalUsers: 0,
    gender: { male: 0, female: 0, other: 0, preferNotToSay: 0, unspecified: 0 },
    ageGroups: { under15: 0, age15To24: 0, age25To44: 0, age45To59: 0, age60To74: 0, age75Plus: 0, unknown: 0 },
    generatedAt: "",
  };
}

function unwrapAdminUser(raw: unknown): AdminUser | undefined {
  const obj = raw as { data?: { id?: unknown }; id?: unknown } | null | undefined;
  if (obj?.data && typeof obj.data.id === "string") return obj.data as AdminUser;
  if (obj && typeof obj.id === "string") return obj as unknown as AdminUser;
  return undefined;
}

function unwrapOnboarding(raw: unknown): UserOnboardingStatus | undefined {
  const obj = raw as { data?: { onboardingCompleted?: unknown }; onboardingCompleted?: unknown } | null | undefined;
  if (obj?.data && typeof obj.data.onboardingCompleted === "boolean") return obj.data as UserOnboardingStatus;
  if (obj && typeof obj.onboardingCompleted === "boolean") return obj as unknown as UserOnboardingStatus;
  return undefined;
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
  if (params?.createdFrom) {
    queryParams.set("createdFrom", params.createdFrom);
  }
  if (params?.createdTo) {
    queryParams.set("createdTo", params.createdTo);
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
    getAdminUsers: builder.query<AdminUserPageResponse, GetUsersQueryParams | void>({
      query: (params) => `${ENDPOINTS.ADMIN_USERS}?${buildUserQueryParams(params || undefined)}`,
      transformResponse: unwrapPage,
      providesTags: ["User"],
    }),

    // Legacy/UI compatible getUsers hook returning User[]
    getUsers: builder.query<User[], GetUsersQueryParams | void>({
      async queryFn(params, _queryApi, _extraOptions, fetchWithBq) {
        const queryString = buildUserQueryParams(params || undefined);
        const url = `${ENDPOINTS.ADMIN_USERS}?${queryString}`;

        const result = await fetchWithBq(url);

<<<<<<< HEAD:src/features/user-manager/api.ts
        if (result.error) {
          return { error: result.error };
        }

        if (result.data) {
          const resData = result.data as {
            data?: { content?: AdminUser[] } | AdminUser[];
            content?: AdminUser[];
          };
          let usersList: AdminUser[] = [];
          const nestedData = resData.data;
          if (nestedData && !Array.isArray(nestedData) && Array.isArray(nestedData.content)) {
            usersList = nestedData.content;
          } else if (resData.content && Array.isArray(resData.content)) {
            usersList = resData.content;
          } else if (Array.isArray(nestedData)) {
            usersList = nestedData;
=======
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
>>>>>>> 17cb3ce3e288d4fd37c9f2ea926c41fd3cc16c0f:src/features/users/api.ts
          }

          return { data: usersList.map(mapAdminUserToUser) };
        }

        return { data: [] };
      },
      providesTags: ["User"],
    }),

    // GET /api/v1/admin/users/{userId}
    getUserById: builder.query<AdminUser | undefined, string>({
      query: (userId) => ENDPOINTS.ADMIN_USER_BY_ID(userId),
      transformResponse: unwrapAdminUser,
      providesTags: (_result, _error, id) => [{ type: "User", id }],
    }),

    // GET /api/v1/admin/users/{userId}/onboarding
    getUserOnboarding: builder.query<UserOnboardingStatus | undefined, string>({
      query: (userId) => ENDPOINTS.ADMIN_USER_ONBOARDING(userId),
      transformResponse: unwrapOnboarding,
    }),

    // GET /api/v1/admin/users/statistics
    getUserStatistics: builder.query<UserStatistics, void>({
      query: () => ENDPOINTS.ADMIN_USERS_STATISTICS,
      transformResponse: unwrapStatistics,
      providesTags: ["User"],
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

    // POST /api/v1/admin/users
    createUser: builder.mutation<ApiResponse<AdminCreatedUserResponse>, CreateAdminUserPayload>({
      query: (body) => ({
        url: ENDPOINTS.ADMIN_USERS,
        method: "POST",
        body,
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
  useGetUserStatisticsQuery,
  useSuspendUserMutation,
  useReactivateUserMutation,
  useCreateUserMutation,
} = usersApi;

// Backwards compatibility alias
export const userManagerApi = usersApi;
