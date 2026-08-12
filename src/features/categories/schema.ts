import { z } from "zod";

export const categorySchema = z
  .object({
    name: z.string().trim().min(1, "សូមបញ្ចូលឈ្មោះប្រភេទ។").max(100),
    icon: z.string().min(1, "សូមជ្រើសរើសរូបតំណាង។").max(100),
    color: z
      .string()
      .max(20)
      .regex(
        /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/,
        "សូមជ្រើសរើសពណ៌ត្រឹមត្រូវ។",
      ),
    type: z.enum(["expense", "income"]),
    parentId: z.string().uuid("លេខសម្គាល់ប្រភេទមេមិនត្រឹមត្រូវ។").nullable(),
    categoryKey: z
      .string()
      .trim()
      .max(100)
      .regex(
        /^[A-Z][A-Z0-9_]*$/,
        "លេខកូដត្រូវចាប់ផ្តើមដោយអក្សរធំ ហើយប្រើតែអក្សរធំ លេខ ឬសញ្ញាគូសក្រោម។",
      )
      .optional()
      .or(z.literal("")),
    systemCategory: z.boolean(),
    defaultCategory: z.boolean(),
  })
  .refine((data) => !data.defaultCategory || data.systemCategory, {
    message: "មានតែប្រភេទប្រព័ន្ធប៉ុណ្ណោះដែលអាចកំណត់ជាប្រភេទលំនាំដើម។",
    path: ["defaultCategory"],
  });

export type CategoryFormValues = z.infer<typeof categorySchema>;
