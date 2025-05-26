import { FastifyInstance } from 'fastify';
import { isAuthenticated } from '../middlewares/auth';
import {
  createProjectHandler,
  deleteProjectHandler,
  getProjectByIdHandler,
  getProjectsByIDHandler,
  getProjectsByOwnerHandler,
  updateProjectHandler
} from '../controllers/projects.controller';
import { validateSchema } from '../middlewares/validateSchema';
import { projectSchema } from '../schemas/projects.schema';

export default function projectsRoutes(fastify: FastifyInstance) {
  fastify.post(
    '/',
    { preHandler: [isAuthenticated, validateSchema(projectSchema)] },
    createProjectHandler(fastify)
  );

  fastify.get(
    '/:id',
    {
      preHandler: [isAuthenticated],
      schema: {
        params: {
          type: 'object',
          properties: {
            id: { type: 'number' }
          }
        }
      }
    },
    getProjectByIdHandler(fastify)
  );
  fastify.get(
    '/',
    {
      preHandler: [isAuthenticated],
      schema: {
        querystring: {
          type: 'object',
          properties: {
            owner_id: { type: 'number' },
            page: { type: 'number', minimum: 1 }
          },
          required: ['owner_id']
        }
      }
    },
    getProjectsByOwnerHandler(fastify)
  );

  fastify.get(
    '/users',
    {
      preHandler: [isAuthenticated],
      schema: {
        querystring: {
          type: 'object',
          properties: {
            user_id: { type: 'number' },
            page: { type: 'number', minimum: 1 }
          },
          required: ['user_id']
        }
      }
    },
    getProjectsByIDHandler(fastify)
  );

  fastify.patch(
    '/:id',
    {
      preHandler: [isAuthenticated],
      schema: {
        params: {
          type: 'object',
          properties: {
            id: { type: 'number' }
          }
        }
      }
    },
    updateProjectHandler(fastify)
  );

  fastify.delete(
    '/:id',
    {
      preHandler: [isAuthenticated],
      schema: {
        params: {
          type: 'object',
          properties: {
            id: { type: 'number' }
          }
        }
      }
    },
    deleteProjectHandler(fastify)
  );
}
