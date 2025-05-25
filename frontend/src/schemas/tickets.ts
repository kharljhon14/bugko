import { z } from 'zod';

export const ticketSchema = z
  .object({
    assignee_id: z.number().min(1).optional(),
    title: z.string({ message: 'Title is required' }).trim().min(1, 'Title is required').max(255),
    description: z.string().trim().max(50000).default('').optional(),
    status: z.enum(['open', 'in_progress', 'closed']).optional(),
    priority: z.enum(['low', 'medium', 'high']).optional()
  })
  .strict();

export type TicketSchemaType = z.infer<typeof ticketSchema>;
