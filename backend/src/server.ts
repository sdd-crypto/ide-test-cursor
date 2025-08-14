import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import jwt from '@fastify/jwt';
import rateLimit from '@fastify/rate-limit';
import { register, collectDefaultMetrics } from 'prom-client';
import { logger } from './lib/logger.js';
import { aiAssistRoutes } from './routes/ai-assist.js';
import { executeRoutes } from './routes/execute.js';
import { sonarAnalyzeRoutes } from './routes/sonar-analyze.js';
import { authRoutes } from './routes/auth.js';
import dotenv from 'dotenv';

dotenv.config();

const app = Fastify({ logger: false });

// simple typed config accessor
(app as any).config = {
  PORT: Number(process.env.PORT ?? 3001),
  CORS_ORIGIN: process.env.CORS_ORIGIN ?? '*',
  UI_API_KEY: process.env.UI_API_KEY ?? '',
  JWT_SECRET: process.env.JWT_SECRET ?? 'change-me',
  PPLX_API_KEY: process.env.PPLX_API_KEY ?? '',
  PPLX_MODEL: process.env.PPLX_MODEL ?? 'sonar-large-chat',
  PPLX_TEMPERATURE: process.env.PPLX_TEMPERATURE ?? '0.7',
  PPLX_MAX_TOKENS: process.env.PPLX_MAX_TOKENS ?? '512',
  RATE_LIMIT_MAX: Number(process.env.RATE_LIMIT_MAX ?? 100),
  RATE_LIMIT_TIME_WINDOW: process.env.RATE_LIMIT_TIME_WINDOW ?? '1 minute'
};

await app.register(cors, { origin: (app as any).config.CORS_ORIGIN, credentials: true });
await app.register(helmet);
await app.register(jwt, { secret: (app as any).config.JWT_SECRET });
await app.register(rateLimit, { max: (app as any).config.RATE_LIMIT_MAX, timeWindow: (app as any).config.RATE_LIMIT_TIME_WINDOW });

app.get('/health', async () => ({ status: 'ok' }));

collectDefaultMetrics();
app.get('/metrics', async (req, reply) => {
  reply.header('Content-Type', register.contentType);
  return register.metrics();
});

await app.register(authRoutes);
await app.register(aiAssistRoutes);
await app.register(executeRoutes);
await app.register(sonarAnalyzeRoutes);

app.setErrorHandler((error, req, reply) => {
  logger.error('Unhandled error', { error: String(error) });
  reply.code(500).send({ error: 'Internal Server Error' });
});

const port = (app as any).config.PORT;
app.listen({ port, host: '0.0.0.0' }).then(() => {
  // eslint-disable-next-line no-console
  console.log(`API listening on http://0.0.0.0:${port}`);
});