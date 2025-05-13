import { FastifyInstance } from 'fastify';
import fetch from 'node-fetch';

// types.d.ts
import '@fastify/oauth2';
import { User } from '../types/auth';

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

    await request.logIn({ provider: 'google', ...userInfo });

    reply.redirect('/test-auth');
  });

  fastify.get('/test-auth', async (request, reply) => {
    if (request.isAuthenticated()) {
      const user = request.user as User;
      const client = await fastify.pg.connect();
      try {
        const { rows } = await client.query('SELECT * FROM users WHERE email=$1', [user.email]);

        if (rows.length === 0) {
          const result = await client.query(
            'INSERT INTO users(name, email) VALUES ($1, $2) RETURNING id',
            [`${user.given_name} ${user.family_name}`, user.email]
          );
          const newUserId = result.rows[0].id;
          await client.query('INSERT INTO sso_accounts(user_id, provider) VALUES ($1, $2)', [
            newUserId,
            'google'
          ]);
        }
      } finally {
        client.release();
      }
      reply.send({ data: user });
    } else {
      reply.code(401).send({ message: 'Unauthorized' });
    }
  });
}
