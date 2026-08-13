export const ALERT_TYPES = [
  "DAILY_EXPENSE_REMINDER",
  "BUDGET_THRESHOLD",
  "SAVINGS_REMINDER",
  "RECURRING_REMINDER",
  "MONTHLY_SUMMARY",
] as const;
export type AlertType = (typeof ALERT_TYPES)[number];

export const TRIGGER_TYPES = ["TIME", "THRESHOLD", "EVENT", "SCHEDULE"] as const;
export type TriggerType = (typeof TRIGGER_TYPES)[number];

export const REFERENCE_TYPES = [
  "RECURRING_TRANSACTION",
  "BUDGET",
  "SAVINGS_GOAL",
] as const;
export type ReferenceType = (typeof REFERENCE_TYPES)[number];

export const SEVERITIES = ["INFO", "WARNING", "CRITICAL"] as const;
export type Severity = (typeof SEVERITIES)[number];

export interface RuleConfiguration {
  message?: string;
  defaultKey?: string;
  systemDefault?: boolean;
  [key: string]: unknown;
}

export interface AlertRule {
  id: string;
  userId: string;
  ruleName: string;
  alertType: AlertType;
  triggerType: TriggerType;
  referenceType: ReferenceType;
  referenceId: string | null;
  severity: Severity;
  enabled: boolean;
  canDisable: boolean;
  reminderTime: string | null; // HH:mm:ss format
  thresholdPercentage: number | null;
  daysBefore: number | null;
  frequency: string | null; // e.g., "DAILY", "WEEKLY", "MONTHLY"
  ruleConfiguration: RuleConfiguration;
  nextTriggerAt: string | null; // ISO 8601 date string
  lastTriggeredAt: string | null; // ISO 8601 date string
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
}

export interface AlertRulePage {
  content: AlertRule[];
  page: { size: number; number: number; totalElements: number; totalPages: number };
}

export interface AlertRuleQueryParams {
  userId?: string;
  alertType?: AlertType;
  triggerType?: TriggerType;
  severity?: Severity;
  enabled?: boolean;
  referenceType?: ReferenceType;
  referenceId?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: "ASC" | "DESC";
}
