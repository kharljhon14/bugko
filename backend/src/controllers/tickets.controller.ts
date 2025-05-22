import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { DatabaseError } from 'pg';
import { NotFoundError } from '../utils/error';
import { handleGetTicketByID } from '../services/tickets.services';

export function getTicketByIDHandler(fastify: FastifyInstance) {
  return async function (request: FastifyRequest, reply: FastifyReply) {
    const client = await fastify.pg.connect();

    try {
      const { id } = request.params as { id: string };
      const ticket = await handleGetTicketByID(client, Number(id));

      return reply.send({ data: ticket });
    } catch (error) {
      console.error(error);
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
