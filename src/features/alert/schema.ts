import { z } from "zod";
import {
  ALERT_TYPES,
  TRIGGER_TYPES,
  REFERENCE_TYPES,
  SEVERITIES,
} from "./types";

export const ruleConfigurationSchema = z.object({
  message: z.string().min(1, "Message is required"),
  defaultKey: z.string().min(1, "Default key is required"),
  systemDefault: z.boolean(),
});

export const alertRuleSchema = z.object({
  id: z.string().uuid().optional(), // ID is optional for creation
  userId: z.string().uuid(),
  ruleName: z.string().min(3, "Rule name must be at least 3 characters long"),
  alertType: z.enum(ALERT_TYPES),
  triggerType: z.enum(TRIGGER_TYPES),
  referenceType: z.enum(REFERENCE_TYPES),
  referenceId: z.string().uuid().nullable(),
  severity: z.enum(SEVERITIES),
  enabled: z.boolean(),
  canDisable: z.boolean(),
  reminderTime: z
    .string()
    .regex(
      /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/,
      "Invalid time format (HH:mm:ss)"
    )
    .nullable(),
  thresholdPercentage: z.number().min(0).max(100).nullable(),
  daysBefore: z.number().int().min(0).nullable(),
  frequency: z.string().nullable(), // Could be more specific with an enum if known values
  ruleConfiguration: ruleConfigurationSchema,
  nextTriggerAt: z.string().datetime().nullable(),
  lastTriggeredAt: z.string().datetime().nullable(),
  createdAt: z.string().datetime().optional(), // Optional for creation
  updatedAt: z.string().datetime().optional(), // Optional for creation
});

export type AlertRuleFormValues = z.infer<typeof alertRuleSchema>;
