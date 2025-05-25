import { PoolClient } from 'pg';
import { ProjectSchemaType } from '../schemas/projects.schema';
import {
  createProject,
  deleteProject,
  getProjectById,
  getProjectsByOwner,
  updateProject
} from '../data/projects.data';
import { getUserByID } from '../data/auth.data';
import { NotFoundError } from '../utils/error';
import { addProjectMember } from '../data/project_members';
import { calaculateMetadata } from '../utils/metadata';

export async function handleCreateNewProject(
  client: PoolClient,
  data: ProjectSchemaType,
  userID: number
) {
  const newProject = await createProject(client, data, userID);

  await addProjectMember(client, newProject.id, userID);

  return newProject;
}

export async function handleGetProjectById(client: PoolClient, id: number) {
  const project = await getProjectById(client, id);

  if (!project) {
    throw new NotFoundError(`project with ID: ${id} not found`);
  }

  return project;
}

export async function handleGetProjectsByOwner(client: PoolClient, ownerId: number, page: number) {
  const pageSize = 10;
  const offset = (page - 1) * pageSize;
  const foundUser = await getUserByID(client, ownerId);

  if (!foundUser) {
    throw new NotFoundError(`owner with ID: ${ownerId} not found`);
  }

  const projects = await getProjectsByOwner(client, ownerId, pageSize, offset);
  const totalCount = projects.length > 0 ? Number(projects[0].total_count) : 0;

  const projectsWithNoTotalCount = projects.map(({ total_count: _total_count, ...data }) => data);
  const metadata = calaculateMetadata(totalCount, page, pageSize);

  return { projects: projectsWithNoTotalCount, metadata };
}

export async function handleUpdateProject(
  client: PoolClient,
  id: number,
  data: ProjectSchemaType,
  userID: number
) {
  const foundUser = await getUserByID(client, userID);

  if (!foundUser) {
    throw new NotFoundError(`owner with ID: ${userID} not found`);
  }

  const project = await updateProject(client, id, data, foundUser.id);

  if (!project) {
    throw new NotFoundError(`project with ID: ${id} not found`);
  }

  return project;
}

export async function handleDeleteProject(client: PoolClient, id: number, userID: number) {
  const rowCount = await deleteProject(client, id, userID);

  if (rowCount === 0) {
    throw new NotFoundError(`project with ID: ${id} not found`);
  }
}
