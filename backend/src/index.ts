import Fastify from 'fastify';
import dotenv from 'dotenv';

const fastify = Fastify({
  logger: true
});

dotenv.config();

// Routes
fastify.get('/health', async function healthCheckHandler(_request, _reply) {
  return { status: 'ok' };
});

async function start() {
  try {
    await fastify.listen({ port: Number(process.env.PORT) || 8080 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();
