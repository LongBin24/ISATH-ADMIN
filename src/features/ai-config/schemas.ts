import { z } from "zod";

/**
 * Regex for templateKey constraint from Spring backend:
 * "templateKey may contain lowercase letters, numbers, '.', '_' and '-' only"
 */
export const TEMPLATE_KEY_REGEX = /^[a-z0-9._-]+$/;

/**
 * Schema for JSON string or record validation
 */
export const jsonStringOrObjectSchema = z
  .union([z.string(), z.record(z.string(), z.unknown()), z.null(), z.undefined()])
  .refine(
    (val) => {
      if (val === null || val === undefined || val === "") return true;
      if (typeof val === "object") return true;
      try {
        JSON.parse(val);
        return true;
      } catch {
        return false;
      }
    },
    { message: "Must be a valid JSON object or string." }
  );

/**
 * Zod Schema for Creating / Editing Prompt Templates
 * (POST / PATCH /api/v1/admin/ai/prompt-templates)
 */
export const promptTemplateSchema = z.object({
  templateKey: z
    .string()
    .min(1, { message: "Template key is required." })
    .max(150, { message: "Template key cannot exceed 150 characters." })
    .regex(TEMPLATE_KEY_REGEX, {
      message:
        "Template key may contain lowercase letters, numbers, '.', '_' and '-' only (no uppercase or spaces).",
    }),

  templateName: z
    .string()
    .min(1, { message: "Template name is required." })
    .max(200, { message: "Template name cannot exceed 200 characters." }),

  description: z.string().max(1000).optional().nullable(),

  taskType: z.enum(
    [
      "CATEGORY_PREDICTION",
      "FINANCIAL_ASSISTANT",
      "SAVINGS_GOAL_ANALYSIS",
      "BUDGET_ADVICE",
    ],
    { message: "Please select a valid Task Type." }
  ),

  templateScope: z
    .enum([
      "GENERAL_CONVERSATION",
      "SAVINGS_ANALYSIS",
      "SPENDING_ANALYSIS",
      "INCOME_ANALYSIS",
      "GENERAL_QUESTION",
      "MONTHLY_SUMMARY",
    ])
    .optional()
    .nullable(),

  languageCode: z.enum(["en", "km"], {
    message: "Language must be either 'en' or 'km'.",
  }),

  templateStatus: z.enum(["ACTIVE", "DRAFT", "ARCHIVED", "INACTIVE"]).default("DRAFT"),

  isDefault: z.boolean().default(false),

  modelName: z.string().max(100).optional().nullable(),

  systemPrompt: z
    .string()
    .min(5, { message: "System prompt must be at least 5 characters long." }),

  userPromptTemplate: z
    .string()
    .min(5, { message: "User prompt template must be at least 5 characters long." }),

  temperature: z
    .number()
    .min(0, { message: "Temperature must be >= 0." })
    .max(2, { message: "Temperature must be <= 2." })
    .default(0),

  responseMimeType: z.string().default("application/json"),

  inputSchemaJson: jsonStringOrObjectSchema,
  outputSchemaJson: jsonStringOrObjectSchema,
});

export type PromptTemplateFormData = z.infer<typeof promptTemplateSchema>;

/**
 * Zod Schema for Creating Prompt Template Versions
 * (POST /api/v1/admin/ai/prompt-templates/{templateId}/versions)
 */
export const promptTemplateVersionSchema = z.object({
  templateKey: z
    .string()
    .min(1, { message: "Template key is required." })
    .max(150, { message: "Template key cannot exceed 150 characters." })
    .regex(TEMPLATE_KEY_REGEX, {
      message:
        "Template key may contain lowercase letters, numbers, '.', '_' and '-' only.",
    }),

  templateName: z
    .string()
    .min(1, { message: "Template name is required." })
    .max(200, { message: "Template name cannot exceed 200 characters." }),

  description: z.string().max(1000).optional().nullable(),

  taskType: z.enum([
    "CATEGORY_PREDICTION",
    "FINANCIAL_ASSISTANT",
    "SAVINGS_GOAL_ANALYSIS",
    "BUDGET_ADVICE",
  ]),

  templateScope: z.enum([
    "GENERAL_CONVERSATION",
    "SAVINGS_ANALYSIS",
    "SPENDING_ANALYSIS",
    "INCOME_ANALYSIS",
    "GENERAL_QUESTION",
    "MONTHLY_SUMMARY",
  ]).optional().nullable(),

  languageCode: z.enum(["en", "km"]),

  systemPrompt: z
    .string()
    .min(5, { message: "System prompt is required (minimum 5 characters)." }),

  userPromptTemplate: z
    .string()
    .min(5, { message: "User prompt template is required (minimum 5 characters)." }),

  versionNote: z.string().max(500).optional().nullable(),

  modelName: z.string().max(100).optional().nullable(),

  temperature: z.number().min(0).max(2).default(0),

  responseMimeType: z.string().default("application/json"),

  templateStatus: z.enum(["ACTIVE", "DRAFT", "ARCHIVED", "INACTIVE"]).default("DRAFT"),

  isDefault: z.boolean().default(false),

  inputSchemaJson: jsonStringOrObjectSchema,
  outputSchemaJson: jsonStringOrObjectSchema,
});

export type PromptTemplateVersionFormData = z.infer<typeof promptTemplateVersionSchema>;

/**
 * Zod Schema for Testing Prompt Templates
 * (POST /api/v1/admin/ai/prompt-templates/{templateId}/test)
 */
export const testPromptTemplateSchema = z.object({
  question: z
    .string()
    .min(1, { message: "User test question or message is required." }),

  currencyCode: z
    .string()
    .min(1, { message: "Currency code is required." })
    .max(10),

  financialContextJson: jsonStringOrObjectSchema,

  temperature: z
    .number()
    .min(0, { message: "Temperature must be between 0.0 and 2.0." })
    .max(2, { message: "Temperature must be between 0.0 and 2.0." })
    .default(0.3),

  maxTokens: z
    .number()
    .int()
    .min(1, { message: "Max tokens must be at least 1." })
    .max(32768, { message: "Max tokens cannot exceed 32,768." })
    .default(800),
});

export type TestPromptTemplateFormData = z.infer<typeof testPromptTemplateSchema>;

/**
 * Zod Schema for AI Platform Configuration
 */
export const aiConfigSchema = z.object({
  model: z.string().min(1, { message: "AI model selection is required." }),
  confidence: z
    .number()
    .min(0, { message: "Confidence must be at least 0%." })
    .max(100, { message: "Confidence cannot exceed 100%." }),
  aiEnabled: z.boolean().default(true),
  ocrEnabled: z.boolean().default(true),
  voiceEnabled: z.boolean().default(true),
  smartTagEnabled: z.boolean().default(true),
});

export type AIConfigFormData = z.infer<typeof aiConfigSchema>;
