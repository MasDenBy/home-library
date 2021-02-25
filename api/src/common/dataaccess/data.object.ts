import { injectable } from "inversify";
import { EntityTarget, DeleteResult } from "typeorm";
import { BaseEntity } from './entities/base.entity';
import { DatabaseWrapper } from "./db.wrapper";

@injectable()
export abstract class DataObject {
    constructor(public database: DatabaseWrapper) { }

    public async list<TEntity extends BaseEntity>(target: EntityTarget<BaseEntity>): Promise<TEntity[]> {
        return (await this.database.getRepository(target)).find() as Promise<TEntity[]>;
    }

    public async findById<TEntity extends BaseEntity>(target: EntityTarget<BaseEntity>, id: number): Promise<TEntity> {
        return (await this.database.getRepository(target)).findOne({ id: id }) as Promise<TEntity>;
    }

    public async delete(target: EntityTarget<BaseEntity>, id: number): Promise<DeleteResult> {
        const connection = await this.database.getConnection();

        return await connection
                .createQueryBuilder()
                .delete()
                .from(target)
                .where('id = :id', {id: id})
                .execute();
    }

    public async count(target: EntityTarget<BaseEntity>): Promise<number> {
        return (await this.database.getRepository(target)).count();
    }
}