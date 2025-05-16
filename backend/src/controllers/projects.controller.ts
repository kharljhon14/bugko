import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { ProjectSchemaType } from '../schemas/projects.schema';
import {
  handleCreateNewProject,
  handleGetProjectById,
  handleGetProjectsByOwner
} from '../services/projects.service';
import { DatabaseError } from 'pg';
import { getUserByID } from '../data/auth.data';

export function createProjectHandler(fastify: FastifyInstance) {
  return async function (request: FastifyRequest, reply: FastifyReply) {
    const client = await fastify.pg.connect();
    try {
      const projectValues = request.body as ProjectSchemaType;
      const newProject = await handleCreateNewProject(client, projectValues);

      return reply.code(200).send({ data: newProject });
    } catch (error) {
      if (error instanceof DatabaseError) {
        switch (error.constraint) {
          case 'projects_owner_fkey':
            return reply.code(400).send({ error: 'owner does not exist' });

          case 'projects_name_key':
            return reply.code(400).send({ error: 'name already exsist' });

          default:
            return reply.code(500).send({ error: error.detail });
        }
      }

      return reply.code(500).send({ error: error });
    } finally {
      client.release();
    }
  };
}

export function getProjectByIdHandler(fastify: FastifyInstance) {
  return async function (request: FastifyRequest, reply: FastifyReply) {
    const client = await fastify.pg.connect();
    try {
      const { id } = request.params as { id: number };

      const project = await handleGetProjectById(client, Number(id));

      if (!project) {
        return reply.code(404).send({ error: `project with id ${id} does not exist` });
      }

      return reply.send({ data: project });
    } catch (error) {
      if (error instanceof DatabaseError) {
        return reply.code(500).send({ error: error.detail });
      }

      return reply.code(500).send({ error: error });
    } finally {
      client.release();
    }
  };
}

export function getProjectsByOwnerHandler(fastify: FastifyInstance) {
  return async function (request: FastifyRequest, reply: FastifyReply) {
    const client = await fastify.pg.connect();
    try {
      const { owner_id } = request.query as { owner_id: number };

      const owner = await getUserByID(client, owner_id);

      if (!owner) {
        return reply.code(404).send({ error: `owner with id ${owner_id} does not exist` });
      }
      const projects = await handleGetProjectsByOwner(client, Number(owner.id));

      return reply.send({ data: projects });
    } catch (error) {
      if (error instanceof DatabaseError) {
        return reply.code(500).send({ error: error.detail });
      }
      return reply.code(500).send({ error: error });
    } finally {
      client.release();
    }
  };
}
