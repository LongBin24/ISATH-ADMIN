import { baseApi } from "@/api/baseApi";
import { API_TAGS } from "@/api/tags";
import { AlertRule } from "./types";

const ALERT_RULES_ENDPOINT = "admin/alert-rules";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function unwrapAlertRule(response: unknown): AlertRule {
  if (isRecord(response) && isRecord(response.data)) {
    return response.data as unknown as AlertRule;
  }

  return response as AlertRule;
}

function unwrapAlertRules(response: unknown): AlertRule[] {
  if (Array.isArray(response)) return response as AlertRule[];

  if (isRecord(response) && Array.isArray(response.content)) {
    return response.content as AlertRule[];
  }

  if (isRecord(response) && Array.isArray(response.data)) {
    return response.data as AlertRule[];
  }

  return [];
}

export const alertRulesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAlertRules: builder.query<
      AlertRule[],
      { search?: string; severity?: string; status?: string } | void
    >({
      query: (params) => ({
        url: ALERT_RULES_ENDPOINT,
        params: params || undefined,
      }),
      transformResponse: unwrapAlertRules,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: API_TAGS.ALERT_RULE,
                id,
              })),
              {
                type: API_TAGS.ALERT_RULE,
                id: "LIST",
              },
            ]
          : [
              {
                type: API_TAGS.ALERT_RULE,
                id: "LIST",
              },
            ],
    }),
    getAlertRuleById: builder.query<AlertRule, string>({
      query: (ruleId) =>
        `${ALERT_RULES_ENDPOINT}/${encodeURIComponent(ruleId)}`,
      transformResponse: unwrapAlertRule,
      providesTags: (_result, _error, id) => [
        {
          type: API_TAGS.ALERT_RULE,
          id,
        },
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAlertRulesQuery,
  useGetAlertRuleByIdQuery,
  useLazyGetAlertRuleByIdQuery,
} = alertRulesApi;
