import Fastify from 'fastify';
import cors from '@fastify/cors';

import dotenv from 'dotenv';

import authPlugin from './plugins/auth.plugin';
import databasePlugin from './plugins/data.plugin';

import healthRoutes from './routes/health.route';
import authRoutes from './routes/auth.route';
import projectRoutes from './routes/projects.route';
import projectMemberRoutes from './routes/project_memebers.route';

dotenv.config();

const fastify = Fastify({
  logger: true
});

fastify.register(cors, {
  origin: 'http://localhost:5173',
  methods: ['GET', 'HEAD', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
});

// Plugins
fastify.register(databasePlugin);
fastify.register(authPlugin);

// Routes
fastify.register(healthRoutes);
fastify.register(authRoutes);
fastify.register(projectRoutes, { prefix: '/projects' });
fastify.register(projectMemberRoutes, { prefix: '/project-members' });

async function start() {
  try {
    await fastify.listen({ port: Number(process.env.PORT) || 8080, host: '0.0.0.0' });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();
