import * as Joi from 'joi';

const validationSchema = Joi.object({
  environment: Joi.string()
    .trim()
    .valid('local', 'development', 'staging', 'production')
    .default('local'),
  http: Joi.object({
    host: Joi.string().trim().min(1).required(),
    port: Joi.number().integer().port().required(),
  }),
  db: Joi.object({
    postgres: Joi.object({
      host: Joi.string().trim().min(1).required(),
      port: Joi.number().integer().port().required(),
      user: Joi.string().trim().min(1).required(),
      password: Joi.string().trim().min(1).required(),
      name: Joi.string().trim().min(1).required(),
    }),
  }),
  jwt: Joi.object({
    algorithm: Joi.string().trim().min(1).required(),
    secret: Joi.string().trim().min(1).required(),
    audience: Joi.string().trim().min(1).required(),
    accessTokenTtl: Joi.number().integer().required(),
    refreshTokenTtl: Joi.number().integer().required(),
  }),
  encryption: Joi.object({
    numberOfSaltRounds: Joi.number().integer().required(),
  }),
  redis: Joi.object({
    redisPort: Joi.number().integer().required(),
    redisHost: Joi.string().trim().min(1).required(),
  }),
});

export { validationSchema };
