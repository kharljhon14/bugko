import { PoolClient } from 'pg';
import { ProjectSchemaType } from '../schemas/projects.schema';
import {
  createProject,
  getProjectById,
  getProjectsByOwner,
  updateProject
} from '../data/projects.data';
import { getUserByID } from '../data/auth.data';
import { NotFoundError } from '../utils/error';

export async function handleCreateNewProject(client: PoolClient, data: ProjectSchemaType) {
  const newProject = await createProject(client, data);

  return newProject;
}

export async function handleGetProjectById(client: PoolClient, id: number) {
  const project = await getProjectById(client, id);

  if (!project) {
    throw new NotFoundError(`project with ID: ${id} not found`);
  }

  return project;
}

export async function handleGetProjectsByOwner(client: PoolClient, ownerId: number) {
  const foundUser = await getUserByID(client, ownerId);

  if (!foundUser) {
    throw new NotFoundError(`owner with ID: ${ownerId} not found`);
  }

  const projects = await getProjectsByOwner(client, ownerId);

  return projects;
}

export async function handleUpdateProject(client: PoolClient, id: number, data: ProjectSchemaType) {
  const foundUser = await getUserByID(client, data.owner);

  if (!foundUser) {
    throw new NotFoundError(`owner with ID: ${data.owner} not found`);
  }

  const project = await updateProject(client, id, data);

  if (!project) {
    throw new NotFoundError(`project with ID: ${id} not found`);
  }

  return project;
}
