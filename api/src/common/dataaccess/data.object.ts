import { injectable } from "inversify";
import { Connection, EntityTarget, Repository, getConnectionManager, DeleteResult } from "typeorm";
import { Config } from "../../config";
import { BaseEntity } from './base.entity';
import { Library } from "../../libraries/dataaccess/library.entity";

import debug from "debug";

const debugLog: debug.IDebugger = debug('app: data.object');

@injectable()
export abstract class DataObject {
    constructor(private config: Config) { }

    public async getRepository(target: EntityTarget<BaseEntity>): Promise<Repository<BaseEntity>> {
        return (await this.getConnection()).getRepository(target);
    }

    public async list<TEntity extends BaseEntity>(target: EntityTarget<BaseEntity>): Promise<TEntity[]> {
        return (await this.getRepository(target)).find() as Promise<TEntity[]>;
    }

    public async findById<TEntity extends BaseEntity>(target: EntityTarget<BaseEntity>, id: number): Promise<TEntity> {
        return (await this.getRepository(target)).findOne({ id: id }) as Promise<TEntity>;
    }

    public async deleteById(target: EntityTarget<BaseEntity>, id: number): Promise<DeleteResult> {
        const connection = await this.getConnection();

        return await connection
                .createQueryBuilder()
                .delete()
                .from(target)
                .where('id = :id', {id: id})
                .execute()
    }

    private async getConnection(): Promise<Connection> {
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
                    Library
                ],
                synchronize: true
            });
    
            await connection.connect();
        }

        return connection;
    }
}