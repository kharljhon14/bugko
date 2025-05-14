import { z } from 'zod';

export const createSSOSchema = z.object({
  user_id: z.number().min(1),
  provider: z.enum(['google', 'github']),
  provider_id: z.string().length(21, 'provider_id must be 21 characters')
});

export type CreateSSOSchemaType = z.infer<typeof createSSOSchema>;
