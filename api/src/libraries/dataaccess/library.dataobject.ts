import { injectable } from "inversify";
import { Repository } from "typeorm";
import { DatabaseWrapper } from "../../common/dataaccess/db.wrapper";
import { DataObject } from '../../common/dataaccess/data.object';
import { Library } from "../../common/dataaccess/entities/library.entity";

@injectable()
export class LibraryDataObject extends DataObject {
    private readonly alias = 'library';

    constructor(database: DatabaseWrapper) {
        super(database);
    }

    public async save(entity: Library): Promise<number> {
        const repository = await this.database.getRepository(Library);
        const newEntity = await repository.save(entity);

        return newEntity.id;
    }

    public async getByIds(ids: number[]): Promise<Library[]> {
        const repository = await this.database.getRepository(Library) as Repository<Library>;

        return await repository
            .createQueryBuilder(this.alias)
            .where(`${this.alias}.id IN (:...ids)`, { ids: ids })
            .getMany()
    }
}