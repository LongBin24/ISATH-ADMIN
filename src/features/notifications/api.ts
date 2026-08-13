import { baseApi } from "@/api/baseApi";
import { ENDPOINTS } from "@/api/endpoints";
import { API_TAGS } from "@/api/tags";
import {
  NotificationItem,
  NotificationStats,
  UserNotificationPreferences,
  AdminNotificationItem,
  AdminNotificationPageResponse,
  CreateAdminNotificationPayload,
  AdminAlertRuleItem,
  AdminAlertRulePageResponse,
} from "./types";

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. GET /api/v1/admin/notifications
    getAdminNotifications: builder.query<
      AdminNotificationPageResponse,
      { page?: number; size?: number } | void
    >({
      query: (params) => {
        const pageNumber = params?.page ?? 0;
        const pageSize = params?.size ?? 20;
        return `${ENDPOINTS.NOTIFICATIONS}?pageNumber=${pageNumber}&pageSize=${pageSize}`;
      },
      providesTags: [{ type: API_TAGS.NOTIFICATION as any, id: "LIST" }],
    }),

    // 2. POST /api/v1/admin/notifications
    createAdminNotification: builder.mutation<
      AdminNotificationItem,
      CreateAdminNotificationPayload
    >({
      query: (rawBody) => {
        const typeMap: Record<string, string> = {
          DAILY_EXPENSE: "DAILY_REMINDER",
          SAVINGS_GOAL: "SAVINGS_REMINDER",
          RECURRING_TX: "RECURRING_REMINDER",
        };
        const notificationType =
          typeMap[rawBody.notificationType] ||
          rawBody.notificationType ||
          "DAILY_REMINDER";

        const payload: Record<string, any> = {
          userId: rawBody.userId,
          title: rawBody.title,
          message: rawBody.message,
          notificationType,
        };

        if (rawBody.referenceType)
          payload.referenceType = rawBody.referenceType;
        if (rawBody.referenceId) payload.referenceId = rawBody.referenceId;
        if (rawBody.actionUrl) payload.actionUrl = rawBody.actionUrl;
        if (rawBody.metadata && Object.keys(rawBody.metadata).length > 0) {
          payload.metadata = rawBody.metadata;
        }
        if (rawBody.expiresAt) payload.expiresAt = rawBody.expiresAt;
        if (Array.isArray(rawBody.channels) && rawBody.channels.length > 0) {
          payload.channels = rawBody.channels;
        }

        return {
          url: ENDPOINTS.NOTIFICATIONS,
          method: "POST",
          body: payload,
        };
      },
      invalidatesTags: [{ type: API_TAGS.NOTIFICATION as any, id: "LIST" }],
    }),

    // 3. POST /api/v1/admin/notifications/{notificationId}/deliveries/retry
    retryNotificationDelivery: builder.mutation<
      AdminNotificationItem,
      { notificationId: string; channel?: "IN_APP" | "EMAIL" } | string
    >({
      query: (arg) => {
        const notificationId =
          typeof arg === "string" ? arg : arg.notificationId;
        const channel = typeof arg === "object" ? arg.channel : undefined;
        const body = channel ? { channel } : {};
        return {
          url: `${ENDPOINTS.NOTIFICATIONS}/${notificationId}/deliveries/retry`,
          method: "POST",
          body,
        };
      },
      invalidatesTags: [{ type: API_TAGS.NOTIFICATION as any, id: "LIST" }],
    }),

    // 4. GET /api/v1/admin/notifications/{notificationId}
    getAdminNotificationById: builder.query<AdminNotificationItem, string>({
      query: (notificationId) => `${ENDPOINTS.NOTIFICATIONS}/${notificationId}`,
    }),

    // 5. GET /api/v1/admin/alert-rules
    getAdminAlertRules: builder.query<
      AdminAlertRulePageResponse,
      { page?: number; size?: number } | void
    >({
      query: (params) => {
        const pageNumber = params?.page ?? 0;
        const pageSize = params?.size ?? 20;
        return `admin/alert-rules?pageNumber=${pageNumber}&pageSize=${pageSize}`;
      },
      providesTags: [{ type: API_TAGS.NOTIFICATION as any, id: "RULES" }],
    }),

    // 6. GET /api/v1/admin/alert-rules/{ruleId}
    getAdminAlertRuleById: builder.query<AdminAlertRuleItem, string>({
      query: (ruleId) => `admin/alert-rules/${ruleId}`,
    }),

    // --- Compatible existing hooks for UI components ---
    getNotifications: builder.query<NotificationItem[], void>({
      async queryFn(_arg, _queryApi, _extraOptions, baseQuery) {
        const result = await baseQuery(
          `${ENDPOINTS.NOTIFICATIONS}?pageNumber=0&pageSize=20`,
        );
        const content = (result.data as any)?.content || [];

        const mapped = content.map((item: any) => ({
          ...item,
          isRead: item.read,
          category: item.notificationType || "DAILY_REMINDER",
          titleKh: item.title || "",
          titleEn: item.title || "",
          messageKh: item.message || "",
          messageEn: item.message || "",
          channels: ["IN_APP"],
          priority: "MEDIUM",
        }));
        return { data: mapped };
      },
      providesTags: [{ type: API_TAGS.NOTIFICATION as any, id: "LIST" }],
    }),

    getNotificationStats: builder.query<NotificationStats, void>({
      async queryFn(_arg, _queryApi, _extraOptions, baseQuery) {
        const result = await baseQuery(
          `${ENDPOINTS.NOTIFICATIONS}?pageNumber=0&pageSize=100`,
        );
        const content = (result.data as any)?.content || [];
        const total = content.length;
        const unreadCount = content.filter(
          (item: any) => !item.read && item.read !== true,
        ).length;
        return {
          data: {
            total,
            unreadCount,
            byCategory: {},
            byChannel: {},
          } as any,
        };
      },
      providesTags: [{ type: API_TAGS.NOTIFICATION as any, id: "LIST" }],
    }),

    getNotificationPreferences: builder.query<
      UserNotificationPreferences,
      void
    >({
      async queryFn() {
        return {
          data: { email: "", quietHoursEnabled: false, categories: [] } as any,
        };
      },
    }),

    markAsRead: builder.mutation<any, string>({
      async queryFn(id) {
        return { data: { success: true, id } };
      },
      invalidatesTags: [{ type: API_TAGS.NOTIFICATION as any, id: "LIST" }],
    }),
    markAllAsRead: builder.mutation<any, void>({
      async queryFn() {
        return { data: { success: true } };
      },
      invalidatesTags: [{ type: API_TAGS.NOTIFICATION as any, id: "LIST" }],
    }),
    deleteNotification: builder.mutation<any, string>({
      async queryFn(id) {
        return { data: { success: true, id } };
      },
      invalidatesTags: [{ type: API_TAGS.NOTIFICATION as any, id: "LIST" }],
    }),
    updatePreferences: builder.mutation<any, any>({
      async queryFn() {
        return { data: {} };
      },
    }),
    triggerNotification: builder.mutation<any, any>({
      query: (data) => ({
        url: ENDPOINTS.NOTIFICATIONS,
        method: "POST",
        body: {
          title: data.customTitleKh || data.title || "Notification",
          message: data.customMessageKh || data.message || "",
          notificationType:
            data.category || data.notificationType || "DAILY_REMINDER",
          referenceType: data.referenceType || "BUDGET",
          referenceId: data.referenceId || "",
          actionUrl: data.actionUrl || "",
          metadata: data.metadata || { amount: data.amount },
          expiresAt: data.expiresAt || "",
          channels:
            data.channel === "BOTH"
              ? ["IN_APP", "EMAIL"]
              : [data.channel || "IN_APP"],
        },
      }),
      invalidatesTags: [{ type: API_TAGS.NOTIFICATION as any, id: "LIST" }],
    }),
    resetNotifications: builder.mutation<any, void>({
      async queryFn() {
        return { data: {} };
      },
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAdminNotificationsQuery,
  useCreateAdminNotificationMutation,
  useRetryNotificationDeliveryMutation,
  useGetAdminNotificationByIdQuery,
  useGetAdminAlertRulesQuery,
  useGetAdminAlertRuleByIdQuery,
  useGetNotificationsQuery,
  useGetNotificationStatsQuery,
  useGetNotificationPreferencesQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
  useUpdatePreferencesMutation,
  useTriggerNotificationMutation,
  useResetNotificationsMutation,
} = notificationApi;
