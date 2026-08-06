export type FeedbackStatus = "all" | "resolved" | "in-progress" | "new";

export interface FeedbackItem {
  id: string;
  title: string;
  description: string;
  category: string;
  status: Exclude<FeedbackStatus, "all">;
  rating: number;
  votes: number;
  date: string;
}
