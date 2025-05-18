import { PoolClient } from 'pg';
import {
  addProjectMember,
  getProjectMember,
  getProjectMembers,
  removeProjectMember
} from '../data/project_members';
import { NotFoundError, UnauthorizedError } from '../utils/error';
import { getProjectById } from '../data/projects.data';
import { getUserByID } from '../data/auth.data';

export async function handleGetProjectMember(
  client: PoolClient,
  projectID: number,
  userID: number
) {
  const projectMember = await getProjectMember(client, projectID, userID);

  if (!projectMember) {
    throw new NotFoundError(
      `project member with project id ${projectID} and user with id ${userID} not found`
    );
  }

  return projectMember;
}

export async function handleGetProjectMembers(client: PoolClient, projectID: number) {
  const projectMember = await getProjectMembers(client, projectID);

  if (!projectMember) {
    throw new NotFoundError(`project id ${projectID} not found`);
  }

  return projectMember;
}

export async function handleAddProjectMember(
  client: PoolClient,
  ownerID: number,
  projectID: number,
  userID: number
) {
  const project = await getProjectById(client, projectID);

  if (!project) {
    throw new NotFoundError(`project with id ${projectID} not found`);
  }

  if (Number(project.owner) !== ownerID) {
    throw new UnauthorizedError(`user with id ${ownerID} is unauthorized to update project`);
  }

  const foundUser = await getUserByID(client, userID);
  if (!foundUser) {
    throw new NotFoundError(`user with id ${userID} not found`);
  }

  const projectMember = await addProjectMember(client, projectID, userID);

  return projectMember;
}

export async function handleRemoveProjectMember(
  client: PoolClient,
  ownerID: number,
  projectID: number,
  userID: number
) {
  const project = await getProjectById(client, projectID);

  if (!project) {
    throw new NotFoundError(`project with id ${projectID} not found`);
  }

  if (Number(project.owner) !== ownerID) {
    throw new UnauthorizedError(`user with id ${ownerID} is unauthorized to update project`);
  }

  const foundUser = await getUserByID(client, userID);
  if (!foundUser) {
    throw new NotFoundError(`user with id ${userID} not found`);
  }

  const rowCount = await removeProjectMember(client, projectID, userID);

  if (rowCount === 0) {
    throw new NotFoundError(`project with id ${projectID} and user with ${userID} not found`);
  }
}
