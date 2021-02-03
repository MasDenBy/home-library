import { injectable } from "inversify";
import { DatabaseWrapper, DataObject } from "../../common";
import { Library } from "./library.entity";

@injectable()
export class LibraryDataObject extends DataObject {
    constructor(database: DatabaseWrapper) {
        super(database);
    }

    public async save(entity: Library): Promise<number> {
        const repository = await this.database.getRepository(Library);
        const newEntity = await repository.save(entity);

        return newEntity.id;
    }
}