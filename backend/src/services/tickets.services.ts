import { PoolClient } from 'pg';
import {
  createTicket,
  deleteTicket,
  getAllTicketsByProject,
  getTicketByID,
  updateTicket
} from '../data/tickets.data';
import { NotFoundError } from '../utils/error';
import { getProjectById } from '../data/projects.data';
import { CreateTicketSchemaType, UpdateTicketSchemaType } from '../schemas/tickets.schema';

export async function handleGetTicketByID(client: PoolClient, id: number) {
  const ticket = await getTicketByID(client, id);

  if (!ticket) {
    throw new NotFoundError(`ticket with id ${id} not found`);
  }

  return ticket;
}

export async function handleGetAllTicketByProject(client: PoolClient, id: number) {
  const project = await getProjectById(client, id);

  if (!project) {
    throw new NotFoundError(`project with id ${id} not found`);
  }

  const tickets = await getAllTicketsByProject(client, id);

  return tickets;
}

export async function handleCreateTicket(client: PoolClient, ticket: CreateTicketSchemaType) {
  const newticket = await createTicket(client, ticket);

  return newticket;
}

export async function handleUpdateTicket(
  client: PoolClient,
  ticketID: number,
  ticket: UpdateTicketSchemaType
) {
  const foundTicket = await getTicketByID(client, ticketID);

  if (!foundTicket) {
    throw new NotFoundError(`ticket with id ${ticketID} not found`);
  }

  const updatedTicket = await updateTicket(client, ticketID, ticket);

  return updatedTicket;
}

export async function handleDeleteTicket(client: PoolClient, id: number) {
  const rowCount = await deleteTicket(client, id);

  if (rowCount === 0) {
    throw new NotFoundError(`ticket with id ${id} not found`);
  }
}
