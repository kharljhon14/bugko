import { z } from 'zod';

export const projectSchema = z.object({
  name: z
    .string({ message: 'Name is required' })
    .min(1, 'Name is required')
    .max(255, 'Name must not exceed 255 characters')
});

export type ProjectSchemaType = z.infer<typeof projectSchema>;
