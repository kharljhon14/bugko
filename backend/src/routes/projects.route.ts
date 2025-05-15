import { FastifyInstance } from 'fastify';
import { isAuthenticated } from '../middlewares/auth';
import { createProjectHandler } from '../controllers/projects.controller';
import { validateSchema } from '../middlewares/validateSchema';
import { createProjectSchema } from '../schemas/projects.schema';

export default function projectsRoutes(fastify: FastifyInstance) {
  fastify.post(
    '/',
    { preHandler: [validateSchema(createProjectSchema)] },
    createProjectHandler(fastify)
  );

  fastify.get('/:id', { preHandler: [isAuthenticated] }, async function () {});
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
