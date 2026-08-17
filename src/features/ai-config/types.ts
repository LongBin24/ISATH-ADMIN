export type PromptTemplateStatus = "ACTIVE" | "INACTIVE" | "ARCHIVED" | "DRAFT";

export type TaskType =
  | "CATEGORY_PREDICTION"
  | "FINANCIAL_ASSISTANT"
  | (string & {});

export type TemplateScope =
  | "GENERAL_CONVERSATION"
  | "SAVINGS_ANALYSIS"
  | "SPENDING_ANALYSIS"
  | "INCOME_ANALYSIS"
  | "GENERAL_QUESTION"
  | "MONTHLY_SUMMARY"
  | (string & {});

export type LanguageCode = "en" | "km" | (string & {});

export interface GenerationConfig {
  temperature?: number;
  top_p?: number;
  top_k?: number;
  max_tokens?: number;
  presence_penalty?: number;
  frequency_penalty?: number;
  [key: string]: unknown;
}

export interface JsonSchemaProperty {
  type?: string;
  description?: string;
  enum?: (string | number)[];
  required?: string[];
  properties?: Record<string, JsonSchemaProperty>;
  items?: JsonSchemaProperty;
  [key: string]: unknown;
}

export interface JsonSchema {
  type?: string;
  required?: string[];
  properties?: Record<string, JsonSchemaProperty>;
  [key: string]: unknown;
}

export interface PromptTemplateItem {
  id: string;
  templateKey: string;
  templateName: string;
  description?: string | null;
  taskType: TaskType;
  templateScope?: TemplateScope | null;
  languageCode: LanguageCode;
  version: number;
  systemPrompt: string;
  userPromptTemplate: string;
  inputSchema?: JsonSchema | Record<string, unknown> | null;
  outputSchema?: JsonSchema | Record<string, unknown> | null;
  modelName?: string | null;
  generationConfig?: GenerationConfig | Record<string, unknown> | null;
  templateStatus: PromptTemplateStatus;
  isDefault: boolean;
  createdBy?: string | null;
  updatedBy?: string | null;
  activatedAt?: string | null;
  archivedAt?: string | null;
  createdAt: string;
  updatedAt: string;

  // Compatibility aliases
  name?: string;
  status?: PromptTemplateStatus | string;
  template?: string;
  [key: string]: unknown;
}

export type PromptTemplate = PromptTemplateItem;

export interface PromptTemplatePageMetadata {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
}

export interface PromptTemplatePageResponse {
  content: PromptTemplateItem[];
  page: PromptTemplatePageMetadata;
}

export interface PromptTemplatePage {
  content: PromptTemplateItem[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  pageMeta?: PromptTemplatePageMetadata;
}

export interface PromptTemplateQueryParams {
  pageNumber?: number;
  pageSize?: number;
  page?: number;
  size?: number;
  templateKey?: string;
  templateName?: string;
  name?: string;
  taskType?: TaskType;
  templateScope?: TemplateScope;
  languageCode?: LanguageCode;
  templateStatus?: PromptTemplateStatus | string;
  status?: PromptTemplateStatus | string;
  isDefault?: boolean;
  version?: number;
  search?: string;
  query?: string;
  sortBy?: string;
  sortDirection?: "ASC" | "DESC" | "asc" | "desc";
  [key: string]: unknown;
}

export interface PromptTemplateVersion {
  id: string;
  templateId?: string;
  templateKey?: string;
  templateName?: string;
  description?: string | null;
  taskType?: TaskType;
  templateScope?: TemplateScope | null;
  languageCode?: LanguageCode;
  version?: number | string;
  versionNumber?: number;
  systemPrompt?: string | null;
  userPromptTemplate?: string | null;
  inputSchema?: JsonSchema | Record<string, unknown> | null;
  outputSchema?: JsonSchema | Record<string, unknown> | null;
  modelName?: string | null;
  generationConfig?: GenerationConfig | Record<string, unknown> | null;
  templateStatus?: PromptTemplateStatus | string;
  isDefault?: boolean;
  createdBy?: string | null;
  updatedBy?: string | null;
  activatedAt?: string | null;
  archivedAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  versionNote?: string | null;
  notes?: string | null;
  changelog?: string | null;
  [key: string]: unknown;
}

export interface CreatePromptTemplatePayload {
  templateKey: string;
  templateName: string;
  description?: string | null;
  taskType: TaskType;
  templateScope?: TemplateScope | null;
  languageCode: LanguageCode;
  systemPrompt: string;
  userPromptTemplate: string;
  inputSchema?: JsonSchema | Record<string, unknown> | null;
  outputSchema?: JsonSchema | Record<string, unknown> | null;
  modelName?: string | null;
  generationConfig?: GenerationConfig | Record<string, unknown> | null;
  templateStatus?: PromptTemplateStatus | string;
  isDefault?: boolean;

  // Compatibility aliases
  name?: string;
  template?: string;
  systemMessage?: string;
  variables?: string[] | Record<string, unknown>;
  model?: string;
  modelConfig?: Record<string, unknown>;
  status?: PromptTemplateStatus | string;
  [key: string]: unknown;
}

export interface UpdatePromptTemplatePayload {
  templateKey?: string;
  templateName?: string;
  description?: string | null;
  taskType?: TaskType;
  templateScope?: TemplateScope | null;
  languageCode?: LanguageCode;
  systemPrompt?: string;
  userPromptTemplate?: string;
  inputSchema?: JsonSchema | Record<string, unknown> | null;
  outputSchema?: JsonSchema | Record<string, unknown> | null;
  modelName?: string | null;
  generationConfig?: GenerationConfig | Record<string, unknown> | null;
  templateStatus?: PromptTemplateStatus | string;
  isDefault?: boolean;

  // Compatibility aliases
  name?: string;
  template?: string;
  systemMessage?: string;
  variables?: string[] | Record<string, unknown>;
  model?: string;
  modelConfig?: Record<string, unknown>;
  status?: PromptTemplateStatus | string;
  [key: string]: unknown;
}

export interface CreatePromptTemplateVersionPayload {
  systemPrompt?: string;
  userPromptTemplate?: string;
  inputSchema?: JsonSchema | Record<string, unknown> | null;
  outputSchema?: JsonSchema | Record<string, unknown> | null;
  generationConfig?: GenerationConfig | Record<string, unknown> | null;
  modelName?: string | null;
  versionNote?: string | null;
  notes?: string | null;
  changelog?: string | null;
  isDefault?: boolean;

  // Compatibility aliases
  template?: string;
  systemMessage?: string;
  variables?: string[] | Record<string, unknown>;
  modelConfig?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface TestPromptTemplatePayload {
  variables?: Record<string, unknown>;
  input?: string;
  model?: string;
  modelName?: string;
  versionId?: string;
  versionNumber?: number;
  generationConfig?: GenerationConfig;
  temperature?: number;
  maxTokens?: number;
  [key: string]: unknown;
}

export interface TestPromptTemplateResponse {
  result?: string;
  output?: string;
  renderedPrompt?: string;
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
  executionTimeMs?: number;
  success?: boolean;
  error?: string;
  [key: string]: unknown;
}

export interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data: T;
  timestamp?: string;
}
