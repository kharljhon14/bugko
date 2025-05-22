import { FastifyInstance } from 'fastify';
import { isAuthenticated } from '../middlewares/auth';
import { getTicketByIDHandler } from '../controllers/tickets.controller';

export default function ticketsRoutes(fastify: FastifyInstance) {
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
}
