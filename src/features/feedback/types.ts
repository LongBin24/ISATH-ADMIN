export type ReviewStatus = "PENDING" | "IN_REVIEW" | "RESOLVED" | "CLOSED";

export type FeedbackStatus = "ALL" | ReviewStatus;

export interface Review {
  id: string;
  userId: string;
  reviewType: string;
  title: string;
  description: string;
  screenshotUrl: string | null;
  uiRating: number | null;
  performanceRating: number | null;
  easeOfUseRating: number | null;
  featureRating: number | null;
  overallRating: number | null;
  reviewStatus: ReviewStatus;
  reviewedBy: string | null;
  latestReviewNote: string | null;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateReviewStatusRequest {
  reviewStatus: ReviewStatus;
  latestReviewNote: string;
}

export interface UpdateReviewStatusPayload extends UpdateReviewStatusRequest {
  id: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  timestamp?: string;
}

export interface ReviewPage {
  content: Review[];
  totalElements?: number;
  totalPages?: number;
  number?: number;
  size?: number;
}

// Compatibility aliases for existing feature imports.
export type FeedbackItem = Review;
export type ReviewResponse = Review;
export type AdminReviewItem = Review;
export type AdminReviewResponse = ApiResponse<Review>;
