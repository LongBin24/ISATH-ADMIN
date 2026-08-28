import { z } from "zod";
import { ADMIN_NOTIFICATION_TYPES, ADMIN_REFERENCE_TYPES } from "./types";

export const createAdminNotificationSchema = z.object({
  userId: z.string().min(1, "Recipient is required"),
  title: z.string().trim().min(1, "Title is required").max(200, "Title must be 200 characters or fewer"),
  message: z.string().trim().min(1, "Message is required").max(2000, "Message must be 2,000 characters or fewer"),
  notificationType: z.enum(ADMIN_NOTIFICATION_TYPES),
  channels: z.array(z.enum(["IN_APP", "EMAIL"])).min(1, "Select at least one delivery channel"),
  referenceType: z.enum([...ADMIN_REFERENCE_TYPES, "NONE"]).optional(),
  referenceId: z.string().optional(),
  actionUrl: z.string().optional(),
  expiresAt: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const broadcastNotificationSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200, "Title must be 200 characters or fewer"),
  message: z.string().trim().min(1, "Message is required").max(2000, "Message must be 2,000 characters or fewer"),
  notificationType: z.enum(ADMIN_NOTIFICATION_TYPES),
  sendEmail: z.boolean().default(false),
  channels: z.array(z.enum(["IN_APP", "EMAIL"])).min(1, "Select at least one delivery channel"),
  referenceType: z.enum([...ADMIN_REFERENCE_TYPES, "NONE"]).optional(),
  referenceId: z.string().optional(),
  actionUrl: z.string().optional(),
  expiresAt: z.string().optional(),
  userIds: z.array(z.string()).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type CreateAdminNotificationFormData = z.infer<typeof createAdminNotificationSchema>;
export type BroadcastNotificationFormData = z.infer<typeof broadcastNotificationSchema>;

export const markNotificationSeenSchema = z.object({
  seenThrough: z.string().optional(),
  lastSeenAt: z.string().optional(),
  unseenCount: z.number().int().nonnegative().optional(),
});

export type MarkNotificationSeenFormData = z.infer<typeof markNotificationSeenSchema>;
