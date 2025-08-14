import 'fastify'

declare module 'fastify' {
  interface FastifyInstance {
    config: {
      PORT: number
      CORS_ORIGIN: string
      UI_API_KEY: string
      JWT_SECRET: string
      PPLX_API_KEY: string
      PPLX_MODEL: string
      PPLX_TEMPERATURE: string
      PPLX_MAX_TOKENS: string
      RATE_LIMIT_MAX: number
      RATE_LIMIT_TIME_WINDOW: string
    }
  }
}