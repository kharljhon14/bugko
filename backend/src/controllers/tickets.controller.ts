import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { DatabaseError } from 'pg';
import { NotFoundError, UnauthorizedError } from '../utils/error';
import {
  handleCreateTicket,
  handleDeleteTicket,
  handleGetAllTicketByAssignee,
  handleGetAllTicketByProject,
  handleGetTicketByID,
  handleUpdateTicket
} from '../services/tickets.services';
import { CreateTicketSchemaType, UpdateTicketSchemaType } from '../schemas/tickets.schema';
import { UpdatedPassportUser } from '../types/auth';

export function getTicketByIDHandler(fastify: FastifyInstance) {
  return async function (request: FastifyRequest, reply: FastifyReply) {
    const client = await fastify.pg.connect();

    try {
      const { id } = request.params as { id: number };
      const ticket = await handleGetTicketByID(client, id);

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

export function getAllTicketsByProjectHandler(fastify: FastifyInstance) {
  return async function (request: FastifyRequest, reply: FastifyReply) {
    const client = await fastify.pg.connect();

    try {
      const { project_id, page } = request.query as { project_id: number; page: number };

      const { tickets, metadata } = await handleGetAllTicketByProject(
        client,
        Number(project_id),
        page ?? 1
      );

      return reply.send({ data: tickets, _metadata: metadata });
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

export function getAllTicketsByAssigneeHandler(fastify: FastifyInstance) {
  return async function (request: FastifyRequest, reply: FastifyReply) {
    const client = await fastify.pg.connect();

    try {
      const { page } = request.query as { project_id: number; page: number };
      const user = request.user as UpdatedPassportUser;

      const { tickets, metadata } = await handleGetAllTicketByAssignee(
        client,
        Number(user.user_id),
        page ?? 1
      );

      return reply.send({ data: tickets, _metadata: metadata });
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
      const user = request.user as UpdatedPassportUser;
      const body = request.body as CreateTicketSchemaType;

      const newTicket = await handleCreateTicket(client, user.user_id, body);

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

export function updatedTicketHandler(fastify: FastifyInstance) {
  return async function (request: FastifyRequest, reply: FastifyReply) {
    const client = await fastify.pg.connect();
    try {
      const user = request.user as UpdatedPassportUser;
      const { id } = request.params as { id: number };
      const body = request.body as UpdateTicketSchemaType;

      if (Object.keys(body).length === 0) {
        return reply.code(400).send({ error: 'body must not be empty' });
      }

      const updatedTicket = await handleUpdateTicket(client, id, body, Number(user.user_id));

      return reply.send({ data: updatedTicket });
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

export function deleteTicketHandler(fastify: FastifyInstance) {
  return async function (request: FastifyRequest, reply: FastifyReply) {
    const client = await fastify.pg.connect();
    try {
      const { id } = request.params as { id: number };

      await handleDeleteTicket(client, id);

      return reply.send({ message: `ticket with id ${id} is deleted` });
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
