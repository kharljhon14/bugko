import { FastifyRequest, FastifyReply } from 'fastify';
import { ZodObject } from 'zod/v4';
import { schemaValidator } from '../utils/schema';

export function validateSchema(schema: ZodObject) {
  return async function (request: FastifyRequest, reply: FastifyReply) {
    const { body } = request;

    const errors = schemaValidator(schema, body);
    if (errors) {
      return reply.code(400).send({ ...errors });
    }
  };
}
