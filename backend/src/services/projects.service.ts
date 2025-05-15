import { PoolClient } from 'pg';
import { CreateProjectSchemaType } from '../schemas/projects.schema';
import { createProject, getProjectById } from '../data/projects.data';

export async function handleCreateNewProject(client: PoolClient, data: CreateProjectSchemaType) {
  const newProject = await createProject(client, data);

  return newProject;
}

export async function handleGetProjectById(client: PoolClient, id: number) {
  const project = await getProjectById(client, id);

  return project;
}
