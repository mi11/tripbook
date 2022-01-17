const dbConfig = {
  synchronize: true,
  migrations: ['migrations/*.js'],
  host: 'postgres',
  port: 5432,
  cli: {
    migrationsDir: 'migrations',
  },
};

switch (process.env.NODE_ENV) {
  case 'development':
    Object.assign(dbConfig, {
      type: 'postgres',
      database: 'main',
      username: 'admin',
      password: 'password',
      entities: ['**/*.entity.js'],
    });
    break;
  case 'test':
    Object.assign(dbConfig, {
      type: 'postgres',
      database: 'test',
      username: 'test',
      password: 'password',
      entities: ['**/*.entity.ts'],
      migrationsRun: true,
    });
    break;
  case 'production':
    break;
  default:
    throw new Error('unknown environment');
}

module.exports = dbConfig;
