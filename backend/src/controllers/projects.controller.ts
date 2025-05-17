import { FastifyInstance, FastifyReply, FastifyRequest, PassportUser } from 'fastify';
import { ProjectSchemaType } from '../schemas/projects.schema';
import {
  handleCreateNewProject,
  handleDeleteProject,
  handleGetProjectById,
  handleGetProjectsByOwner,
  handleUpdateProject
} from '../services/projects.service';
import { DatabaseError } from 'pg';
import { NotFoundError } from '../utils/error';
import { UpdatedPassportUser } from '../types/auth';

export function createProjectHandler(fastify: FastifyInstance) {
  return async function (request: FastifyRequest, reply: FastifyReply) {
    const client = await fastify.pg.connect();
    try {
      const user = request.user as UpdatedPassportUser;

      const projectValues = request.body as ProjectSchemaType;
      const newProject = await handleCreateNewProject(client, projectValues, Number(user.user_id));

      return reply.code(200).send({ data: newProject });
    } catch (error) {
      if (error instanceof DatabaseError) {
        switch (error.constraint) {
          case 'projects_owner_fkey':
            return reply.code(400).send({ error: 'owner does not exist' });

          case 'projects_name_key':
            return reply.code(400).send({ error: 'name already exsist' });

          default:
            return reply.code(500).send({ error: error });
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

      return reply.send({ data: project });
    } catch (error) {
      if (error instanceof NotFoundError) {
        return reply.code(404).send({ error: error.message });
      }

      if (error instanceof DatabaseError) {
        return reply.code(500).send({ error: error.detail });
      }

      if (error instanceof Error) {
        return reply.code(500).send({ error: error.message });
      }
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

      const projects = await handleGetProjectsByOwner(client, Number(owner_id));

      return reply.send({ data: projects });
    } catch (error) {
      if (error instanceof NotFoundError) {
        return reply.code(404).send({ error: error.message });
      }

      if (error instanceof DatabaseError) {
        return reply.code(500).send({ error: error.detail });
      }

      if (error instanceof Error) {
        return reply.code(500).send({ error: error });
      }
    } finally {
      client.release();
    }
  };
}

export function updateProjectHandler(fastify: FastifyInstance) {
  return async function (request: FastifyRequest, reply: FastifyReply) {
    const client = await fastify.pg.connect();
    try {
      const { id } = request.params as { id: number };
      const projectValues = request.body as ProjectSchemaType;
      const user = request.user as UpdatedPassportUser;

      const updatedProject = await handleUpdateProject(
        client,
        Number(id),
        projectValues,
        Number(user.user_id)
      );

      return reply.send({ data: updatedProject });
    } catch (error) {
      if (error instanceof NotFoundError) {
        return reply.code(404).send({ error: error.message });
      }

      if (error instanceof DatabaseError) {
        return reply.code(500).send({ error: error.detail });
      }

      if (error instanceof Error) {
        return reply.code(500).send({ error: error.message });
      }
    } finally {
      client.release();
    }
  };
}

export function deleteProjectHandler(fastify: FastifyInstance) {
  return async function (request: FastifyRequest, reply: FastifyReply) {
    const client = await fastify.pg.connect();
    try {
      const { id } = request.params as { id: number };
      const user = request.user as UpdatedPassportUser;

      await handleDeleteProject(client, Number(id), Number(user.user_id));

      return reply.send({ message: `project with ID ${id} is deleted` });
    } catch (error) {
      if (error instanceof NotFoundError) {
        return reply.code(404).send({ error: error.message });
      }

      if (error instanceof DatabaseError) {
        return reply.code(500).send({ error: error.detail });
      }

      if (error instanceof Error) {
        return reply.code(500).send({ error: error.message });
      }
    } finally {
      client.release();
    }
  };
}
