import { z } from "zod";

export type NotificationCategory =
  | "DAILY_EXPENSE"
  | "BUDGET_WARNING"
  | "SAVINGS_GOAL"
  | "RECURRING_TX"
  | "MONTHLY_SUMMARY";

export type NotificationChannel = "IN_APP" | "EMAIL";

export type NotificationPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface NotificationItem {
  id: string;
  titleKh: string;
  titleEn: string;
  messageKh: string;
  messageEn: string;
  category: NotificationCategory;
  channels: NotificationChannel[];
  priority: NotificationPriority;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
  metadata?: {
    amount?: number;
    currency?: string;
    budgetCategory?: string;
    budgetLimit?: number;
    budgetUsedPercent?: number;
    savingsGoalName?: string;
    savingsTarget?: number;
    savingsCurrent?: number;
    dueDate?: string;
    periodMonth?: string;
    incomeTotal?: number;
    expenseTotal?: number;
    netSavings?: number;
  };
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

export interface CategoryPreference {
  category: NotificationCategory;
  inAppEnabled: boolean;
  emailEnabled: boolean;
  reminderTime?: string; // e.g., "20:00"
  thresholdPercent?: number; // for budget warnings (e.g. 80%)
}

export interface UserNotificationPreferences {
  email: string;
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
  digestFrequency: "DAILY" | "WEEKLY" | "INSTANT";
  categories: CategoryPreference[];
}

// Zod Schema for updating preferences
export const preferencesSchema = z.object({
  email: z.string().email("សូមបញ្ជូលអ៊ីមែលឱ្យបានត្រឹមត្រូវ (Invalid email format)"),
  quietHoursEnabled: z.boolean(),
  quietHoursStart: z.string(),
  quietHoursEnd: z.string(),
  digestFrequency: z.enum(["DAILY", "WEEKLY", "INSTANT"]),
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
      thresholdPercent: z.number().min(1).max(100).optional(),
    })
  ),
});

export type PreferencesFormData = z.infer<typeof preferencesSchema>;

// Zod Schema for manually triggering / testing a notification
export const triggerNotificationSchema = z.object({
  category: z.enum([
    "DAILY_EXPENSE",
    "BUDGET_WARNING",
    "SAVINGS_GOAL",
    "RECURRING_TX",
    "MONTHLY_SUMMARY",
  ]),
  channel: z.enum(["IN_APP", "EMAIL", "BOTH"]),
  customTitleKh: z.string().min(2, "សូមបញ្ចូលចំណងជើងជាភាសាខ្មែរ"),
  customMessageKh: z.string().min(5, "សូមបញ្ចូលខ្លឹមសារជាភាសាខ្មែរ"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  amount: z.number().optional(),
  targetName: z.string().optional(),
});

export type TriggerNotificationFormData = z.infer<typeof triggerNotificationSchema>;

export interface NotificationStats {
  total: number;
  unreadCount: number;
  byCategory: Record<NotificationCategory, number>;
  byChannel: Record<NotificationChannel, number>;
}
