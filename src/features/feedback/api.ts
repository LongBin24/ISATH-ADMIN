import { baseApi } from "@/api/baseApi";
import { API_TAGS } from "@/api/tags";
import type {
  ApiResponse,
  Review,
  ReviewPage,
  UpdateReviewStatusPayload,
} from "./types";

type ReviewListPayload = Review[] | ReviewPage | ApiResponse<Review[] | ReviewPage>;
type ReviewPayload = Review | ApiResponse<Review>;

function unwrapReviewList(response: ReviewListPayload): Review[] {
  const payload = "data" in response && !Array.isArray(response) ? response.data : response;
  return Array.isArray(payload) ? payload : payload.content;
}

function unwrapReview(response: ReviewPayload): Review {
  return "data" in response ? response.data : response;
}

export const feedbackApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFeedback: builder.query<Review[], void>({
      query: () => "admin/reviews",
      transformResponse: unwrapReviewList,
      providesTags: (result) => [
        { type: API_TAGS.FEEDBACK, id: "LIST" },
        ...(result ?? []).map(({ id }) => ({ type: API_TAGS.FEEDBACK, id })),
      ],
    }),

    getReviewById: builder.query<Review, string>({
      query: (id) => `admin/reviews/${id}`,
      transformResponse: unwrapReview,
      providesTags: (_result, _error, id) => [{ type: API_TAGS.FEEDBACK, id }],
    }),

    updateReviewStatus: builder.mutation<Review, UpdateReviewStatusPayload>({
      query: ({ id, reviewStatus, latestReviewNote }) => ({
        url: `admin/reviews/${id}/status`,
        method: "PATCH",
        body: { reviewStatus, latestReviewNote },
      }),
      transformResponse: unwrapReview,
      invalidatesTags: (_result, _error, { id }) => [
        { type: API_TAGS.FEEDBACK, id },
        { type: API_TAGS.FEEDBACK, id: "LIST" },
      ],
    }),

    deleteReview: builder.mutation<void, string>({
      query: (id) => ({
        url: `admin/reviews/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: API_TAGS.FEEDBACK, id },
        { type: API_TAGS.FEEDBACK, id: "LIST" },
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetFeedbackQuery,
  useGetReviewByIdQuery,
  useUpdateReviewStatusMutation,
  useDeleteReviewMutation,
} = feedbackApi;
