import { FastifyInstance } from 'fastify';
import fetch from 'node-fetch';

// types.d.ts
import '@fastify/oauth2';
import { GoogleUser } from '../types/auth';
import { isAuthenticated } from '../middlewares/auth';
import { createSSO, createUser, getUser } from '../data/auth.data';
import { CreateSSOSchemaType } from '../schemas/auth.schema';

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
    }).then((res) => res.json())) as GoogleUser;

    await request.login({ provider: 'google', ...userInfo });

    reply.redirect('/me');
  });

  fastify.get('/me', { preHandler: [isAuthenticated] }, async (request, reply) => {
    const user = request.user as GoogleUser;
    console.log(user);
    const client = await fastify.pg.connect();
    try {
      const foundUser = await getUser(client, user.email);

      if (!foundUser) {
        const newUser = await createUser(client, user);

        const ssoValues: CreateSSOSchemaType = {
          user_id: newUser.id,
          provider: 'google',
          provider_id: user.id
        };

        await createSSO(client, ssoValues);

        return reply.send({ data: newUser });
      }

      return reply.send({ data: foundUser });
    } catch (err) {
      return reply.code(500).send({ error: err });
    } finally {
      client.release();
    }
  });

  fastify.get('/logout', { preHandler: [isAuthenticated] }, async (request, reply) => {
    await request.logout();

    reply.send({ message: 'logged out' });
  });
}
