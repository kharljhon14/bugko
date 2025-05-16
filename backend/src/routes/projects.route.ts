import { FastifyInstance } from 'fastify';
import { isAuthenticated } from '../middlewares/auth';
import { createProjectHandler, getProjectByIdHandler } from '../controllers/projects.controller';
import { validateSchema } from '../middlewares/validateSchema';
import { projectSchema } from '../schemas/projects.schema';

export default function projectsRoutes(fastify: FastifyInstance) {
  fastify.post('/', { preHandler: [validateSchema(projectSchema)] }, createProjectHandler(fastify));

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
