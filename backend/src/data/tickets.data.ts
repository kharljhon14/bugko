import { PoolClient } from 'pg';
import { DBTicket } from '../types/tickets';

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

export async function createTicket(client: PoolClient) {}
