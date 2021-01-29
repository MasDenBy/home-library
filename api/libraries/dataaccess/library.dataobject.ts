import { injectable } from "inversify";
import { DataObject } from "../../common";
import { Config } from "../../config";
import { Library } from "./library.entity";

@injectable()
export class LibraryDataObject extends DataObject {
    constructor(config: Config) {
        super(config);
    }

    public async save(entity: Library): Promise<number> {
        const repository = await this.getRepository(Library);
        const newEntity = await repository.save(entity);

        return newEntity.id;
    }
}