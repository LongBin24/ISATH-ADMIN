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

export interface UpdateReviewStatusRequest {
  reviewStatus: "PENDING" | "IN_REVIEW" | "RESOLVED" | "CLOSED";
  latestReviewNote?: string;
}

export interface ReviewResponse {
  id: string;
  userId?: string;
  reviewType: "SUGGESTION" | "BUG_REPORT" | "COMPLAINT" | "COMPLIMENT" | "GENERAL" | string;
  title: string;
  description: string;
  screenshotUrl?: string;
  uiRating?: number;
  performanceRating?: number;
  easeOfUseRating?: number;
  featureRating?: number;
  overallRating?: number;
  reviewStatus: "PENDING" | "IN_REVIEW" | "RESOLVED" | "CLOSED" | string;
  reviewedBy?: string;
  latestReviewNote?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ApiResponseReviewResponse {
  success: boolean;
  message?: string;
  data: ReviewResponse;
  timestamp?: string;
}

// Aliases for compatibility
export type AdminReviewItem = ReviewResponse;
export type AdminReviewResponse = ApiResponseReviewResponse;
export interface UpdateReviewStatusPayload extends UpdateReviewStatusRequest {
  id: string;
}
