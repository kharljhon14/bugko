import { z } from 'zod';

export const createTicketSchema = z.object({
  project_id: z.string().min(1),
  owner_id: z.string().min(1),
  assignee_id: z.string().min(1).optional(),
  title: z.string().min(1).max(255),
  description: z.string().max(50000).optional()
});

export type CreateTicketSchemaType = z.infer<typeof createTicketSchema>;

export const updateTicketSchema = z.object({
  assignee_id: z.string().min(1).optional(),
  title: z.string().min(1).max(255),
  description: z.string().max(50000).optional(),
  status: z.enum(['open', 'in_progress', 'closed'])
});

export type UpdateTicketSchemaType = z.infer<typeof updateTicketSchema>;
