import fastifyPassport from '@fastify/passport';
import fs from 'fs';
import path from 'path';
import fastifyPlugin from 'fastify-plugin';
import fastifySecureSession from '@fastify/secure-session';
import { FastifyInstance } from 'fastify';

export default fastifyPlugin(async function (fastify: FastifyInstance) {
  fastify.register(fastifySecureSession, {
    cookie: { path: '/' },
    key: fs.readFileSync(path.join(__dirname, '../../secret-key'))
  });

  fastify.register(fastifyPassport.initialize());
  fastify.register(fastifyPassport.secureSession());

  fastifyPassport.registerUserSerializer(async (user) => user);
  fastifyPassport.registerUserDeserializer(async (obj) => obj);
});
