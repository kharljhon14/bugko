import Fastify from 'fastify';
import dotenv from 'dotenv';
import authPlugin from './plugins/auth';

import healthRoutes from './routes/health';
dotenv.config();

const fastify = Fastify({
  logger: true
});

// Plugins
fastify.register(authPlugin);

// Routes
fastify.register(healthRoutes);

async function start() {
  try {
    await fastify.listen({ port: Number(process.env.PORT) || 8080 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();
