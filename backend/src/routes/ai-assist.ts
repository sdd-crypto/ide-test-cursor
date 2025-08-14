import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import type { AiAssistRequest, ChatMessage } from '../types.js';
import { callPerplexity } from '../lib/perplexity.js';

const RequestSchema = z.object({
  code_context: z.string().default(''),
  cursor_position: z.object({ line: z.number(), column: z.number() }),
  chat_history: z.array(z.object({ role: z.enum(['system','user','assistant']), content: z.string() }))
});

export async function aiAssistRoutes(app: FastifyInstance) {
  app.post('/api/ai-assist', {
    preHandler: [
      async (req, reply) => {
        try {
          await req.jwtVerify();
        } catch {
          return reply.code(401).send({ error: 'Unauthorized' });
        }
      },
      async (req, reply) => {
        const apiKeyHeader = req.headers['x-api-key'];
        if (!apiKeyHeader || apiKeyHeader !== app.config.UI_API_KEY) {
          return reply.code(403).send({ error: 'Forbidden' });
        }
      }
    ]
  }, async (req, reply) => {
    const parse = RequestSchema.safeParse(req.body);
    if (!parse.success) {
      return reply.code(400).send({ error: 'Invalid payload' });
    }

    const data = parse.data as AiAssistRequest;
    const pplxKey = app.config.PPLX_API_KEY;

    const systemMessage: ChatMessage = {
      role: 'system',
      content: `You are an expert coding assistant embedded in a web IDE. Cursor position: line ${data.cursor_position.line}, column ${data.cursor_position.column}. Consider the provided code context.`
    };

    const messages: ChatMessage[] = [systemMessage, ...data.chat_history];

    const result = await callPerplexity(pplxKey, messages, {
      model: app.config.PPLX_MODEL,
      temperature: Number(app.config.PPLX_TEMPERATURE),
      max_tokens: Number(app.config.PPLX_MAX_TOKENS)
    });

    return reply.send(result);
  });
}