import { PoolClient } from 'pg';
import { CreateProjectSchemaType } from '../schemas/projects.schema';
import { createProject } from '../data/projects.data';

export async function handleCreateNewProject(client: PoolClient, data: CreateProjectSchemaType) {
  const newProject = await createProject(client, data);

  return newProject;
}
