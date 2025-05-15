import { ZodSchema } from 'zod';

export function schemaValidator<T>(schema: ZodSchema, body: T) {
  const result = schema.safeParse(body);
  if (!result.success) {
    return result.error.flatten().fieldErrors;
  }
  return null;
}
