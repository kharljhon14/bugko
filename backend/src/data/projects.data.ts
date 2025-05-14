import { PoolClient } from 'pg';
import { CreateProjectSchemaType } from '../schemas/projects.schema';
import { DBProject } from '../types/projects';

// Create Project
async function createProject(
  client: PoolClient,
  createProjectSchema: CreateProjectSchemaType
): Promise<DBProject> {
  try {
    const results = await client.query<DBProject>(
      'INSERT INTO projects (owner, name) VALUES ($1, $2)',
      [createProjectSchema.owner, createProjectSchema.name]
    );
    return results.rows[0];
  } catch (error: any) {
    throw new Error(`Something went wrong error code: ${error.code} ${error.message}`);
  }
}

// Get Project By ID
async function getProjectById(client: PoolClient, id: number): Promise<DBProject> {
  try {
    const results = await client.query<DBProject>('SELECT * FROM projects WHERE id = $1', [id]);

    return results.rows[0];
  } catch (error: any) {
    throw new Error(`Something went wrong error code: ${error.code} ${error.message}`);
  }
}

// Get Projects By Owner
async function getProjectsByOwner(client: PoolClient, ownerId: number): Promise<DBProject[]> {
  try {
    const results = await client.query<DBProject>('SELECT * FROM projects WHERE owner = $1', [
      ownerId
    ]);

    return results.rows;
  } catch (error: any) {
    throw new Error(`Something went wrong error code: ${error.code} ${error.message}`);
  }
}

// Delete Project
async function deleteProject(client: PoolClient, id: number) {
  try {
    const results = await client.query<DBProject>('DELETE FROM projects WHERE id = $1', [id]);

    if (results.rowCount === 0) {
      throw new Error(`No project found with id: ${id}`);
    }
  } catch (error: any) {
    throw new Error(`Something went wrong error code: ${error.code} ${error.message}`);
  }
}
