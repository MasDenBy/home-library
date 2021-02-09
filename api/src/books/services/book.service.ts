import { injectable } from "inversify";
import { Book } from "../../common/dataaccess/entities/book.entity";
import { File } from "../../common/dataaccess/entities/file.entity";
import { Library } from "../../common/dataaccess/entities/library.entity";
import { FileSystemWrapper } from "../../common/services/fs.wrapper";

import { BookDataObject } from '../dataaccess/book.dataobject';
import { BookDto } from "../dto/Books.model";

@injectable()
export class BookService {

    constructor(private bookDao: BookDataObject, private fs: FileSystemWrapper) {}

    public async create(resource: BookDto) {
        const book = <Book>{};
        return await this.bookDao.addBook(book);
    }

    public async deleteById(resourceId: string) {
        return await this.bookDao.removeBookById(resourceId);
    }

    public async list(limit: number, page: number) {
        return await this.bookDao.getBooks();
    }

    public async getById(resourceId: string) {
        return await this.bookDao.getBookById(resourceId);
    }

    public async update(resource: BookDto) {
        return await this.bookDao.putBookById(resource);
    }

    public async createFromFile(path: string, library: Library): Promise<void> {
        let book = <Book> {
            title: this.fs.basename(path),
            file: <File> {
                library: library,
                path: path
            }
        }

        await this.bookDao.addBook(book);
    }
}