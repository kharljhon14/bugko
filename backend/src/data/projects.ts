import { PoolClient } from 'pg';
import { CreateProjectSchemaType } from '../schemas/projects';
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
