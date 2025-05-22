import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { DatabaseError } from 'pg';
import { NotFoundError, UnauthorizedError } from '../utils/error';
import { handleCreateTicket, handleGetTicketByID } from '../services/tickets.services';
import { CreateTicketSchemaType } from '../schemas/tickets.schema';

export function getTicketByIDHandler(fastify: FastifyInstance) {
  return async function (request: FastifyRequest, reply: FastifyReply) {
    const client = await fastify.pg.connect();

    try {
      const { id } = request.params as { id: string };
      const ticket = await handleGetTicketByID(client, Number(id));

      return reply.send({ data: ticket });
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

export function createTicketHandler(fastify: FastifyInstance) {
  return async function (request: FastifyRequest, reply: FastifyReply) {
    const client = await fastify.pg.connect();
    try {
      const body = request.body as CreateTicketSchemaType;

      const newTicket = await handleCreateTicket(client, body);

      return reply.send({ data: newTicket });
    } catch (error) {
      if (error instanceof NotFoundError) {
        return reply.code(404).send({ error: error.message });
      }

      if (error instanceof DatabaseError) {
        return reply.code(500).send({ error: error.detail });
      }
      if (error instanceof UnauthorizedError) {
        return reply.code(401).send({ error: error.message });
      }

      if (error instanceof Error) {
        return reply.code(500).send({ error: error.message });
      }
    } finally {
      client.release();
    }
  };
}
