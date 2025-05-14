import { FastifyReply, FastifyRequest } from 'fastify';

export async function isAuthenticated(request: FastifyRequest, reply: FastifyReply) {
  if (!request.isAuthenticated()) {
    return reply.code(401).send({ message: 'Unauthorized' });
  }
}
