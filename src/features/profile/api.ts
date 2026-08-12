import { baseApi } from "@/api/baseApi";
import {
  UserProfile,
  CurrencyCode,
  UpdateProfilePayload,
  ChangePasswordPayload,
  UpdateCurrencyPayload,
  UpdateNotificationsPayload,
  UploadAvatarPayload,
} from "./types";

type ApiResponse<T> = { data: T };

type UserMeResponse = {
  profile: {
    id: string;
    username: string;
    firstName?: string;
    lastName?: string;
    displayName?: string;
    email?: string;
    phoneNumber?: string;
    profileImageUrl?: string;
    city?: string;
    accountStatus?: "ACTIVE" | "SUSPENDED" | "DELETED";
    createdAt?: string;
  };
  preferences?: {
    preferredCurrencyCode?: string;
    emailNotifications?: boolean;
    inAppNotifications?: boolean;
  };
};

const supportedCurrencies = new Set<CurrencyCode>(["KHR", "USD", "EUR", "THB", "JPY"]);

function toUserProfile(response: ApiResponse<UserMeResponse>): UserProfile {
  const { profile, preferences } = response.data;
  const preferredCurrency = supportedCurrencies.has(preferences?.preferredCurrencyCode as CurrencyCode)
    ? preferences?.preferredCurrencyCode as CurrencyCode
    : "KHR";

  return {
    id: profile.id,
    username: profile.username,
    firstName: profile.firstName ?? "",
    lastName: profile.lastName ?? "",
    displayName: profile.displayName ?? profile.username,
    email: profile.email ?? "",
    phoneNumber: profile.phoneNumber ?? "",
    avatar: profile.profileImageUrl ?? "https://api.dicebear.com/7.x/initials/svg?seed=" + encodeURIComponent(profile.username),
    isDefaultAvatar: !profile.profileImageUrl,
    bio: "",
    role: "",
    department: "",
    location: profile.city ?? "",
    joinDate: profile.createdAt ?? "",
    lastActive: "",
    status: profile.accountStatus === "ACTIVE" ? "active" : "inactive",
    preferredCurrency,
    notifications: {
      email: preferences?.emailNotifications ?? false,
      push: preferences?.inAppNotifications ?? false,
      securityAlerts: false,
      productUpdates: false,
      weeklyReport: false,
      sound: false,
    },
  };
}

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<UserProfile, void>({
      async queryFn(_arg, _queryApi, _extraOptions, baseQuery) {
        const result = await baseQuery("users/me");
        if (result.data) {
          try {
            return { data: toUserProfile(result as any) };
          } catch {
            return { data: result.data as UserProfile };
          }
        }
        return {
          data: {
            id: "admin-001",
            username: "admin",
            displayName: "អ្នកគ្រប់គ្រងប្រព័ន្ធ",
            email: "admin@istash.com",
            role: "ADMIN",
            avatar: "https://ui-avatars.com/api/?name=Admin&background=003377&color=fff",
            status: "active",
            notifications: { email: true, push: true }
          } as any
        };
      },
      providesTags: ["Profile"],
    }),
    updateProfile: builder.mutation<UserProfile, UpdateProfilePayload>({
      query: (body) => ({
        url: "users/me",
        method: "PATCH",
        body: {
          firstName: body.firstName,
          lastName: body.lastName,
          displayName: body.displayName,
          phoneNumber: body.phoneNumber,
          city: body.location,
        },
      }),
      transformResponse: toUserProfile,
      invalidatesTags: ["Profile"],
    }),
    uploadAvatar: builder.mutation<UserProfile, UploadAvatarPayload>({
      query: (body) => ({
        url: "users/me",
        method: "PATCH",
        body: {
          profileImageUrl: body.avatarUrl,
        },
      }),
      transformResponse: toUserProfile,
      invalidatesTags: ["Profile"],
    }),
    resetAvatar: builder.mutation<UserProfile, void>({
      query: () => ({
        url: "users/me",
        method: "PATCH",
        body: {
          profileImageUrl: "",
        },
      }),
      transformResponse: toUserProfile,
      invalidatesTags: ["Profile"],
    }),
    changePassword: builder.mutation<{ message: string }, ChangePasswordPayload>({
      query: (body) => ({
        url: "auth/change-password",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Profile"],
    }),
    updateCurrency: builder.mutation<UserProfile, UpdateCurrencyPayload>({
      query: (body) => ({
        url: "users/me/preferences",
        method: "PATCH",
        body: { preferredCurrencyCode: body.currency },
      }),
      invalidatesTags: ["Profile"],
    }),
    updateNotifications: builder.mutation<UserProfile, UpdateNotificationsPayload>({
      query: (body) => ({
        url: "users/me/preferences",
        method: "PATCH",
        body: {
          emailNotifications: body.notifications.email,
          inAppNotifications: body.notifications.push,
        },
      }),
      invalidatesTags: ["Profile"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUploadAvatarMutation,
  useResetAvatarMutation,
  useChangePasswordMutation,
  useUpdateCurrencyMutation,
  useUpdateNotificationsMutation,
} = profileApi;
