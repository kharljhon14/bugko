import { FastifyInstance } from 'fastify';
import { isAuthenticated } from '../middlewares/auth';
import {
  createTicketHandler,
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
}
