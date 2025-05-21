import { PoolClient } from 'pg';
import { DBTicket } from '../types/tickets';
import { CreateTicketSchemaType } from '../schemas/tickets.schema';

export async function getTicketByID(client: PoolClient, id: number) {
  const results = await client.query<DBTicket>(
    `
        SELECT t.*, u.name AS owner_name, a.name AS assignee_name 
        INNER JOIN users u ON t.owner_id = u.id
        INNER JOIN users a ON t.assignee_id = a.id
        FROM tickets t
        WHERE t.id = $1
    `,
    [id]
  );

  return results.rows[0];
}

export async function getAllTicketsByProject(client: PoolClient, projectID: number) {
  const results = await client.query<DBTicket[]>(
    `
        SELECT t.*, u.name AS owner_name, a.name AS assignee_name 
        INNER JOIN users u ON t.owner_id = u.id
        INNER JOIN users a ON t.assignee_id = a.id
        FROM tickets t
        WHERE t.project_id = $1
    `,
    [projectID]
  );

  results.rows;
}

export async function createTicket(client: PoolClient, ticket: CreateTicketSchemaType) {
  const results = await client.query(
    `
        INSERT INTO tickets 
        (project_id, owner_id, assignee_id, title, description)
        VALUES 
        ($1, $2, $3, $4, $5)
        RETURNING  *;
    `,
    [ticket.project_id, ticket.owner_id, ticket.assignee_id, ticket.title, ticket.description]
  );

  return results.rows[0];
}
