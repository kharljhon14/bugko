import { PoolClient } from 'pg';
import { getProjectMember } from '../data/project_members';
import { NotFoundError } from '../utils/error';

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
