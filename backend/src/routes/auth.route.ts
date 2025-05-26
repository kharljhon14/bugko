import { FastifyInstance } from 'fastify';

import '@fastify/oauth2';

import { isAuthenticated } from '../middlewares/auth';

import {
  getUserByEmailHandler,
  getUserInformationHandler,
  googleAuthHandler,
  logoutUserHandler
} from '../controllers/auth.controller';

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.get('/login/google/callback', googleAuthHandler(fastify));

  fastify.get('/me', { preHandler: [isAuthenticated] }, getUserInformationHandler(fastify));
  fastify.get(
    '/get-user',
    {
      preHandler: [isAuthenticated],
      schema: {
        querystring: {
          type: 'object',
          properties: {
            email: { type: 'string' }
          }
        }
      }
    },
    getUserByEmailHandler(fastify)
  );

  fastify.get('/logout', { preHandler: [isAuthenticated] }, logoutUserHandler);
}
