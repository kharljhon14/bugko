import { PoolClient } from 'pg';
import { addProjectMember, getProjectMember } from '../data/project_members';
import { NotFoundError, UnauthorizedError } from '../utils/error';
import { getProjectById } from '../data/projects.data';

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

  console.log(project.owner, ownerID);
  if (Number(project.owner) !== ownerID) {
    throw new UnauthorizedError(`user with id ${ownerID} is unauthroized to update project`);
  }

  const projectMember = await addProjectMember(client, projectID, userID);

  return projectMember;
}
