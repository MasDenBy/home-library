import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class Config {
    private readonly databaseConfig: DatabaseConfiguration;

    constructor(private configService: ConfigService) {
        this.databaseConfig = new DatabaseConfiguration(this.configService);
    }

    public get port(): number {
        return this.configService.get<number>("PORT");
    }

    public get database(): DatabaseConfiguration {
        return this.databaseConfig;
    }
}

class DatabaseConfiguration {
    constructor(private configService: ConfigService) {}

    public get host(): string {
        return this.configService.get('DB_HOST');
    }

    public get port(): number {
        return this.configService.get<number>('DB_PORT');
    }

    public get userName(): string {
        return this.configService.get('DB_USERNAME');
    }

    public get password(): string {
        return this.configService.get('DB_PASSWORD');
    }

    public get databaseName(): string {
        return this.configService.get('DB_DATABASE');
    }

    public get synchronize(): boolean {
        return this.configService.get<boolean>('DB_SYNCHRONIZE');
    }
}