import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { join } from 'path';
import * as root from 'app-root-path';

export default () => ({
  port: parseInt(process.env.PORT, 10) || 9000,
  typeOrmConfig: {
    type: 'mariadb',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    username: process.env.DB_USER_NAME,
    password: process.env.DB_USER_PASSWORD,
    database: process.env.DB_NAME,
    entities: [
      process.env.NODE_ENV === 'production'
        ? join(root.path, '**', '*.entity.{ts,js}')
        : 'dist/**/*.entity{.ts,.js}',
    ],
    migrationsTableName: 'migrations',
    migrations: [
      process.env.NODE_ENV === 'production'
        ? join(root.path, '**', 'core/database/migrations/*{.ts,.js}')
        : 'dist/core/database/migrations/*{.ts,.js}',
    ],
    cli: {
      migrationsDir: 'src/core/database/migrations',
    },
    synchronize: false,
  } as TypeOrmModuleOptions,
});
