import { FeedbackStatus } from "./types";

export const feedbackTabs: Array<{ key: FeedbackStatus; label: string }> = [
  { key: "ALL", label: "All" },
  { key: "PENDING", label: "Pending" },
  { key: "IN_REVIEW", label: "In Review" },
  { key: "RESOLVED", label: "Resolved" },
  { key: "CLOSED", label: "Closed" },
];
