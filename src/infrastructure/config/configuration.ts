import * as dotenv from 'dotenv';

dotenv.config();

export default () => ({
  environment: process.env.ENVIRONMENT,
  http: {
    host: process.env.HTTP_HOST,
    port: Number(process.env.HTTP_PORT),
  },
  db: {
    postgres: {
      host: process.env.DB_POSTGRES_HOST,
      port: Number(process.env.DB_POSTGRES_PORT),
      user: process.env.DB_POSTGRES_USER,
      password: process.env.DB_POSTGRES_PASSWORD,
      name: process.env.DB_POSTGRES_NAME,
    },
  },
  jwt: {
    algorithm: process.env.JWT_ALGORITHM,
    secret: process.env.JWT_SECRET,
    audience: process.env.JWT_TOKEN_AUDIENCE,
    issuer: process.env.JWT_TOKEN_ISSUER,
    accessTokenTtl: Number(process.env.JWT_ACCESS_TOKEN_TTL ?? '3600'),
    refreshTokenTtl: Number(process.env.JWT_REFRESH_TOKEN_TTL ?? '86400'),
  },
  encryption: {
    numberOfSaltRounds: Number(process.env.ENCRYPTION_HASH_SALT_ROUNDS),
  },
  redis: {
    redisPort: Number(process.env.REDIS_PORT),
    redisHost: process.env.REDIS_HOST,
  },
});
