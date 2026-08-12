import { FeedbackStatus } from "./types";

export const feedbackTabs: Array<{ key: FeedbackStatus; label: string }> = [
  { key: "all", label: "All" },
  { key: "resolved", label: "Resolved" },
  { key: "in-progress", label: "In Progress" },
  { key: "new", label: "New" },
];
