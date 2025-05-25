import { PoolClient } from 'pg';
import { ProjectSchemaType } from '../schemas/projects.schema';
import { DBProject } from '../types/projects';
import { TotalCount } from '../types/metadata';

// Create Project
export async function createProject(
  client: PoolClient,
  createProjectSchema: ProjectSchemaType,
  userID: number
): Promise<DBProject> {
  const results = await client.query<DBProject>(
    'INSERT INTO projects (owner, name) VALUES ($1, $2) RETURNING *',
    [userID, createProjectSchema.name]
  );
  return results.rows[0];
}

// Get Project By ID
export async function getProjectById(
  client: PoolClient,
  id: number
): Promise<DBProject | undefined> {
  const results = await client.query<DBProject>('SELECT * FROM projects WHERE id = $1', [id]);

  return results.rows[0];
}

// Get Projects By Owner
export async function getProjectsByOwner(
  client: PoolClient,
  ownerId: number,
  limit: number,
  offset: number
) {
  const results = await client.query<DBProject & TotalCount>(
    `
      SELECT p.id, p.name, p.created_at, p.updated_at, u.id AS owner_id ,u.name AS owner_name,
      COUNT(*) OVER() AS total_count
      FROM projects p
      INNER JOIN users u ON p.owner = u.id
      WHERE p.owner = $1
      ORDER BY p.updated_at DESC
      LIMIT $2 OFFSET $3
    `,
    [ownerId, limit, offset]
  );

  return results.rows;
}

// Update Project
export async function updateProject(
  client: PoolClient,
  id: number,
  projectSchema: ProjectSchemaType,
  userID: number
) {
  const results = await client.query<DBProject>(
    `UPDATE projects SET name = $1, updated_at = now() WHERE id = $2 AND owner = $3 RETURNING *`,
    [projectSchema.name, id, userID]
  );

  return results.rows[0];
}

// Delete Project
export async function deleteProject(client: PoolClient, id: number, userID: number) {
  const results = await client.query<DBProject>(
    'DELETE FROM projects WHERE id = $1 AND owner = $2',
    [id, userID]
  );

  return results.rowCount;
}
