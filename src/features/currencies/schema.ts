import { z } from "zod";

export const transactionSchema = z.object({
  title: z
    .string()
    .min(1, { message: "សូមបញ្ចូលបរិយាយប្រតិបត្តិការ" })
    .max(100, { message: "បរិយាយមិនអាចលើសពី ១០០ តួអក្សរឡើយ" }),
  amount: z
    .number({ message: "សូមបញ្ចូលចំនួនទឹកប្រាក់ជាលេខ" })
    .refine((val) => !isNaN(val) && val > 0, { message: "ចំនួនទឹកប្រាក់ត្រូវតែធំជាង ០" }),
  currency: z.string().min(1, { message: "សូមជ្រើសរើសរូបិយប័ណ្ណ" }),
  type: z.enum(["INCOME", "EXPENSE"]),
  category: z.string().min(1, { message: "សូមជ្រើសរើសប្រភេទ" }),
});

export type TransactionFormData = z.infer<typeof transactionSchema>;

export const converterSchema = z.object({
  amount: z
    .number({ message: "សូមបញ្ចូលចំនួនទឹកប្រាក់" })
    .refine((val) => !isNaN(val) && val > 0, { message: "ចំនួនទឹកប្រាក់ត្រូវតែធំជាង ០" }),
  fromCurrency: z.string().min(1, { message: "សូមជ្រើសរើសរូបិយប័ណ្ណដើម" }),
  toCurrency: z.string().min(1, { message: "សូមជ្រើសរើសរូបិយប័ណ្ណគោលដៅ" }),
});

export type ConverterFormData = z.infer<typeof converterSchema>;
