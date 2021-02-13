import { FSWatcher, ReadStream } from "fs";
import { injectable } from "inversify";
import { Stream } from "stream";
import { DeleteResult } from "typeorm";
import { Book } from "../../common/dataaccess/entities/book.entity";
import { File } from "../../common/dataaccess/entities/file.entity";
import { Library } from "../../common/dataaccess/entities/library.entity";
import { FileSystemWrapper } from "../../common/services/fs.wrapper";

import { BookDataObject } from '../dataaccess/book.dataobject';
import { BookDto } from "../dto/book.dto";
import { BookSearchDto } from "../dto/book.search.dto";

@injectable()
export class BookService {

    constructor(private dataObject: BookDataObject, private fs: FileSystemWrapper) {}

    public async deleteById(id: number): Promise<DeleteResult> {
        return await this.dataObject.deleteById(Book, id);
    }

    public async list(offset: number, count: number) {
        return await this.dataObject.getBooks(offset, count);
    }

    public async search(dto: BookSearchDto) {
        return await this.dataObject.searchBooks(dto.pattern, dto.offset, dto.count);
    }

    public async getById(id: number) {
        return await this.dataObject.findById(Book, id);
    }

    public async update(dto: BookDto) {
        return await this.dataObject.update(BookService.toEntity(dto));
    }

    public async createFromFile(path: string, library: Library): Promise<void> {
        let book = <Book> {
            title: this.fs.basename(path),
            file: <File> {
                library: library,
                path: path
            }
        }

        await this.dataObject.addBook(book);
    }

    public async getFile(id: number): Promise<[Stream, string]> {
        const book = await this.dataObject.findByIdWithReferences(id);

        if(book?.file == null) return null;

        return [this.fs.readFileContent(book.file.path), this.fs.basenameExt(book.file.path)];
    }

    private static toEntity(dto: BookDto): Book {
        return <Book> {
            id: dto.id,
            authors: dto.authors,
            description: dto.description,
            file: null,
            title: dto.title
        };
    }
}