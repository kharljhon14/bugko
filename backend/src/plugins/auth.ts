import fastifyPassport from '@fastify/passport';
import fs from 'fs';
import path from 'path';
import fastifyPlugin from 'fastify-plugin';
import fastifySecureSession from '@fastify/secure-session';
import { FastifyInstance } from 'fastify';
import oauthPlugin from '@fastify/oauth2';

import dotenv from 'dotenv';

dotenv.config();

export default fastifyPlugin(async function (fastify: FastifyInstance) {
  fastify.register(fastifySecureSession, {
    cookie: { path: '/', httpOnly: true, sameSite: 'lax' },
    key: fs.readFileSync(path.join(__dirname, '../../secret-key'))
  });

  fastify.register(fastifyPassport.initialize());
  fastify.register(fastifyPassport.secureSession());

  fastifyPassport.registerUserSerializer(async (user, _request) => user);
  fastifyPassport.registerUserDeserializer(async (user, _request) => user);

  fastify.register(oauthPlugin, {
    name: 'googleOAuth2',
    credentials: {
      client: {
        id: process.env.GOOGLE_CLIENT_ID || '',
        secret: process.env.GOOGLE_CLIENT_SECRET || ''
      },
      auth: oauthPlugin.GOOGLE_CONFIGURATION
    },
    startRedirectPath: '/login/google',
    callbackUri: 'http://localhost:8080/login/google/callback',
    scope: ['profile', 'email']
  });

  // fastify.register(fastifyJWT, { secret: process.env.JWT_SECRET || '' });
});
