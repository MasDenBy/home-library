import { injectable } from "inversify";
import { Connection, EntityTarget, getConnectionManager, Repository } from "typeorm";

import { Config } from "../../config";
import { BaseEntity } from './entities/base.entity';

// Entities
import { Book } from "./entities/book.entity";
import { File } from "./entities/file.entity";
import { Library } from "./entities/library.entity";

@injectable()
export class DatabaseWrapper {
    constructor(private config: Config) { }

    public async getConnection(): Promise<Connection> {
        const connectionManager = getConnectionManager();
        let connection: Connection;

        if(connectionManager.has("default")) {
            connection = connectionManager.get("default");
        } else {
            connection = connectionManager.create({
                type: "mariadb",
                host: this.config.database.host,
                port: this.config.database.port,
                username: this.config.database.userName,
                password: this.config.database.password,
                database: this.config.database.name,
                entities: [
                    Book,  
                    File,
                    Library
                ],
                synchronize: true
            });
    
            await connection.connect();
        }

        return connection;
    }

    public async getRepository(target: EntityTarget<BaseEntity>): Promise<Repository<BaseEntity>> {
        return (await this.getConnection()).getRepository(target);
    }
}