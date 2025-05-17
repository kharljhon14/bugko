import { FastifyInstance } from 'fastify';
import { getProjectMemberHandler } from '../controllers/project_members';

export default function projectMembersRoutes(fastify: FastifyInstance) {
  fastify.get(
    '/',
    {
      schema: {
        querystring: {
          type: 'object',
          properties: {
            project_id: { type: 'number' },
            user_id: { type: 'number' }
          },
          required: ['project_id', 'user_id']
        }
      }
    },
    getProjectMemberHandler(fastify)
  );
}
