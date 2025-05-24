import { PoolClient } from 'pg';
import { DBTicket } from '../types/tickets';
import { CreateTicketSchemaType, UpdateTicketSchemaType } from '../schemas/tickets.schema';

export async function getTicketByID(client: PoolClient, id: number) {
  const results = await client.query<DBTicket>(
    `
        SELECT t.*, u.name AS owner_name, a.name AS assignee_name 
        FROM tickets t
        INNER JOIN users u ON t.owner_id = u.id
        LEFT JOIN users a ON t.assignee_id = a.id
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
        FROM tickets t
        INNER JOIN users u ON t.owner_id = u.id
        LEFT JOIN users a ON t.assignee_id = a.id
        WHERE t.project_id = $1
        ORDER BY t.updated_at DESC
    `,
    [projectID]
  );

  return results.rows;
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

export async function updateTicket(client: PoolClient, id: number, ticket: UpdateTicketSchemaType) {
  const fields = Object.keys(ticket);
  const values = Object.values(ticket);

  const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(`, `);

  const results = await client.query(
    `
      UPDATE tickets 
      SET 
      ${setClause},
      updated_at = now()
      WHERE id = $${fields.length + 1}
      RETURNING *;
    `,
    [...values, id]
  );

  return results.rows[0];
}

export async function deleteTicket(client: PoolClient, id: number) {
  const results = await client.query(
    `
      DELETE FROM tickets WHERE id = $1
    `,
    [id]
  );

  return results.rowCount;
}
