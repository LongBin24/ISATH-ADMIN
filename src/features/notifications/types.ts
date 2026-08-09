// import { z } from "zod";

// export type NotificationCategory =
//   | "DAILY_REMINDER"
//   | "BUDGET_WARNING"
//   | "SAVINGS_REMINDER"
//   | "RECURRING_REMINDER"
//   | "MONTHLY_SUMMARY"
//   | "WALLET_INVITATION"
//   | "SYSTEM";

// export type NotificationPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

// export interface NotificationItem {
//   id: string;
//   userId: string;
//   actorUserId?: string;
//   title: string;
//   message: string;
//   notificationType: NotificationCategory;
//   read: boolean;
//   isRead?: boolean;
//   titleKh?: string;
//   messageKh?: string;
//   createdAt: string;
//   actionUrl?: string;
//   metadata?: Record<string, any>;
// }

// export interface NotificationResponse {
//   content: NotificationItem[];
//   totalElements: number;
//   totalPages: number;
//   last: boolean;
//   number: number;
//   size: number;
//   first: boolean;
// }

// export interface NotificationStats {
//   total: number;
//   unreadCount: number;
//   byCategory: Record<string, number>;
//   byChannel: Record<string, number>;
// }

// export interface UserNotificationPreferences {
//   email: string;
//   quietHoursEnabled: boolean;
//   quietHoursStart: string;
//   quietHoursEnd: string;
//   digestFrequency: "DAILY" | "WEEKLY" | "INSTANT";
//   categories: any[];
// }

// export interface NotificationDelivery {
//   id: string;
//   notificationId: string;
//   channel: string;
//   deliveryStatus: string;
//   sentAt: string;
//   deliveredAt: string;
//   errorMessage: string;
// }

// export const preferencesSchema = z.object({
//   email: z.string().email("សូមបញ្ជូលអ៊ីមែលឱ្យបានត្រឹមត្រូវ"),
//   quietHoursEnabled: z.boolean(),
//   quietHoursStart: z.string(),
//   quietHoursEnd: z.string(),
//   digestFrequency: z.enum(["DAILY", "WEEKLY", "INSTANT"]),
//   categories: z.array(z.any()),
// });

// export type PreferencesFormData = z.infer<typeof preferencesSchema>;

// export const triggerNotificationSchema = z.object({
//   category: z.enum([
//     "DAILY_REMINDER",
//     "BUDGET_WARNING",
//     "SAVINGS_REMINDER",
//     "RECURRING_REMINDER",
//     "MONTHLY_SUMMARY",
//   ]),
//   channel: z.enum(["IN_APP", "EMAIL", "BOTH"]),
//   customTitleKh: z.string().min(2, "សូមបញ្ចូលចំណងជើង"),
//   customMessageKh: z.string().min(5, "សូមបញ្ចូលខ្លឹមសារ"),
//   priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
// });

// export type TriggerNotificationFormData = z.infer<typeof triggerNotificationSchema>;

import { z } from "zod";

// រួមបញ្ចូលទាំងឈ្មោះ Category ចាស់ និងថ្មីចូលគ្នា
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
    "DAILY_REMINDER",
    "BUDGET_WARNING",
    "SAVINGS_REMINDER",
    "RECURRING_REMINDER",
    "MONTHLY_SUMMARY",
  ]),
  channel: z.enum(["IN_APP", "EMAIL", "BOTH"]),
  customTitleKh: z.string().min(1),
  customMessageKh: z.string().min(1),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
});

export type TriggerNotificationFormData = z.infer<
  typeof triggerNotificationSchema
>;
