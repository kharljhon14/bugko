import { FastifyInstance } from 'fastify';
import fetch from 'node-fetch';

// types.d.ts
import '@fastify/oauth2';
import { User } from '../types/auth';
import { isAuthenticated } from '../middlewares/auth';

declare module 'fastify' {
  interface FastifyInstance {
    googleOAuth2: import('@fastify/oauth2').OAuth2Namespace;
  }
}

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.get('/login/google/callback', async function (request, reply) {
    const token = await fastify.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(request);

    const userInfo = (await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${token.token.access_token}`
      }
    }).then((res) => res.json())) as User;

    await request.login({ provider: 'google', ...userInfo });

    reply.redirect('/me');
  });

  fastify.get('/me', async (request, reply) => {
    if (request.isAuthenticated()) {
      const user = request.user as User;
      const client = await fastify.pg.connect();
      try {
        const { rows } = await client.query('SELECT * FROM users WHERE email=$1', [user.email]);
        let dbUser = rows[0];

        // Insert user information if first sign in
        if (!dbUser) {
          const result = await client.query(
            'INSERT INTO users(name, email) VALUES ($1, $2) RETURNING id, name, email',
            [`${user.given_name} ${user.family_name}`, user.email]
          );
          const newUserId = result.rows[0].id;

          await client.query(
            'INSERT INTO sso_accounts(user_id, provider, provider_id) VALUES ($1, $2, $3)',
            [newUserId, 'google', user.id]
          );

          dbUser = result.rows[0];
        }

        return reply.send({ data: dbUser });
      } catch (err) {
        return reply.code(500).send({ error: err });
      } finally {
        client.release();
      }
    } else {
      reply.code(401).send({ message: 'Unauthorized' });
    }
  });

  fastify.get('/logout', async (request, reply) => {
    await request.logout();

    reply.send({ message: 'logged out' });
  });
}
