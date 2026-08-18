import { baseApi } from "@/api/baseApi";
import { ENDPOINTS_PROMPT_TEMPLATE } from "@/api/endpoints";
import { API_TAGS } from "@/api/tags";
import type {
  ApiResponse,
  CreatePromptTemplatePayload,
  CreatePromptTemplateVersionPayload,
  PromptTemplate,
  PromptTemplateItem,
  PromptTemplatePage,
  PromptTemplatePageResponse,
  PromptTemplateQueryParams,
  PromptTemplateVersion,
  TestPromptTemplatePayload,
  TestPromptTemplateResponse,
  UpdatePromptTemplatePayload,
} from "./types";

export * from "./types";

const TAG = API_TAGS.PROMPT_TEMPLATE ?? "PromptTemplate";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizePromptTemplate(item: PromptTemplateItem): PromptTemplate {
  return {
    ...item,
    name: item.name || item.templateName,
    status: item.status || item.templateStatus,
    template: item.template || item.userPromptTemplate,
  };
}

function unwrapPromptTemplate(response: unknown): PromptTemplate {
  if (isRecord(response) && isRecord(response.data)) {
    return normalizePromptTemplate(response.data as unknown as PromptTemplateItem);
  }
  if (isRecord(response) && "id" in response) {
    return normalizePromptTemplate(response as unknown as PromptTemplateItem);
  }
  return response as PromptTemplate;
}

function unwrapPromptTemplates(response: unknown): PromptTemplate[] {
  let list: PromptTemplateItem[] = [];

  if (Array.isArray(response)) {
    list = response as PromptTemplateItem[];
  } else if (isRecord(response)) {
    if (Array.isArray(response.content)) {
      list = response.content as PromptTemplateItem[];
    } else if (isRecord(response.data)) {
      if (Array.isArray(response.data.content)) {
        list = response.data.content as PromptTemplateItem[];
      } else if (Array.isArray(response.data)) {
        list = response.data as PromptTemplateItem[];
      }
    } else if (Array.isArray(response.data)) {
      list = response.data as PromptTemplateItem[];
    }
  }

  return list.map(normalizePromptTemplate);
}

function unwrapPromptTemplatePage(response: unknown): PromptTemplatePage {
  const root = isRecord(response) && isRecord(response.data) ? response.data : response;
  const body = isRecord(root) ? root : {};
  const rawContent = Array.isArray(body.content)
    ? (body.content as PromptTemplateItem[])
    : Array.isArray(root)
    ? (root as PromptTemplateItem[])
    : [];

  const content = rawContent.map(normalizePromptTemplate);

  const pageMeta = isRecord(body.page) ? (body.page as Record<string, unknown>) : body;
  const totalElements =
    typeof pageMeta.totalElements === "number"
      ? pageMeta.totalElements
      : typeof body.totalElements === "number"
      ? body.totalElements
      : content.length;
  const totalPages =
    typeof pageMeta.totalPages === "number"
      ? pageMeta.totalPages
      : typeof body.totalPages === "number"
      ? body.totalPages
      : totalElements > 0
      ? 1
      : 0;
  const size =
    typeof pageMeta.size === "number"
      ? pageMeta.size
      : typeof body.size === "number"
      ? body.size
      : content.length;
  const number =
    typeof pageMeta.number === "number"
      ? pageMeta.number
      : typeof body.page === "number"
      ? body.page
      : typeof body.number === "number"
      ? body.number
      : 0;

  return {
    content,
    totalElements,
    totalPages,
    size,
    number,
    page: number,
    first: number === 0,
    last: totalPages > 0 ? number >= totalPages - 1 : true,
    pageMeta: {
      size,
      number,
      totalElements,
      totalPages,
    },
  };
}

function normalizePromptTemplateVersion(item: PromptTemplateVersion): PromptTemplateVersion {
  const raw = item as Record<string, unknown>;
  return {
    ...item,
    version: item.version ?? item.versionNumber,
    templateName: item.templateName || (typeof raw.name === "string" ? raw.name : undefined),
    templateStatus: item.templateStatus || (typeof raw.status === "string" ? raw.status : undefined),
    userPromptTemplate: item.userPromptTemplate || (typeof raw.template === "string" ? raw.template : undefined),
  };
}

function unwrapPromptTemplateVersion(response: unknown): PromptTemplateVersion {
  if (isRecord(response) && isRecord(response.data)) {
    return normalizePromptTemplateVersion(response.data as unknown as PromptTemplateVersion);
  }
  if (isRecord(response) && "id" in response) {
    return normalizePromptTemplateVersion(response as unknown as PromptTemplateVersion);
  }
  return (response as PromptTemplateVersion) || ({} as PromptTemplateVersion);
}

