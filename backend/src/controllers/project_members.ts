import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { handleGetProjectMember } from '../services/project_members';
import { NotFoundError } from '../utils/error';

export function getProjectMemberHandler(fastify: FastifyInstance) {
  return async function (request: FastifyRequest, reply: FastifyReply) {
    const client = await fastify.pg.connect();
    const { project_id, user_id } = request.query as { project_id: number; user_id: number };

    try {
      const projectMember = await handleGetProjectMember(client, project_id, user_id);

      return reply.send({ data: projectMember });
    } catch (error) {
      if (error instanceof NotFoundError) {
        return reply.code(404).send({ error: error.message });
      }

      reply.code(500).send({ error });
    }
  };
}
