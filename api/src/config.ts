import { injectable } from "inversify";

@injectable()
export class Config {
    port: Number = +(process.env.PORT ?? 0);
    database: DatabaseConfig = new DatabaseConfig();
    assets: 'assets';
}

class DatabaseConfig {
    host: string = process.env.DB_HOST;
    port: number = +process.env.DB_PORT;
    userName: string = process.env.DB_USER_NAME;
    password: string = process.env.DB_USER_PASSWORD;
    name: string = process.env.DB_NAME;
}