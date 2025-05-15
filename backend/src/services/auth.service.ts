import { PoolClient } from 'pg';
import { GoogleUser } from '../types/auth';
import { createSSO, createUser, getUser } from '../data/auth.data';
import { CreateSSOSchemaType } from '../schemas/auth.schema';

export async function handleGoogleUser(client: PoolClient, user: GoogleUser) {
  const foundUser = await getUser(client, user.email);

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
