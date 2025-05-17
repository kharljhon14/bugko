import { PoolClient } from 'pg';
import { DBProjectMember } from '../types/project_member';
import { DBProject } from '../types/projects';
import { DBUser } from '../types/auth';

export async function getProjectMember(client: PoolClient, projectID: number, userID: number) {
  const results = await client.query<DBProjectMember>(
    'SELECT * FROM project_members WHERE project_id = $1 AND user_id = $2',
    [projectID, userID]
  );

  return results.rows[0];
}

export async function getProjectMembers(client: PoolClient, projectID: number) {
  const results = await client.query<DBUser>(
    `
      SELECT u.* FROM project_members pm
      INNER JOIN users u ON pm.user_id = u.id
      WHERE pm.project_id = $1
    `,
    [projectID]
  );

  return results.rows;
}

export async function getMemberProjects(client: PoolClient, userID: number) {
  const results = await client.query<DBProject>(
    `
      SELECT p.*
      FROM project_members pm
      INNER JOIN projects p ON pm.project = p.id
      WHERE pm.user_id = $1
    `,
    [userID]
  );

  return results.rows;
}

export async function addProjectMember(client: PoolClient, projectID: number, userID: number) {
  const results = await client.query(
    'INSERT INTO project_members (project_id, user_id) VALUES ($1, $2) RETURNING *',
    [projectID, userID]
  );

  return results.rows[0];
}

export async function removeProjectMember(client: PoolClient, projectID: number, userID: number) {
  const results = await client.query(
    'DELETE FROM project_members WHERE project_id = $1 AND user_id = $2',
    [projectID, userID]
  );

  return results.rowCount;
}
