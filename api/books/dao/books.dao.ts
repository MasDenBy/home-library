import nanoid from 'nanoid';
import debug from 'debug';
import { injectable } from 'inversify';

import { BookDto } from "../dto/books.model";

const log: debug.IDebugger = debug('app:in-memory-dao');

@injectable()
export class BooksDao {
    books: Array<BookDto> = [];

    constructor() {
        log('Created new instance of BooksDao');
    }

    async addBook(book: BookDto) {
        book.id = nanoid.nanoid();
        this.books.push(book);
        return book.id;
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
    
    async patchBookById(book: BookDto) {
        const objIndex = this.books.findIndex((obj: { id: string; }) => obj.id === book.id);
        let currentBook = this.books[objIndex];
        const allowedPatchFields = ["title", "description", "authors"];
        for (let field of allowedPatchFields) {
            if (field in book) {
                // @ts-ignore
                currentBook[field] = book[field];
            }
        }
        this.books.splice(objIndex, 1, currentBook);
        return `${book.id} patched`;
    }

    async removeBookById(bookId: string) {
        const objIndex = this.books.findIndex((obj: { id: string; }) => obj.id === bookId);
        this.books.splice(objIndex, 1);
        return `${bookId} removed`;
    }
}