import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default () => ({
  port: parseInt(process.env.PORT, 10) || 9000,
  typeOrmConfig: {
    type: 'mariadb',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    username: process.env.DB_USER_NAME,
    password: process.env.DB_USER_PASSWORD,
    database: process.env.DB_NAME,
    entities: ['dist/**/*.entity{.ts,.js}'],
    migrationsTableName: 'migrations',
    migrations: ['dist/core/database/migrations/*{.ts,.js}'],
    cli: {
      migrationsDir: 'src/core/database/migrations',
    },
    synchronize: false,
  } as TypeOrmModuleOptions,
  logging: {
    filename: process.env.LOG_FILE,
    level: process.env.LOG_LEVEL,
  },
});
