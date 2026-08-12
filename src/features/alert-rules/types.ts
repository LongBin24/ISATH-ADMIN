export interface AlertRule {
  id: string;
  userId: string;
  ruleName: string;
  alertType: string;
  triggerType: string;
  referenceType: string;
  referenceId: string;
  severity: string;
  enabled: boolean;
  canDisable: boolean;
  reminderTime: string;
  thresholdPercentage: number;
  daysBefore: number;
  frequency: string;
  ruleConfiguration: Record<string, string>;
  [key: string]: unknown;
}
