export default () => ({
  port: parseInt(process.env.PORT ?? '9099', 10),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  corsOrigins: JSON.parse(process.env.CORS_ORIGINS ?? '[]') as string[],
  db: { url: process.env.DATABASE_URL! },
  redis: { host: process.env.REDIS_HOST!, port: parseInt(process.env.REDIS_PORT ?? '6379', 10) },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET!,
    accessTtl: process.env.JWT_ACCESS_TTL ?? '15m',
    refreshSecret: process.env.JWT_REFRESH_SECRET!,
    refreshTtl: process.env.JWT_REFRESH_TTL ?? '7d',
  },
  rate: { ttl: parseInt(process.env.RATE_LIMIT_TTL ?? '60', 10), limit: parseInt(process.env.RATE_LIMIT_LIMIT ?? '100', 10) },
  swagger: { title: process.env.SWAGGER_TITLE!, version: process.env.SWAGGER_VERSION! },
});