function unwrapPromptTemplateVersions(response: unknown): PromptTemplateVersion[] {
  if (Array.isArray(response)) return response.map(normalizePromptTemplateVersion);

  if (isRecord(response)) {
    if (Array.isArray(response.content)) {
      return (response.content as PromptTemplateVersion[]).map(normalizePromptTemplateVersion);
    }
    if (isRecord(response.data)) {
      if (Array.isArray(response.data.content)) {
        return (response.data.content as PromptTemplateVersion[]).map(normalizePromptTemplateVersion);
      }
      if (Array.isArray(response.data)) {
        return (response.data as PromptTemplateVersion[]).map(normalizePromptTemplateVersion);
      }
      if ("id" in response.data) {
        return [normalizePromptTemplateVersion(response.data as unknown as PromptTemplateVersion)];
      }
    }
    if (Array.isArray(response.data)) {
      return (response.data as PromptTemplateVersion[]).map(normalizePromptTemplateVersion);
    }
    if ("id" in response) {
      return [normalizePromptTemplateVersion(response as unknown as PromptTemplateVersion)];
    }
  }

  return [];
}

function unwrapTestResponse(response: unknown): TestPromptTemplateResponse {
  if (isRecord(response) && isRecord(response.data)) {
    return response.data as unknown as TestPromptTemplateResponse;
  }
  return (response as TestPromptTemplateResponse) || {};
}

export function buildPromptTemplateQueryParams(params?: PromptTemplateQueryParams): string {
  if (!params) return "";
  const query = new URLSearchParams();

  // Pagination params (support both pageNumber/pageSize and page/size)
  const pageNum = params.pageNumber ?? params.page;
  if (pageNum !== undefined) {
    query.set("pageNumber", String(pageNum));
  }

  const pageSize = params.pageSize ?? params.size;
  if (pageSize !== undefined) {
    query.set("pageSize", String(pageSize));
  }

  if (params.templateKey) query.set("templateKey", params.templateKey);
  if (params.templateName) query.set("templateName", params.templateName);
  if (params.name && !params.templateName) query.set("templateName", params.name);
  if (params.taskType && params.taskType !== "ALL") query.set("taskType", params.taskType);
  if (params.templateScope && params.templateScope !== "ALL") query.set("templateScope", params.templateScope);
  if (params.languageCode && params.languageCode !== "ALL") query.set("languageCode", params.languageCode);

  const status = params.templateStatus || params.status;
  if (status && status !== "ALL") {
    query.set("templateStatus", status);
    query.set("status", status);
  }

  if (params.isDefault !== undefined) query.set("isDefault", String(params.isDefault));
  if (params.version !== undefined) query.set("version", String(params.version));

  if (params.search || params.query) {
    const s = (params.search || params.query || "").trim();
    if (s) {
      query.set("search", s);
      query.set("query", s);
    }
  }

  if (params.sortBy) query.set("sortBy", params.sortBy);
  if (params.sortDirection) query.set("sortDirection", params.sortDirection);

  const queryString = query.toString();
  return queryString ? `?${queryString}` : "";
}

