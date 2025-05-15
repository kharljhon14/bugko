import { FastifyInstance } from 'fastify';
import { isAuthenticated } from '../middlewares/auth';
import { createProjectHandler, getProjectByIdHandler } from '../controllers/projects.controller';
import { validateSchema } from '../middlewares/validateSchema';
import { createProjectSchema } from '../schemas/projects.schema';
import { number } from 'zod';

export default function projectsRoutes(fastify: FastifyInstance) {
  fastify.post(
    '/',
    { preHandler: [validateSchema(createProjectSchema)] },
    createProjectHandler(fastify)
  );

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
      preHandler: [isAuthenticated],
      schema: {
        querystring: {
          type: 'object',
          properties: {
            name: { type: 'string' }
          },
          required: ['name']
        }
      }
    },
    async function () {}
  );

  fastify.delete('/:id', { preHandler: [isAuthenticated] }, async function () {});
}
