import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { GoogleUser } from '../types/auth';

import { handleGoogleUser } from '../services/auth.service';

declare module 'fastify' {
  interface FastifyInstance {
    googleOAuth2: import('@fastify/oauth2').OAuth2Namespace;
  }
}

export function googleAuthHandler(fastify: FastifyInstance) {
  return async function (request: FastifyRequest, reply: FastifyReply) {
    const client = await fastify.pg.connect();

    try {
      const token = await fastify.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(request);

      const userInfo = (await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${token.token.access_token}`
        }
      }).then((res) => res.json())) as GoogleUser;

      const user = await handleGoogleUser(client, userInfo);
      await request.logIn({ user_id: user.id, ...userInfo });

      reply.redirect('http://localhost:5173');
    } catch (error) {
      return reply.code(500).send({ error: error });
    } finally {
      client.release();
    }
  };
}
export function getUserInformationHandler(fastify: FastifyInstance) {
  return async function getUserInformationHandler(request: FastifyRequest, reply: FastifyReply) {
    const user = request.user as GoogleUser;
    const client = await fastify.pg.connect();
    try {
      return reply.send({ data: user });
    } catch (error) {
      return reply.code(500).send({ error: error });
    } finally {
      client.release();
    }
  };
}

export async function logoutUserHandler(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.logout();

    reply.send({ message: 'logged out' });
  } catch (error) {
    return reply.code(500).send({ error: error });
  }
}
