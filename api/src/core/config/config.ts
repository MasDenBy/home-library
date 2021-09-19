import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
import * as root from 'app-root-path';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

class Config {
  constructor(private env: { [k: string]: string | undefined }) {}

  private get isProduction(): boolean {
    return this.getValue('NODE_ENV', false) === 'production';
  }

  public get port(): number {
    return +this.getValue('PORT');
  }

  public get typeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'mariadb',
      host: this.getValue('DB_HOST'),
      port: +this.getValue('DB_PORT'),
      username: this.getValue('DB_USERNAME'),
      password: this.getValue('DB_PASSWORD'),
      database: this.getValue('DB_NAME'),
      entities: [
        this.isProduction
          ? join(root.path, '**', '*.entity.{ts,js}')
          : 'dist/**/*.entity{.ts,.js}',
      ],
      migrationsTableName: 'migrations',
      migrations: [
        this.isProduction
          ? join(root.path, '**', 'core/database/migrations/*{.ts,.js}')
          : 'dist/core/database/migrations/*{.ts,.js}',
      ],
      cli: {
        migrationsDir: 'src/core/database/migrations',
      },
      synchronize: false,
    };
  }

  private getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }
}

const config = new Config(process.env);

export { config };
