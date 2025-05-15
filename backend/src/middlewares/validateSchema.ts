import { FastifyRequest, FastifyReply } from 'fastify';
import { ZodSchema } from 'zod';
import { schemaValidator } from '../utils/schema';

export function validateSchema(schema: ZodSchema) {
  return async function (request: FastifyRequest, reply: FastifyReply) {
    const { body } = request;

    const errors = schemaValidator(schema, body);
    if (errors) {
      return reply.code(400).send({ errors });
    }
  };
}
