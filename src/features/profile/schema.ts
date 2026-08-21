import { z } from "zod";

export const editProfileSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: "សូមបញ្ចូលនាមត្រកូល" })
    .max(50, { message: "នាមត្រកូលមិនអាចលើសពី ៥០ តួអក្សរឡើយ" }),
  lastName: z
    .string()
    .min(1, { message: "សូមបញ្ចូលនាមខ្លួន" })
    .max(50, { message: "នាមខ្លួនមិនអាចលើសពី ៥០ តួអក្សរឡើយ" }),
  displayName: z
    .string()
    .min(2, { message: "ឈ្មោះបង្ហាញត្រូវមានយ៉ាងហោចណាស់ ២ តួអក្សរ" })
    .max(60, { message: "ឈ្មោះបង្ហាញមិនអាចលើសពី ៦០ តួអក្សរឡើយ" }),
  email: z
    .string()
    .min(1, { message: "សូមបញ្ចូលអាសយដ្ឋានអ៊ីមែល" })
    .email({ message: "អាសយដ្ឋានអ៊ីមែលមិនត្រឹមត្រូវ" }),
  phoneNumber: z
    .string()
    .min(8, { message: "លេខទូរស័ព្ទត្រូវមានយ៉ាងហោចណាស់ ៨ ខ្ទង់" })
    .max(15, { message: "លេខទូរស័ព្ទមិនអាចលើសពី ១៥ ខ្ទង់" })
    .regex(/^[0-9+\s-]+$/, { message: "លេខទូរស័ព្ទត្រូវមានតែលេខ និងសញ្ញា + ឬ -" }),
  bio: z
    .string()
    .max(500, { message: "ជីវប្រវត្តិមិនអាចលើសពី ៥០០ តួអក្សរឡើយ" })
    .optional()
    .or(z.literal("")),
  location: z
    .string()
    .min(2, { message: "សូមបញ្ចូលទីតាំងរស់នៅ ឬអាសយដ្ឋាន" })
    .max(100, { message: "ទីតាំងមិនអាចលើសពី ១០០ តួអក្សរឡើយ" }),
  occupation: z
    .string()
    .min(1, { message: "សូមបញ្ចូលមុខរបរ" })
    .max(100, { message: "មុខរបរមិនអាចលើសពី ១០០ តួអក្សរឡើយ" }),
});

export type EditProfileFormValues = z.infer<typeof editProfileSchema>;

export const changePasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, { message: "ពាក្យសម្ងាត់ថ្មីត្រូវមានយ៉ាងហោចណាស់ ៨ តួអក្សរ" })
      .regex(/[A-Z]/, { message: "ពាក្យសម្ងាត់ថ្មីត្រូវមានអក្សរធំយ៉ាងហោចណាស់ ១" })
      .regex(/[0-9]/, { message: "ពាក្យសម្ងាត់ថ្មីត្រូវមានលេខយ៉ាងហោចណាស់ ១" }),
    confirmPassword: z
      .string()
      .min(1, { message: "សូមបញ្ជាក់ពាក្យសម្ងាត់ថ្មី" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "ពាក្យសម្ងាត់ថ្មី និងការបញ្ជាក់ពាក្យសម្ងាត់មិនត្រូវគ្នាឡើយ",
    path: ["confirmPassword"],
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export const currencySchema = z.object({
  currency: z.string().min(1, { message: "សូមជ្រើសរើសរូបិយប័ណ្ណដែលត្រឹមត្រូវ" }),
});

export type CurrencyFormValues = z.infer<typeof currencySchema>;

export const notificationSchema = z.object({
  email: z.boolean(),
  push: z.boolean(),
  securityAlerts: z.boolean(),
  productUpdates: z.boolean(),
  weeklyReport: z.boolean(),
  sound: z.boolean(),
});

export type NotificationFormValues = z.infer<typeof notificationSchema>;
