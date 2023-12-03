import configuration from './config/configuration';

const config = configuration();

export default {
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  host: config.db.postgres.host,
  port: config.db.postgres.port,
  user: config.db.postgres.user,
  password: config.db.postgres.password,
  dbName: config.db.postgres.name,
  type: 'postgresql',
  forceUtcTimezone: true,
  debug: false,
  pool: {
    min: 2,
    max: 10,
    createTimeoutMillis: 3000,
    acquireTimeoutMillis: 30000,
    idleTimeoutMillis: 30000,
    reapIntervalMillis: 1000,
    createRetryIntervalMillis: 100,
    propagateCreateError: false,
  },
  seeder: {
    path: 'dist/infrastructure/db/seeders',
    pathTs: 'src/infrastructure/db/seeders',
    defaultSeeder: 'DatabaseSeeder',
    glob: '**/*.seeder.{js,ts}',
    emit: 'ts',
  },
  migrations: {
    allOrNothing: true,
    path: 'src/infrastructure/db/migrations',
    tableName: 'migrations',
    transactional: true,
    disableForeignKeys: true,
    dropTables: true,
    safe: false,
    emit: 'ts',
  },
};
