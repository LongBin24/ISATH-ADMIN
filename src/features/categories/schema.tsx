import {z} from 'zod';

export const categorySchema = z.object({
    name:z.string().min(1,'សូមបញ្ចូលឈ្មោះប្រភេទចំណាយ'),
    icon:z.string().min(1,'សូម​ជ្រើសរើសរូបតំណាង'),
    totalBudget: z.number().min(0, 'ថវិកាត្រូវតែធំជាង ឬស្មើ 0'),
    color: z.string().optional(),

});

export type CategoryFormValues = z.infer<typeof categorySchema>;