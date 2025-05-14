import { FastifyInstance } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import fastityPostgres from '@fastify/postgres';

import dotenv from 'dotenv';

dotenv.config();

export default fastifyPlugin(async function (fastify: FastifyInstance) {
  fastify.register(fastityPostgres, {
    connectionString: process.env.DATABASE_URL || ''
  });
});
