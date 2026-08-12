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
    getAdminNotifications: builder.query<AdminNotificationPageResponse, { page?: number; size?: number } | void>({
      query: (params) => {
        const pageNumber = params?.page ?? 0;
        const pageSize = params?.size ?? 20;
        return `${ENDPOINTS.NOTIFICATIONS}?pageNumber=${pageNumber}&pageSize=${pageSize}`;
      },
      providesTags: [{ type: API_TAGS.NOTIFICATION as any, id: "LIST" }],
    }),

    // 2. POST /api/v1/admin/notifications
    createAdminNotification: builder.mutation<AdminNotificationItem, CreateAdminNotificationPayload>({
      query: (body) => ({
        url: ENDPOINTS.NOTIFICATIONS,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: API_TAGS.NOTIFICATION as any, id: "LIST" }],
    }),

    // 3. POST /api/v1/admin/notifications/{notificationId}/deliveries/retry
    retryNotificationDelivery: builder.mutation<any, string>({
      query: (notificationId) => ({
        url: `${ENDPOINTS.NOTIFICATIONS}/${notificationId}/deliveries/retry`,
        method: "POST",
      }),
      invalidatesTags: [{ type: API_TAGS.NOTIFICATION as any, id: "LIST" }],
    }),

    // 4. GET /api/v1/admin/notifications/{notificationId}
    getAdminNotificationById: builder.query<AdminNotificationItem, string>({
      query: (notificationId) => `${ENDPOINTS.NOTIFICATIONS}/${notificationId}`,
    }),

    // 5. GET /api/v1/admin/alert-rules
    getAdminAlertRules: builder.query<AdminAlertRulePageResponse, { page?: number; size?: number } | void>({
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
        const result = await baseQuery(`${ENDPOINTS.NOTIFICATIONS}?pageNumber=0&pageSize=20`);
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
          priority: "MEDIUM"
        }));
        return { data: mapped };
      },
      providesTags: [{ type: API_TAGS.NOTIFICATION as any, id: "LIST" }],
    }),

    getNotificationStats: builder.query<NotificationStats, void>({
      async queryFn() { return { data: { total: 0, unreadCount: 0, byCategory: {}, byChannel: {} } as any }; }
    }),

    getNotificationPreferences: builder.query<UserNotificationPreferences, void>({
      async queryFn() { return { data: { email: "", quietHoursEnabled: false, categories: [] } as any }; }
    }),

    markAsRead: builder.mutation<any, string>({
      query: (id) => ({ url: `${ENDPOINTS.NOTIFICATIONS}/${id}`, method: "PATCH" }),
      invalidatesTags: [{ type: API_TAGS.NOTIFICATION as any, id: "LIST" }],
    }),
    markAllAsRead: builder.mutation<any, void>({
      query: () => ({ url: `${ENDPOINTS.NOTIFICATIONS}/mark-all-read`, method: "PUT" }),
      invalidatesTags: [{ type: API_TAGS.NOTIFICATION as any, id: "LIST" }],
    }),
    deleteNotification: builder.mutation<any, string>({
      query: (id) => ({ url: `${ENDPOINTS.NOTIFICATIONS}/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: API_TAGS.NOTIFICATION as any, id: "LIST" }],
    }),
    updatePreferences: builder.mutation<any, any>({
      async queryFn() { return { data: {} }; }
    }),
    triggerNotification: builder.mutation<any, any>({
      query: (data) => ({
        url: ENDPOINTS.NOTIFICATIONS,
        method: "POST",
        body: {
          title: data.customTitleKh || data.title || "Notification",
          message: data.customMessageKh || data.message || "",
          notificationType: data.category || data.notificationType || "DAILY_REMINDER",
          referenceType: data.referenceType || "BUDGET",
          referenceId: data.referenceId || "",
          actionUrl: data.actionUrl || "",
          metadata: data.metadata || { amount: data.amount },
          expiresAt: data.expiresAt || "",
          channels: data.channel === "BOTH" ? ["IN_APP", "EMAIL"] : [data.channel || "IN_APP"],
        },
      }),
      invalidatesTags: [{ type: API_TAGS.NOTIFICATION as any, id: "LIST" }],
    }),
    resetNotifications: builder.mutation<any, void>({
      async queryFn() { return { data: {} }; }
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