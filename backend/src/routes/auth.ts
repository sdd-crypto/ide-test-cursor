import { FastifyInstance } from 'fastify';

export async function authRoutes(app: FastifyInstance) {
  app.post('/api/auth/dev-login', async (_req, reply) => {
    const token = (app as any).jwt.sign({ sub: 'dev-user', roles: ['dev'] }, { expiresIn: '1h' });
    return reply.send({ token });
  });
}