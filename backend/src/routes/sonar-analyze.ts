import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { analyzeCode } from '../lib/sonar-pro/index.js';

const RequestSchema = z.object({
  language: z.string(),
  code: z.string()
});

export async function sonarAnalyzeRoutes(app: FastifyInstance) {
  app.post('/api/sonar-analyze', {
    preHandler: [
      async (req, reply) => {
        try {
          await req.jwtVerify();
        } catch {
          return reply.code(401).send({ error: 'Unauthorized' });
        }
      }
    ]
  }, async (req, reply) => {
    const parse = RequestSchema.safeParse(req.body);
    if (!parse.success) {
      return reply.code(400).send({ error: 'Invalid payload' });
    }

    const { language, code } = parse.data;
    const report = await analyzeCode(language, code);
    return reply.send({ report });
  });
}