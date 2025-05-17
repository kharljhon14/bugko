import { z } from 'zod';

export const addProjectMemberSchema = z.object({
  user_id: z.number().min(1),
  project_id: z.number().min(1)
});

export type AddProjectMemberSchemaType = z.infer<typeof addProjectMemberSchema>;
