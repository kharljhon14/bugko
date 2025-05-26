import { z } from 'zod';

export const addMemberSchema = z.object({
  email: z.string({ message: 'Email is required' }).email({ message: 'Must be a valid email' })
});

export type AddMemberSchemaType = z.infer<typeof addMemberSchema>;
