import { PoolClient } from 'pg';
import { GoogleUser } from '../types/auth';
import { createSSO, createUser, getUserByEmail } from '../data/auth.data';
import { CreateSSOSchemaType } from '../schemas/auth.schema';
import { NotFoundError } from '../utils/error';

export async function handleGoogleUser(client: PoolClient, user: GoogleUser) {
  const foundUser = await getUserByEmail(client, user.email);

  if (!foundUser) {
    const newUser = await createUser(client, user);

    const ssoValues: CreateSSOSchemaType = {
      user_id: newUser.id,
      provider: 'google',
      provider_id: user.id
    };

    await createSSO(client, ssoValues);
    return newUser;
  }

  return foundUser;
}

export async function handleGetUserByEmail(client: PoolClient, email: string) {
  const foundUser = await getUserByEmail(client, email);

  if (!foundUser) {
    throw new NotFoundError(`user with email ${email} not found`);
  }

  return foundUser;
}
