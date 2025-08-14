import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { NodeVM } from 'vm2';

const RequestSchema = z.object({
  language: z.enum(['javascript','html']),
  code: z.string()
});

export async function executeRoutes(app: FastifyInstance) {
  app.post('/api/execute', {
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

    if (language === 'html') {
      return reply.send({ output: code, logs: [] });
    }

    const logs: string[] = [];

    const vm = new NodeVM({
      console: 'redirect',
      sandbox: {},
      timeout: 1000,
      wrapper: 'none'
    });

    vm.on('console.log', (data: unknown) => logs.push(String(data)));
    vm.on('console.error', (data: unknown) => logs.push(String(data)));

    let result: unknown = null;
    try {
      result = vm.run(code);
    } catch (err: any) {
      return reply.code(400).send({ error: 'Execution error', details: String(err), logs });
    }

    return reply.send({ output: result, logs });
  });
}