export const promptTemplatesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. GET /api/v1/admin/ai/prompt-templates (list format)
    getPromptTemplates: builder.query<PromptTemplate[], PromptTemplateQueryParams | void>({
      query: (params) =>
        `${ENDPOINTS_PROMPT_TEMPLATE.PROMPT_TEMPLATES}${buildPromptTemplateQueryParams(params || undefined)}`,
      transformResponse: unwrapPromptTemplates,
      providesTags: (result) => [
        { type: TAG, id: "LIST" },
        ...(result ?? []).map(({ id }) => ({ type: TAG, id })),
      ],
    }),

    // GET /api/v1/admin/ai/prompt-templates (paged format)
    getAdminPromptTemplates: builder.query<PromptTemplatePage, PromptTemplateQueryParams | void>({
      query: (params) =>
        `${ENDPOINTS_PROMPT_TEMPLATE.PROMPT_TEMPLATES}${buildPromptTemplateQueryParams(params || undefined)}`,
      transformResponse: unwrapPromptTemplatePage,
      providesTags: (result) => [
        { type: TAG, id: "LIST" },
        ...(result?.content ?? []).map(({ id }) => ({ type: TAG, id })),
      ],
    }),

    getPromptTemplatesPage: builder.query<PromptTemplatePage, PromptTemplateQueryParams | void>({
      query: (params) =>
        `${ENDPOINTS_PROMPT_TEMPLATE.PROMPT_TEMPLATES}${buildPromptTemplateQueryParams(params || undefined)}`,
      transformResponse: unwrapPromptTemplatePage,
      providesTags: (result) => [
        { type: TAG, id: "LIST" },
        ...(result?.content ?? []).map(({ id }) => ({ type: TAG, id })),
      ],
    }),

    // 2. POST /api/v1/admin/ai/prompt-templates
    createPromptTemplate: builder.mutation<PromptTemplate, CreatePromptTemplatePayload>({
      query: (body) => ({
        url: ENDPOINTS_PROMPT_TEMPLATE.PROMPT_TEMPLATES,
        method: "POST",
        body,
      }),
      transformResponse: unwrapPromptTemplate,
      invalidatesTags: [{ type: TAG, id: "LIST" }],
    }),

    // 3. GET /api/v1/admin/ai/prompt-templates/{templateId}/versions
    getPromptTemplateVersions: builder.query<
      PromptTemplateVersion[],
      string | { templateId: string; page?: number; size?: number; pageNumber?: number; pageSize?: number }
    >({
      query: (arg) => {
        const templateId = typeof arg === "string" ? arg : arg.templateId;
        const queryParams = typeof arg === "object" ? buildPromptTemplateQueryParams(arg) : "";
        return `${ENDPOINTS_PROMPT_TEMPLATE.PROMPT_TEMPLATE_VERSIONS(templateId)}${queryParams}`;
      },
      transformResponse: unwrapPromptTemplateVersions,
      providesTags: (_result, _error, arg) => {
        const templateId = typeof arg === "string" ? arg : arg.templateId;
        return [
          { type: TAG, id: `${templateId}_VERSIONS` },
          { type: TAG, id: templateId },
        ];
      },
    }),

    // 4. POST /api/v1/admin/ai/prompt-templates/{templateId}/versions
    createPromptTemplateVersion: builder.mutation<
      PromptTemplateVersion,
      | { templateId: string; body: CreatePromptTemplateVersionPayload }
      | (CreatePromptTemplateVersionPayload & { templateId: string })
    >({
      query: (arg) => {
        const templateId = arg.templateId;
        const body =
          "body" in arg && arg.body ? arg.body : { ...arg, templateId: undefined };
        return {
          url: ENDPOINTS_PROMPT_TEMPLATE.PROMPT_TEMPLATE_VERSIONS(templateId),
          method: "POST",
          body,
        };
      },
      transformResponse: unwrapPromptTemplateVersion,
      invalidatesTags: (_result, _error, arg) => {
        const templateId = arg.templateId;
        return [
          { type: TAG, id: "LIST" },
          { type: TAG, id: templateId },
          { type: TAG, id: `${templateId}_VERSIONS` },
        ];
      },
    }),

    // 5. POST /api/v1/admin/ai/prompt-templates/{templateId}/test
    testPromptTemplate: builder.mutation<
      TestPromptTemplateResponse,
      | { templateId: string; body?: TestPromptTemplatePayload }
      | (TestPromptTemplatePayload & { templateId: string })
    >({
      query: (arg) => {
        const templateId = arg.templateId;
        const body =
          "body" in arg && arg.body ? arg.body : { ...arg, templateId: undefined };
        return {
          url: ENDPOINTS_PROMPT_TEMPLATE.PROMPT_TEMPLATE_TEST(templateId),
          method: "POST",
          body: body || {},
        };
      },
      transformResponse: unwrapTestResponse,
    }),

    // 6. POST /api/v1/admin/ai/prompt-templates/{templateId}/set-default
    setDefaultPromptTemplate: builder.mutation<
      PromptTemplate,
      | string
      | { templateId: string; versionId?: string; body?: Record<string, unknown> }
      | (Record<string, unknown> & { templateId: string })
    >({
      query: (arg) => {
        const templateId = typeof arg === "string" ? arg : arg.templateId;
        let body: Record<string, unknown> = {};
        if (typeof arg === "object") {
          const rawArg = arg as Record<string, unknown>;
          if ("body" in rawArg && rawArg.body && typeof rawArg.body === "object") {
            body = rawArg.body as Record<string, unknown>;
          } else if ("versionId" in rawArg && rawArg.versionId) {
            body = { versionId: rawArg.versionId };
          } else {
            const { templateId: _id, ...rest } = rawArg;
            body = rest;
          }
        }
        return {
          url: ENDPOINTS_PROMPT_TEMPLATE.PROMPT_TEMPLATE_SET_DEFAULT(templateId),
          method: "POST",
          body,
        };
      },
      transformResponse: unwrapPromptTemplate,
      invalidatesTags: (_result, _error, arg) => {
        const templateId = typeof arg === "string" ? arg : arg.templateId;
        return [
          { type: TAG, id: "LIST" },
          { type: TAG, id: templateId },
          { type: TAG, id: `${templateId}_VERSIONS` },
        ];
      },
    }),

    // 7. POST /api/v1/admin/ai/prompt-templates/{templateId}/archive
    archivePromptTemplate: builder.mutation<
      PromptTemplate,
      string | { templateId: string; body?: Record<string, unknown> } | (Record<string, unknown> & { templateId: string })
    >({
      query: (arg) => {
        const templateId = typeof arg === "string" ? arg : arg.templateId;
        let body: Record<string, unknown> = {};
        if (typeof arg === "object") {
          const rawArg = arg as Record<string, unknown>;
          if ("body" in rawArg && rawArg.body && typeof rawArg.body === "object") {
            body = rawArg.body as Record<string, unknown>;
          } else {
            const { templateId: _id, ...rest } = rawArg;
            body = rest;
          }
        }
        return {
          url: ENDPOINTS_PROMPT_TEMPLATE.PROMPT_TEMPLATE_ARCHIVE(templateId),
          method: "POST",
          body,
        };
      },
      transformResponse: unwrapPromptTemplate,
      invalidatesTags: (_result, _error, arg) => {
        const templateId = typeof arg === "string" ? arg : arg.templateId;
        return [
          { type: TAG, id: "LIST" },
          { type: TAG, id: templateId },
          { type: TAG, id: `${templateId}_VERSIONS` },
        ];
      },
    }),

    // 8. POST /api/v1/admin/ai/prompt-templates/{templateId}/activate
    activatePromptTemplate: builder.mutation<
      PromptTemplate,
      string | { templateId: string; body?: Record<string, unknown> } | (Record<string, unknown> & { templateId: string })
    >({
      query: (arg) => {
        const templateId = typeof arg === "string" ? arg : arg.templateId;
        let body: Record<string, unknown> = {};
        if (typeof arg === "object") {
          const rawArg = arg as Record<string, unknown>;
          if ("body" in rawArg && rawArg.body && typeof rawArg.body === "object") {
            body = rawArg.body as Record<string, unknown>;
          } else {
            const { templateId: _id, ...rest } = rawArg;
            body = rest;
          }
        }
        return {
          url: ENDPOINTS_PROMPT_TEMPLATE.PROMPT_TEMPLATE_ACTIVATE(templateId),
          method: "POST",
          body,
        };
      },
      transformResponse: unwrapPromptTemplate,
      invalidatesTags: (_result, _error, arg) => {
        const templateId = typeof arg === "string" ? arg : arg.templateId;
        return [
          { type: TAG, id: "LIST" },
          { type: TAG, id: templateId },
          { type: TAG, id: `${templateId}_VERSIONS` },
        ];
      },
    }),

    // 9. GET /api/v1/admin/ai/prompt-templates/{templateId}
    getPromptTemplateById: builder.query<PromptTemplate, string>({
      query: (templateId) => ENDPOINTS_PROMPT_TEMPLATE.PROMPT_TEMPLATE_BY_ID(templateId),
      transformResponse: unwrapPromptTemplate,
      providesTags: (_result, _error, id) => [{ type: TAG, id }],
    }),

    // 10. PATCH /api/v1/admin/ai/prompt-templates/{templateId}
    updatePromptTemplate: builder.mutation<
      PromptTemplate,
      | { templateId: string; body: UpdatePromptTemplatePayload }
      | (UpdatePromptTemplatePayload & { templateId: string })
    >({
      query: (arg) => {
        const templateId = arg.templateId;
        const body =
          "body" in arg && arg.body ? arg.body : { ...arg, templateId: undefined };
        return {
          url: ENDPOINTS_PROMPT_TEMPLATE.PROMPT_TEMPLATE_BY_ID(templateId),
          method: "PATCH",
          body,
        };
      },
      transformResponse: unwrapPromptTemplate,
      invalidatesTags: (_result, _error, arg) => {
        const templateId = arg.templateId;
        return [
          { type: TAG, id: "LIST" },
          { type: TAG, id: templateId },
          { type: TAG, id: `${templateId}_VERSIONS` },
        ];
      },
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetPromptTemplatesQuery,
  useLazyGetPromptTemplatesQuery,
  useGetAdminPromptTemplatesQuery,
  useLazyGetAdminPromptTemplatesQuery,
  useGetPromptTemplatesPageQuery,
  useLazyGetPromptTemplatesPageQuery,
  useGetPromptTemplateByIdQuery,
  useLazyGetPromptTemplateByIdQuery,
  useCreatePromptTemplateMutation,
  useUpdatePromptTemplateMutation,
  useGetPromptTemplateVersionsQuery,
  useLazyGetPromptTemplateVersionsQuery,
  useCreatePromptTemplateVersionMutation,
  useTestPromptTemplateMutation,
  useSetDefaultPromptTemplateMutation,
  useArchivePromptTemplateMutation,
  useActivatePromptTemplateMutation,
} = promptTemplatesApi;
