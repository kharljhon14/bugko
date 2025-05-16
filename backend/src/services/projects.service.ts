import { PoolClient } from 'pg';
import { ProjectSchemaType } from '../schemas/projects.schema';
import { createProject, getProjectById, getProjectsByOwner } from '../data/projects.data';
import { getUserByID } from '../data/auth.data';

export async function handleCreateNewProject(client: PoolClient, data: ProjectSchemaType) {
  const newProject = await createProject(client, data);

  return newProject;
}

export async function handleGetProjectById(client: PoolClient, id: number) {
  const project = await getProjectById(client, id);

  return project;
}

export async function handleGetProjectsByOwner(client: PoolClient, ownerId: number) {
  const projects = await getProjectsByOwner(client, ownerId);

  return projects;
}
