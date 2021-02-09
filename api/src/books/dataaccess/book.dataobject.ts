import debug from 'debug';
import { injectable } from 'inversify';
import { DatabaseWrapper } from '../../common/dataaccess/db.wrapper';
import { DataObject } from '../../common/dataaccess/data.object';

import { BookDto } from "../dto/books.model";
import { Book } from '../../common/dataaccess/entities/book.entity';

const log: debug.IDebugger = debug('app:in-memory-dao');

@injectable()
export class BookDataObject extends DataObject {
    books: Array<BookDto> = [];

    constructor(public database: DatabaseWrapper) {
        super(database);
    }

    public async addBook(book: Book): Promise<number> {
        const repository = await this.database.getRepository(Book);
        const newEntity = await repository.save(book);

        return newEntity.id;
    }

    async getBooks() {
        return this.books;
    }
    
    async getBookById(bookId: string) {
        return this.books.find((book: { id: string; }) => book.id === bookId);
    }

    async putBookById(book: BookDto) {
        const objIndex = this.books.findIndex((obj: { id: string; }) => obj.id === book.id);
        this.books.splice(objIndex, 1, book);
        return `${book.id} updated via put`;
    }

    async removeBookById(bookId: string) {
        const objIndex = this.books.findIndex((obj: { id: string; }) => obj.id === bookId);
        this.books.splice(objIndex, 1);
        return `${bookId} removed`;
    }
}