import { PoolClient } from 'pg';
import {
  createTicket,
  deleteTicket,
  getAllTicketsByProject,
  getTicketByID,
  updateTicket
} from '../data/tickets.data';
import { NotFoundError, UnauthorizedError } from '../utils/error';
import { getProjectById } from '../data/projects.data';
import { CreateTicketSchemaType, UpdateTicketSchemaType } from '../schemas/tickets.schema';
import { getProjectMember } from '../data/project_members';

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

export async function handleCreateTicket(
  client: PoolClient,
  ownerID: string,
  ticket: CreateTicketSchemaType
) {
  const projectMember = await getProjectMember(client, Number(ticket.project_id), Number(ownerID));

  if (!projectMember) {
    throw new UnauthorizedError(`user with id ${ownerID} is not authorized to perform this action`);
  }

  const project = await getProjectById(client, Number(ticket.project_id));

  if (!project) {
    throw new NotFoundError(`project with id ${ticket.project_id} not found`);
  }

  const newticket = await createTicket(client, Number(ownerID), ticket);

  return newticket;
}

export async function handleUpdateTicket(
  client: PoolClient,
  ticketID: number,
  ticket: UpdateTicketSchemaType,
  userID: number
) {
  const foundTicket = await getTicketByID(client, ticketID);

  if (!foundTicket) {
    throw new NotFoundError(`ticket with id ${ticketID} not found`);
  }

  const projectMember = await getProjectMember(
    client,
    Number(foundTicket.project_id),
    Number(userID)
  );

  if (!projectMember) {
    throw new UnauthorizedError(`user with id ${userID} is not authorized to perform this action`);
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
