import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { CreateProjectSchemaType } from '../schemas/projects.schema';
import { handleCreateNewProject } from '../services/projects.service';

export function createProjectHandler(fastify: FastifyInstance) {
  return async function (request: FastifyRequest, reply: FastifyReply) {
    const client = await fastify.pg.connect();
    try {
      const projectValues = request.body as CreateProjectSchemaType;
      const newProject = await handleCreateNewProject(client, projectValues);
      return reply.code(200).send({ data: newProject });
    } catch (error) {
      return reply.code(500).send({ error: error });
    } finally {
      client.release();
    }
  };
}
