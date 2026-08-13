import { baseApi } from "@/api/baseApi";
import { API_TAGS } from "@/api/tags";
import type {
  ApiResponse,
  Review,
  ReviewPage,
  ReviewQueryParams,
  UpdateReviewStatusPayload,
} from "./types";

type ReviewListPayload = Review[] | ReviewPage | ApiResponse<Review[] | ReviewPage>;
type ReviewPayload = Review | ApiResponse<Review>;

function unwrapReviewList(response: ReviewListPayload): Review[] {
  const payload = "data" in response && !Array.isArray(response) ? response.data : response;
  return Array.isArray(payload) ? payload : payload.content;
}

function unwrapReviewPage(response: unknown): ReviewPage {
  const root = response as Record<string, unknown> | null;
  const body = (root?.data && typeof root.data === "object" ? root.data : root) as Record<string, unknown> | null;
  const content = Array.isArray(body?.content) ? body.content as Review[] : [];
  return {
    content,
    totalElements: typeof body?.totalElements === "number" ? body.totalElements : content.length,
    totalPages: typeof body?.totalPages === "number" ? body.totalPages : content.length ? 1 : 0,
    page: typeof body?.page === "number" ? body.page : typeof body?.number === "number" ? body.number : 0,
    size: typeof body?.size === "number" ? body.size : content.length,
    first: typeof body?.first === "boolean" ? body.first : true,
    last: typeof body?.last === "boolean" ? body.last : true,
  };
}

function buildReviewParams(params: ReviewQueryParams) {
  const query = new URLSearchParams();
  query.set("page", String(params.page ?? 0));
  query.set("size", String(params.size ?? 20));
  if (params.type) query.set("type", params.type);
  if (params.status) query.set("status", params.status);
  for (const sort of params.sort ?? []) query.append("sort", sort);
  return query.toString();
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

    getAdminReviews: builder.query<ReviewPage, ReviewQueryParams>({
      query: (params) => `admin/reviews?${buildReviewParams(params)}`,
      transformResponse: unwrapReviewPage,
      providesTags: (result) => [
        { type: API_TAGS.FEEDBACK, id: "LIST" },
        ...(result?.content ?? []).map(({ id }) => ({ type: API_TAGS.FEEDBACK, id })),
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
  useGetAdminReviewsQuery,
  useGetReviewByIdQuery,
  useUpdateReviewStatusMutation,
  useDeleteReviewMutation,
} = feedbackApi;
