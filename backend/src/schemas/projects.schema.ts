import { z } from 'zod';

export const projectSchema = z.object({
  name: z.string().min(1, 'name is required').max(255, 'name must not exceed 255 characters')
});

export type ProjectSchemaType = z.infer<typeof projectSchema>;
