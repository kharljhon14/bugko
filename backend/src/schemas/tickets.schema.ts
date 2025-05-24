import { z } from 'zod/v4';

export const createTicketSchema = z
  .object({
    project_id: z.number().min(1),
    owner_id: z.number().min(1),
    assignee_id: z.number().min(1).optional(),
    title: z.string().min(1).max(255),
    description: z.string().max(50000).optional()
  })
  .strict();

export type CreateTicketSchemaType = z.infer<typeof createTicketSchema>;

export const updateTicketSchema = z
  .object({
    assignee_id: z.number().min(1).optional().nullable(),
    title: z.string().min(1).max(255).optional(),
    description: z.string().max(50000).optional(),
    status: z.enum(['open', 'in_progress', 'closed']).optional()
  })
  .strict();

export type UpdateTicketSchemaType = z.infer<typeof updateTicketSchema>;
