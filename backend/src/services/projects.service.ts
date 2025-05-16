import { PoolClient } from 'pg';
import { ProjectSchemaType } from '../schemas/projects.schema';
import { createProject, getProjectById } from '../data/projects.data';

export async function handleCreateNewProject(client: PoolClient, data: ProjectSchemaType) {
  const newProject = await createProject(client, data);

  return newProject;
}

export async function handleGetProjectById(client: PoolClient, id: number) {
  const project = await getProjectById(client, id);

  return project;
}
