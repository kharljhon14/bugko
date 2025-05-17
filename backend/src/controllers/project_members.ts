import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { handleAddProjectMember, handleGetProjectMember } from '../services/project_members';
import { NotFoundError, UnauthorizedError } from '../utils/error';
import { AddProjectMemberSchemaType } from '../schemas/project_member.schema';
import { UpdatedPassportUser } from '../types/auth';
import { DatabaseError } from 'pg';

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

export function addProjectMemberHandler(fastify: FastifyInstance) {
  return async function (request: FastifyRequest, reply: FastifyReply) {
    const client = await fastify.pg.connect();
    const { project_id, user_id } = request.body as AddProjectMemberSchemaType;
    const user = request.user as UpdatedPassportUser;

    try {
      const projectMember = await handleAddProjectMember(
        client,
        Number(user.user_id),
        project_id,
        user_id
      );

      return reply.send({ data: projectMember });
    } catch (error) {
      if (error instanceof NotFoundError) {
        return reply.code(404).send({ error: error.message });
      }

      if (error instanceof UnauthorizedError) {
        return reply.code(401).send({ error: error.message });
      }

      if (error instanceof DatabaseError) {
        switch (error.constraint) {
          case 'project_and_user_unique':
            return reply.code(422).send({ error: error.detail });
        }
        return reply.code(500).send({ error: error.detail });
      }

      reply.code(500).send({ error });
    }
  };
}
