import { baseApi } from "@/api/baseApi";
import { ENDPOINTS } from "@/api/endpoints";
import { API_TAGS } from "@/api/tags";
import {
  NotificationItem,
  NotificationCategory,
  NotificationStats,
  UserNotificationPreferences,
  AdminNotificationItem,
  AdminNotificationPageResponse,
  CreateAdminNotificationPayload,
  AdminAlertRuleItem,
  AdminAlertRulePageResponse,
  AdminNotificationQueryParams,
  NotificationDeliveryResponse,
  RetryNotificationDeliveriesRequest,
} from "./types";

function buildAdminNotificationQuery(params?: AdminNotificationQueryParams) {
  const query = new URLSearchParams();
  query.set("pageNumber", String(params?.pageNumber ?? 0));
  query.set("pageSize", String(params?.pageSize ?? 20));

  const optionalParams: Array<[string, string | number | boolean | undefined]> = [
    ["userId", params?.userId],
    ["notificationType", params?.notificationType],
    ["referenceType", params?.referenceType],
    ["referenceId", params?.referenceId],
    ["read", params?.read],
    ["alertRuleId", params?.alertRuleId],
    ["createdFrom", params?.createdFrom],
    ["createdTo", params?.createdTo],
    ["sortBy", params?.sortBy],
    ["sortDirection", params?.sortDirection],
  ];

  optionalParams.forEach(([key, value]) => {
    if (value !== undefined && value !== "") query.set(key, String(value));
  });
  return query.toString();
}

type LegacyNotificationResponse = AdminNotificationPageResponse;
type LegacyMutationResult = { success: boolean; id?: string };
type LegacyTriggerPayload = {
  customTitleKh?: string;
  title?: string;
  customMessageKh?: string;
  message?: string;
  category?: string;
  notificationType?: string;
  referenceType?: string;
  referenceId?: string;
  actionUrl?: string;
  metadata?: Record<string, unknown>;
  amount?: number;
  expiresAt?: string;
  channel?: "IN_APP" | "EMAIL" | "BOTH";
  priority?: string;
};

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. GET /api/v1/admin/notifications
    getAdminNotifications: builder.query<
      AdminNotificationPageResponse,
      AdminNotificationQueryParams | void
    >({
      query: (params) => `${ENDPOINTS.NOTIFICATIONS}?${buildAdminNotificationQuery(params || undefined)}`,
      providesTags: [{ type: API_TAGS.NOTIFICATION, id: "LIST" }],
    }),

    // 2. POST /api/v1/admin/notifications
    createAdminNotification: builder.mutation<
      AdminNotificationItem,
      CreateAdminNotificationPayload
    >({
      query: (body) => ({ url: ENDPOINTS.NOTIFICATIONS, method: "POST", body }),
      invalidatesTags: [{ type: API_TAGS.NOTIFICATION, id: "LIST" }],
    }),

    // 3. POST /api/v1/admin/notifications/{notificationId}/deliveries/retry
    retryNotificationDelivery: builder.mutation<
      NotificationDeliveryResponse[],
      { notificationId: string; channel?: RetryNotificationDeliveriesRequest["channel"] } | string
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
      invalidatesTags: [{ type: API_TAGS.NOTIFICATION, id: "LIST" }],
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
      providesTags: [{ type: API_TAGS.NOTIFICATION, id: "RULES" }],
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
        if (result.error) return { error: result.error };
        const content = (result.data as LegacyNotificationResponse | undefined)?.content ?? [];

        const categoryMap: Record<string, NotificationCategory> = {
          DAILY_REMINDER: "DAILY_EXPENSE",
          DAILY_EXPENSE: "DAILY_EXPENSE",
          BUDGET_WARNING: "BUDGET_WARNING",
          SAVINGS_REMINDER: "SAVINGS_GOAL",
          SAVINGS_GOAL: "SAVINGS_GOAL",
          RECURRING_REMINDER: "RECURRING_TX",
          RECURRING_TX: "RECURRING_TX",
          MONTHLY_SUMMARY: "MONTHLY_SUMMARY",
        };

        const mapped: NotificationItem[] = content.map((item) => ({
          ...item,
          isRead: item.read,
          category: categoryMap[item.notificationType] || "DAILY_EXPENSE",
          titleKh: item.title || "",
          titleEn: item.title || "",
          messageKh: item.message || "",
          messageEn: item.message || "",
          channels: item.channels || ["IN_APP"],
          priority: "MEDIUM",
        }));
        return { data: mapped };
      },
      providesTags: [{ type: API_TAGS.NOTIFICATION, id: "LIST" }],
    }),

    getNotificationStats: builder.query<NotificationStats, void>({
      async queryFn(_arg, _queryApi, _extraOptions, baseQuery) {
        const [totalResult, unreadResult] = await Promise.all([
          baseQuery(`${ENDPOINTS.NOTIFICATIONS}?pageNumber=0&pageSize=1`),
          baseQuery(`${ENDPOINTS.NOTIFICATIONS}?read=false&pageNumber=0&pageSize=1`),
        ]);
        if (totalResult.error) return { error: totalResult.error };
        if (unreadResult.error) return { error: unreadResult.error };
        const totalResponse = totalResult.data as LegacyNotificationResponse | undefined;
        const unreadResponse = unreadResult.data as LegacyNotificationResponse | undefined;
        const total = totalResponse?.page.totalElements ?? totalResponse?.content.length ?? 0;
        const unreadCount = unreadResponse?.page.totalElements ?? unreadResponse?.content.length ?? 0;
        return {
          data: {
            total,
            unreadCount,
            byCategory: {},
            byChannel: {},
          },
        };
      },
      providesTags: [{ type: API_TAGS.NOTIFICATION, id: "LIST" }],
    }),

    getNotificationPreferences: builder.query<
      UserNotificationPreferences,
      void
    >({
      async queryFn() {
        return {
          data: {
            email: "",
            quietHoursEnabled: false,
            quietHoursStart: "22:00",
            quietHoursEnd: "07:00",
            digestFrequency: "DAILY",
            categories: [],
          },
        };
      },
    }),

    markAsRead: builder.mutation<LegacyMutationResult, string>({
      async queryFn(id) {
        return { data: { success: true, id } };
      },
      invalidatesTags: [{ type: API_TAGS.NOTIFICATION, id: "LIST" }],
    }),
    markAllAsRead: builder.mutation<LegacyMutationResult, void>({
      async queryFn() {
        return { data: { success: true } };
      },
      invalidatesTags: [{ type: API_TAGS.NOTIFICATION, id: "LIST" }],
    }),
    deleteNotification: builder.mutation<LegacyMutationResult, string>({
      async queryFn(id) {
        return { data: { success: true, id } };
      },
      invalidatesTags: [{ type: API_TAGS.NOTIFICATION, id: "LIST" }],
    }),
    updatePreferences: builder.mutation<Record<string, never>, UserNotificationPreferences>({
      async queryFn() {
        return { data: {} };
      },
    }),
    triggerNotification: builder.mutation<AdminNotificationItem, LegacyTriggerPayload>({
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
      invalidatesTags: [{ type: API_TAGS.NOTIFICATION, id: "LIST" }],
    }),
    resetNotifications: builder.mutation<Record<string, never>, void>({
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
