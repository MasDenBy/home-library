import { injectable } from "inversify";

import { BooksDao } from '../dao/books.dao';
import { BookDto } from "../dto/Books.model";

@injectable()
export class BooksService {

    constructor(private booksDao: BooksDao) {}

    async create(resource: BookDto) {
        return await this.booksDao.addBook(resource);
    }

    async deleteById(resourceId: string) {
        return await this.booksDao.removeBookById(resourceId);
    };

    async list(limit: number, page: number) {
        return await this.booksDao.getBooks();
    };

    async patchById(resource: BookDto) {
        return await this.booksDao.patchBookById(resource)
    };

    async readById(resourceId: string) {
        return await this.booksDao.getBookById(resourceId);
    };

    async updateById(resource: BookDto) {
        return await this.booksDao.putBookById(resource);
    };

    async getUserByEmail(email: string) {
        return this.booksDao.getBookById(email);
    }
}