import { FastifyInstance } from 'fastify';
import { isAuthenticated } from '../middlewares/auth';
import {
  createProjectHandler,
  getProjectByIdHandler,
  getProjectsByOwnerHandler
} from '../controllers/projects.controller';
import { validateSchema } from '../middlewares/validateSchema';
import { projectSchema } from '../schemas/projects.schema';

export default function projectsRoutes(fastify: FastifyInstance) {
  fastify.post('/', { preHandler: [validateSchema(projectSchema)] }, createProjectHandler(fastify));

  fastify.get(
    '/:id',
    {
      preHandler: [],
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
      preHandler: [],
      schema: {
        querystring: {
          type: 'object',
          properties: {
            owner_id: { type: 'number' }
          },
          required: ['owner_id']
        }
      }
    },
    getProjectsByOwnerHandler(fastify)
  );

  fastify.delete('/:id', { preHandler: [] }, async function () {});
}
