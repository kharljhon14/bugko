import { PoolClient } from 'pg';
import { CreateProjectSchemaType } from '../schemas/projects.schema';
import { DBProject } from '../types/projects';

// Create Project
export async function createProject(
  client: PoolClient,
  createProjectSchema: CreateProjectSchemaType
): Promise<DBProject> {
  const results = await client.query<DBProject>(
    'INSERT INTO projects (owner, name) VALUES ($1, $2) RETURNING *',
    [createProjectSchema.owner, createProjectSchema.name]
  );
  return results.rows[0];
}

// Get Project By ID
export async function getProjectById(client: PoolClient, id: number): Promise<DBProject> {
  const results = await client.query<DBProject>('SELECT * FROM projects WHERE id = $1', [id]);

  return results.rows[0];
}

// Get Projects By Owner
export async function getProjectsByOwner(
  client: PoolClient,
  ownerId: number
): Promise<DBProject[]> {
  const results = await client.query<DBProject>('SELECT * FROM projects WHERE owner = $1', [
    ownerId
  ]);

  return results.rows;
}

// Delete Project
export async function deleteProject(client: PoolClient, id: number) {
  const results = await client.query<DBProject>('DELETE FROM projects WHERE id = $1', [id]);

  if (results.rowCount === 0) {
    throw new Error(`No project found with id: ${id}`);
  }
}
