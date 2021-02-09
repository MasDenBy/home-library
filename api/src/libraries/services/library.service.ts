import { injectable } from "inversify";
import { LibraryDataObject } from "../dataaccess/library.dataobject";
import { Library } from "../../common/dataaccess/entities/library.entity";
import { IndexerService } from "../../common/services/indexer.service";
import { LibraryDto } from "../dto/library.dto";

@injectable()
export class LibraryService {
    constructor(private libraryDataObject: LibraryDataObject, private indexer: IndexerService) { }

    public list(): Promise<Library[]> {
        return this.libraryDataObject.list(Library);
    }

    public async save(dto: LibraryDto): Promise<number> {
        const entity = LibraryService.toEntity(dto);

        return await this.libraryDataObject.save(entity);
    }

    public async getById(id: number): Promise<LibraryDto> {
        const entity = await this.libraryDataObject.findById<Library>(Library, id);

        return LibraryService.toDto(entity);
    }

    public async deleteById(id: number): Promise<any> {
        return await this.libraryDataObject.deleteById(Library, id);
    }

    public async index(ids: number[]): Promise<any> {
        const libs = await this.libraryDataObject.getByIds(ids);

        if(libs) {
            await this.indexer.index(libs);
        }
    }

    private static toDto(entity: Library): LibraryDto {
        const dto: LibraryDto = {
            id: entity.id,
            path: entity.path
        };

        return dto;
    }

    private static toEntity(dto: LibraryDto): Library {
        let entity = new Library();
        entity.id = dto.id;
        entity.path = dto.path;
        
        return entity;
    }
}