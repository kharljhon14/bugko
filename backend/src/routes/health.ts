import { FastifyInstance } from 'fastify';

export default async function healthRoutes(fastify: FastifyInstance) {
  fastify.get('/health', async function healthCheckHandler(_request, _reply) {
    return { status: 'ok' };
  });
}
