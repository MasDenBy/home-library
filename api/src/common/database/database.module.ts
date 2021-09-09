import path from "path";

import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Config } from "../config/config";
import { ConfigurationModule } from "../config/config.module";


@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRootAsync({
            imports: [ConfigurationModule],
            inject: [Config],
            useFactory: (config: Config) => (<TypeOrmModuleOptions>{
                type: 'mariadb',
                host: config.database.host,
                port: config.database.port,
                username: config.database.userName,
                password: config.database.password,
                database: config.database.databaseName,
                //entities: [path.join(__dirname, "**/*.entity{.ts,.js}")],
                synchronize: config.database.synchronize
            })
        })
    ]
})
export class DatabaseModule {}