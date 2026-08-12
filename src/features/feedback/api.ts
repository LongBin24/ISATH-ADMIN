import { baseApi } from "@/api/baseApi";
import { 
  FeedbackItem, 
  AdminReviewItem, 
  AdminReviewResponse, 
  UpdateReviewStatusPayload 
} from "./types";

type ReviewResponse = {
  id: string;
  reviewType: string;
  title: string;
  description: string;
  overallRating?: number;
  reviewStatus: "PENDING" | "IN_REVIEW" | "RESOLVED" | "CLOSED";
  createdAt: string;
};

const toFeedback = (review: ReviewResponse): FeedbackItem => ({
  id: review.id,
  title: review.title,
  description: review.description,
  category: review.reviewType,
  status:
    review.reviewStatus === "RESOLVED" || review.reviewStatus === "CLOSED"
      ? "resolved"
      : review.reviewStatus === "IN_REVIEW"
        ? "in-progress"
        : "new",
  rating: review.overallRating ?? 0,
  votes: 0,
  date: new Intl.DateTimeFormat("en-GB").format(new Date(review.createdAt)),
});

export const feedbackApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFeedback: builder.query<FeedbackItem[], void>({
      async queryFn(_arg, _queryApi, _extraOptions, baseQuery) {
        let result = await baseQuery("admin/reviews?pageNumber=0&pageSize=100");
        if (!result.data) {
          result = await baseQuery("reviews?pageNumber=0&pageSize=100");
        }

        if (result.data) {
          const raw = result.data as any;
          const list = Array.isArray(raw) ? raw : raw.content || [];
          return { data: list.map(toFeedback) };
        }

        return { data: [] };
      },
      providesTags: ["Feedback"],
    }),

    // PATCH /api/v1/admin/reviews/{id}/status
    updateReviewStatus: builder.mutation<AdminReviewResponse, UpdateReviewStatusPayload>({
      query: ({ id, reviewStatus, latestReviewNote }) => ({
        url: `admin/reviews/${id}/status`,
        method: "PATCH",
        body: {
          reviewStatus,
          latestReviewNote,
        },
      }),
      invalidatesTags: ["Feedback"],
    }),
  }),
  overrideExisting: true,
});

export const { 
  useGetFeedbackQuery, 
  useUpdateReviewStatusMutation 
} = feedbackApi;
