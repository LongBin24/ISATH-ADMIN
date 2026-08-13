import { FeedbackStatus } from "./types";

export const feedbackTabs: Array<{ key: FeedbackStatus; label: string }> = [
  { key: "ALL", label: "ទាំងអស់" },
  { key: "PENDING", label: "កំពុងរង់ចាំ" },
  { key: "IN_REVIEW", label: "កំពុងពិនិត្យ" },
  { key: "RESOLVED", label: "បានដោះស្រាយ" },
  { key: "CLOSED", label: "បានបិទ" },
];
