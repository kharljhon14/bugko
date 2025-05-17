import { FastifyInstance } from 'fastify';
import { addProjectMemberHandler, getProjectMemberHandler } from '../controllers/project_members';
import { isAuthenticated } from '../middlewares/auth';
import { validateSchema } from '../middlewares/validateSchema';
import { addProjectMemberSchema } from '../schemas/project_member.schema';

export default function projectMembersRoutes(fastify: FastifyInstance) {
  fastify.get(
    '/',
    {
      preHandler: [isAuthenticated],
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

  fastify.post(
    '/',
    {
      preHandler: [isAuthenticated, validateSchema(addProjectMemberSchema)]
    },
    addProjectMemberHandler(fastify)
  );
}
