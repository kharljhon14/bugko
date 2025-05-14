import { FastifyInstance } from 'fastify';
import fetch from 'node-fetch';

// types.d.ts
import '@fastify/oauth2';
import { GoogleUser } from '../types/auth';
import { isAuthenticated } from '../middlewares/auth';
import { createSSO, createUser, getUser } from '../data/auth.data';
import { CreateSSOSchemaType } from '../schemas/auth.schema';
import {
  getUserInformationHandler,
  googleAuthHandler,
  logoutUserHandler
} from '../controllers/auth.controller';

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.get('/login/google/callback', googleAuthHandler(fastify));

  fastify.get('/me', { preHandler: [isAuthenticated] }, getUserInformationHandler(fastify));

  fastify.get('/logout', { preHandler: [isAuthenticated] }, logoutUserHandler);
}
