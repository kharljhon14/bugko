import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

export function createProjectHandler(fastify: FastifyInstance) {
  return async function (request: FastifyRequest, reply: FastifyReply) {
    const client = await fastify.pg.connect();
    try {
      console.log(request.body);
    } catch (error) {
      return reply.code(500).send({ error: error });
    } finally {
      client.release();
    }
  };
}
