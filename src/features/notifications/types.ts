import { z } from "zod";

export interface PageMetadata {
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export type NotificationCategory =
  | "DAILY_REMINDER"
  | "BUDGET_WARNING"
  | "SAVINGS_REMINDER"
  | "RECURRING_REMINDER"
  | "MONTHLY_SUMMARY"
  | "WALLET_INVITATION"
  | "SYSTEM"
  | "DAILY_EXPENSE"
  | "SAVINGS_GOAL"
  | "RECURRING_TX";

export type NotificationPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type DigestFrequency = "INSTANT" | "DAILY" | "WEEKLY";

export interface NotificationPreferenceCategory {
  category: Extract<
    NotificationCategory,
    | "DAILY_EXPENSE"
    | "BUDGET_WARNING"
    | "SAVINGS_GOAL"
    | "RECURRING_TX"
    | "MONTHLY_SUMMARY"
  >;
  inAppEnabled: boolean;
  emailEnabled: boolean;
  reminderTime?: string;
  thresholdPercent?: number;
}

export interface NotificationItem {
  id: string;
  userId?: string;
  actorUserId?: string;
  title: string;
  titleKh: string;
  titleEn: string;
  message: string;
  messageKh: string;
  messageEn: string;
  notificationType: NotificationCategory;
  category: NotificationCategory;
  channels: string[];
  priority: NotificationPriority;
  read: boolean;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
  metadata?: any;
}

export interface NotificationCategoryConfig {
  id: NotificationCategory;
  nameKh: string;
  nameEn: string;
  descriptionKh: string;
  descriptionEn: string;
  iconName: string;
  defaultPriority: NotificationPriority;
  color: string;
}

export interface NotificationStats {
  total: number;
  unreadCount: number;
  byCategory: Record<string, number>;
  byChannel: Record<string, number>;
}

export interface UserNotificationPreferences {
  email: string;
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
  digestFrequency: DigestFrequency;
  categories: NotificationPreferenceCategory[];
}

export const preferencesSchema = z.object({
  email: z.string().email("សូមបញ្ជូលអ៊ីមែលឱ្យបានត្រឹមត្រូវ"),
  quietHoursEnabled: z.boolean(),
  quietHoursStart: z.string().min(1, "សូមជ្រើសម៉ោងចាប់ផ្តើម"),
  quietHoursEnd: z.string().min(1, "សូមជ្រើសម៉ោងបញ្ចប់"),
  digestFrequency: z.enum(["INSTANT", "DAILY", "WEEKLY"]),
  categories: z.array(
    z.object({
      category: z.enum([
        "DAILY_EXPENSE",
        "BUDGET_WARNING",
        "SAVINGS_GOAL",
        "RECURRING_TX",
        "MONTHLY_SUMMARY",
      ]),
      inAppEnabled: z.boolean(),
      emailEnabled: z.boolean(),
      reminderTime: z.string().optional(),
      thresholdPercent: z.number().optional(),
    }),
  ),
});

export type PreferencesFormData = z.infer<typeof preferencesSchema>;

export const triggerNotificationSchema = z.object({
  category: z.enum([
    "DAILY_EXPENSE",
    "DAILY_REMINDER",
    "BUDGET_WARNING",
    "SAVINGS_GOAL",
    "SAVINGS_REMINDER",
    "RECURRING_TX",
    "RECURRING_REMINDER",
    "MONTHLY_SUMMARY",
  ]),
  channel: z.enum(["IN_APP", "EMAIL", "BOTH"]),
  customTitleKh: z.string().min(1),
  customMessageKh: z.string().min(1),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  amount: z.number().optional(),
  targetName: z.string().optional(),
});

export type TriggerNotificationFormData = z.infer<
  typeof triggerNotificationSchema
>;

// --- OpenAPI Official Spec Models ---

export interface CreateAdminNotificationRequest {
  userId: string;
  title: string;
  message: string;
  notificationType: "DAILY_REMINDER" | "BUDGET_WARNING" | "SAVINGS_REMINDER" | "RECURRING_REMINDER" | "MONTHLY_SUMMARY" | string;
  referenceType?: "BUDGET" | "SAVINGS_GOAL" | "RECURRING_TRANSACTION" | "WALLET" | "WALLET_INVITATION" | "TRANSACTION" | string;
  referenceId?: string;
  actionUrl?: string;
  metadata?: Record<string, any>;
  expiresAt?: string;
  channels?: ("IN_APP" | "EMAIL")[];
}

export interface NotificationResponse {
  id: string;
  userId: string;
  actorUserId?: string;
  alertRuleId?: string;
  title: string;
  message: string;
  notificationType: string;
  referenceType?: string;
  referenceId?: string;
  read: boolean;
  readAt?: string;
  actionUrl?: string;
  metadata?: Record<string, any>;
  expiresAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface PagedModelNotificationResponse {
  content: NotificationResponse[];
  page: PageMetadata;
}

export interface RetryNotificationDeliveriesRequest {
  channel?: "IN_APP" | "EMAIL";
}

export interface NotificationDeliveryResponse {
  id: string;
  notificationId: string;
  channel: "IN_APP" | "EMAIL";
  deliveryStatus: "PENDING" | "SENT" | "DELIVERED" | "FAILED";
  sentAt?: string;
  deliveredAt?: string;
  errorMessage?: string;
}

export interface AlertRuleResponse {
  id: string;
  userId?: string;
  ruleName: string;
  alertType: "DAILY_EXPENSE_REMINDER" | "BUDGET_THRESHOLD" | "SAVINGS_REMINDER" | "RECURRING_REMINDER" | "MONTHLY_SUMMARY" | string;
  triggerType: "TIME" | "THRESHOLD" | "EVENT" | "SCHEDULE" | string;
  referenceType?: "BUDGET" | "SAVINGS_GOAL" | "RECURRING_TRANSACTION" | string;
  referenceId?: string;
  severity: "INFO" | "WARNING" | "CRITICAL" | string;
  enabled: boolean;
  canDisable: boolean;
  reminderTime?: string;
  thresholdPercentage?: number;
  daysBefore?: number;
  frequency?: "DAILY" | "WEEKLY" | "MONTHLY" | "ONCE" | string;
  ruleConfiguration?: Record<string, any>;
  nextTriggerAt?: string;
  lastTriggeredAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface PagedModelAlertRuleResponse {
  content: AlertRuleResponse[];
  page: PageMetadata;
}

// Aliases for compatibility
export type AdminNotificationItem = NotificationResponse;
export type AdminNotificationPageResponse = PagedModelNotificationResponse;
export type CreateAdminNotificationPayload = CreateAdminNotificationRequest;
export type AdminAlertRuleItem = AlertRuleResponse;
export type AdminAlertRulePageResponse = PagedModelAlertRuleResponse;
