import { z, ZodObject } from 'zod/v4';

export function schemaValidator<T>(schema: ZodObject, body: T) {
  const result = schema.safeParse(body);

  if (!result.success) {
    return z.treeifyError(result.error);
  }
  return null;
}
