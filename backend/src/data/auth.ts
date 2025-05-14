import { PoolClient } from 'pg';
import { CreateSSO, DBSSO, DBUser, GoogleUser } from '../types/auth';

// Get User
export async function getUser(client: PoolClient, email: string): Promise<DBUser | null> {
  try {
    const { rows } = await client.query<DBUser>('SELECT * FROM users WHERE email=$1', [email]);

    return rows[0] ?? null;
  } catch (error: any) {
    throw new Error(`Something went wrong error code: ${error.code} ${error.message}`);
  }
}

// Create User
export async function createUser(client: PoolClient, user: GoogleUser): Promise<DBUser> {
  try {
    const results = await client.query<DBUser>(
      'INSERT INTO users(name, email) VALUES ($1, $2) RETURNING id, name, email',
      [user.name, user.email]
    );
    return results.rows[0];
  } catch (error: any) {
    throw new Error(`Something went wrong error code: ${error.code} ${error.message}`);
  }
}

// Create SSO
export async function createSSO(client: PoolClient, ssoValues: CreateSSO): Promise<DBSSO> {
  try {
    const results = await client.query<DBSSO>(
      'INSERT INTO sso_accounts(user_id, provider, provider_id) VALUES ($1, $2, $3) RETURNING *',
      [ssoValues.user_id, ssoValues.provider, ssoValues.provider_id]
    );

    return results.rows[0];
  } catch (error: any) {
    throw new Error(`Something went wrong error code: ${error.code} ${error.message}`);
  }
}
