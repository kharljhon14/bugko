import { FastifyInstance } from 'fastify';
import { isAuthenticated } from '../middlewares/auth';

export default async function healthRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', isAuthenticated);
  fastify.get('/health', async function healthCheckHandler(_request, _reply) {
    return { status: 'ok' };
  });
}
