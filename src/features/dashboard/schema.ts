import * as z from "zod";

const role = ["admin","user"] as const;
export const userSchema = z.object({
    name: z.string().min(2, { message: "ឈ្មោះត្រូវមានយ៉ាងតិច ២ តួអក្សរ" }),
    email: z.string().email({ message: "អ៊ីមែលមិនត្រឹមត្រូវ" }),
   role: z.enum(role, { message: "សូមជ្រើសរើសតួនាទី" }), 
});

export type UserFormValues = z.infer<typeof userSchema>;
