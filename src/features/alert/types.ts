export type AlertType = "RECURRING_REMINDER" | "THRESHOLD_EXCEEDED" | "CUSTOM";
export type TriggerType = "SCHEDULE" | "EVENT" | "MANUAL";
export type ReferenceType =
  | "RECURRING_TRANSACTION"
  | "TRANSACTION_CATEGORY"
  | "ACCOUNT_BALANCE"
  | "NONE";
export type Severity = "INFO" | "WARNING" | "CRITICAL";

export interface RuleConfiguration {
  message: string;
  defaultKey: string;
  systemDefault: boolean;
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
