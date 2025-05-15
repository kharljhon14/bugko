import { PoolClient } from 'pg';
import { DBSSO, DBUser, GoogleUser } from '../types/auth';
import { CreateSSOSchemaType } from '../schemas/auth.schema';

// Get User
export async function getUser(client: PoolClient, email: string): Promise<DBUser | null> {
  const { rows } = await client.query<DBUser>('SELECT * FROM users WHERE email=$1', [email]);

  return rows[0] ?? null;
}

// Create User
export async function createUser(client: PoolClient, user: GoogleUser): Promise<DBUser> {
  const results = await client.query<DBUser>(
    'INSERT INTO users(name, email) VALUES ($1, $2) RETURNING id, name, email',
    [user.name, user.email]
  );
  return results.rows[0];
}

// Create SSO
export async function createSSO(
  client: PoolClient,
  ssoValues: CreateSSOSchemaType
): Promise<DBSSO> {
  const results = await client.query<DBSSO>(
    'INSERT INTO sso_accounts(user_id, provider, provider_id) VALUES ($1, $2, $3) RETURNING *',
    [ssoValues.user_id, ssoValues.provider, ssoValues.provider_id]
  );

  return results.rows[0];
}
