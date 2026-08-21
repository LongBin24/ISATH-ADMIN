import { baseApi } from "@/api/baseApi";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
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
    keycloakUserId?: string;
    username: string;
    firstName?: string;
    lastName?: string;
    displayName?: string;
    email?: string;
    emailVerified?: boolean;
    phoneNumber?: string;
    profileImageUrl?: string;
    dateOfBirth?: string;
    gender?: "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY";
    occupation?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    stateProvince?: string;
    postalCode?: string;
    countryCode?: string;
    profileCompleted?: boolean;
    onboardingCompleted?: boolean;
    accountStatus?: "ACTIVE" | "SUSPENDED" | "DELETED";
    termsAcceptedAt?: string;
    privacyPolicyAcceptedAt?: string;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string;
  };
  preferences?: {
    preferredCurrencyCode?: string;
    languageCode?: string;
    timezone?: string;
    theme?: string;
    emailNotifications?: boolean;
    inAppNotifications?: boolean;
  };
};

const supportedCurrencies = new Set<CurrencyCode>(["KHR", "USD", "EUR", "THB", "JPY"]);

function toDateOnly(value?: string): string {
  return value?.slice(0, 10) ?? "";
}

function toUserProfile(response: ApiResponse<UserMeResponse>): UserProfile {
  const { profile, preferences } = response.data;
  const preferredCurrency = supportedCurrencies.has(preferences?.preferredCurrencyCode as CurrencyCode)
    ? preferences?.preferredCurrencyCode as CurrencyCode
    : "KHR";

  return {
    id: profile.id,
    keycloakUserId: profile.keycloakUserId ?? "",
    username: profile.username,
    firstName: profile.firstName ?? "",
    lastName: profile.lastName ?? "",
    displayName: profile.displayName ?? profile.username,
    email: profile.email ?? "",
    emailVerified: profile.emailVerified ?? false,
    phoneNumber: profile.phoneNumber ?? "",
    avatar: profile.profileImageUrl ?? "https://api.dicebear.com/7.x/initials/svg?seed=" + encodeURIComponent(profile.username),
    isDefaultAvatar: !profile.profileImageUrl,
    bio: "",
    role: "",
    department: "",
    location: profile.city ?? "",
    joinDate: toDateOnly(profile.createdAt),
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
    dateOfBirth: profile.dateOfBirth ?? "",
    gender: profile.gender ?? "",
    occupation: profile.occupation ?? "",
    addressLine1: profile.addressLine1 ?? "",
    addressLine2: profile.addressLine2 ?? "",
    stateProvince: profile.stateProvince ?? "",
    postalCode: profile.postalCode ?? "",
    countryCode: profile.countryCode ?? "",
    profileCompleted: profile.profileCompleted ?? false,
    onboardingCompleted: profile.onboardingCompleted ?? false,
    termsAcceptedAt: toDateOnly(profile.termsAcceptedAt),
    privacyPolicyAcceptedAt: toDateOnly(profile.privacyPolicyAcceptedAt),
    updatedAt: toDateOnly(profile.updatedAt),
    deletedAt: toDateOnly(profile.deletedAt),
    languageCode: preferences?.languageCode ?? "",
    timezone: preferences?.timezone ?? "",
    theme: preferences?.theme ?? "",
  };
}

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<UserProfile, void>({
      async queryFn(_arg, _queryApi, _extraOptions, baseQuery) {
        const result = await baseQuery("users/me");
        if (result.error) {
          console.error("[profile] GET users/me failed", result.error);
          return { error: result.error };
        }
        try {
          return { data: toUserProfile(result.data as unknown as ApiResponse<UserMeResponse>) };
        } catch (parseError) {
          console.error("[profile] GET users/me returned an unexpected shape", parseError, result.data);
          const error: FetchBaseQueryError = {
            status: "CUSTOM_ERROR",
            error: "Unexpected response shape from /users/me",
          };
          return { error };
        }
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
          occupation: body.occupation,
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
    uploadAvatarFile: builder.mutation<UserProfile, File>({
      query: (file) => {
        const formData = new FormData();
        formData.append("file", file);
        return {
          url: "users/me/avatar",
          method: "PUT",
          body: formData,
        };
      },
      transformResponse: toUserProfile,
      invalidatesTags: ["Profile"],
    }),
    resetAvatar: builder.mutation<UserProfile, void>({
      query: () => ({
        url: "users/me/avatar",
        method: "DELETE",
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
  useUploadAvatarFileMutation,
  useResetAvatarMutation,
  useChangePasswordMutation,
  useUpdateCurrencyMutation,
  useUpdateNotificationsMutation,
} = profileApi;
