import { FastifyInstance } from 'fastify';
import { isAuthenticated } from '../middlewares/auth';
import {
  createTicketHandler,
  deleteTicketHandler,
  getAllTicketsByAssigneeHandler,
  getAllTicketsByProjectHandler,
  getTicketByIDHandler,
  updatedTicketHandler
} from '../controllers/tickets.controller';

import { createTicketSchema, updateTicketSchema } from '../schemas/tickets.schema';
import { validateSchema } from '../middlewares/validateSchema';

export default function ticketsRoutes(fastify: FastifyInstance) {
  fastify.post(
    '/',
    {
      preHandler: [isAuthenticated, validateSchema(createTicketSchema)]
    },
    createTicketHandler(fastify)
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
    getTicketByIDHandler(fastify)
  );

  fastify.get(
    '/',
    {
      preHandler: [isAuthenticated],
      schema: {
        querystring: {
          type: 'object',
          properties: {
            project_id: { type: 'number' },
            page: { type: 'number', minimum: 1 }
          },
          required: ['project_id']
        }
      }
    },
    getAllTicketsByProjectHandler(fastify)
  );

  fastify.get(
    '/user',
    {
      preHandler: [isAuthenticated],
      schema: {
        querystring: {
          type: 'object',
          properties: {
            page: { type: 'number', minimum: 1 }
          }
        }
      }
    },
    getAllTicketsByAssigneeHandler(fastify)
  );

  fastify.patch(
    '/:id',
    {
      preHandler: [isAuthenticated, validateSchema(updateTicketSchema)],
      schema: {
        params: {
          type: 'object',
          properties: {
            id: { type: 'number' }
          }
        }
      }
    },
    updatedTicketHandler(fastify)
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
    deleteTicketHandler(fastify)
  );
}
