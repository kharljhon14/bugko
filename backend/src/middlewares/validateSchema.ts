import { FastifyRequest, FastifyReply } from 'fastify';

export async function validateSchmea(request: FastifyRequest, reply: FastifyReply) {
  if (!request.isAuthenticated()) {
    return reply.code(401).send({ message: 'Unauthorized' });
  }
}
