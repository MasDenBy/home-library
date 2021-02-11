import { injectable } from 'inversify';
import { DatabaseWrapper } from '../../common/dataaccess/db.wrapper';
import { DataObject } from '../../common/dataaccess/data.object';

import { BookDto } from "../dto/book.dto";
import { Book } from '../../common/dataaccess/entities/book.entity';
import { Repository } from 'typeorm';
import { skips } from 'debug';

@injectable()
export class BookDataObject extends DataObject {
    private alias: string = 'book';

    constructor(public database: DatabaseWrapper) {
        super(database);
    }

    public async addBook(book: Book): Promise<number> {
        const repository = await this.database.getRepository(Book);
        const newEntity = await repository.save(book);

        return newEntity.id;
    }

    public async getBooks(offset: number, count: number): Promise<Book[]> {
        const repository = await this.database.getRepository(Book) as Repository<Book>;

        return await repository
            .createQueryBuilder(this.alias)
            .skip(offset)
            .take(count)
            .getMany()
    }

    public async searchBooks(pattern: string, offset: number, count: number): Promise<Book[]> {
        const repository = await this.database.getRepository(Book) as Repository<Book>;

        return await repository
            .createQueryBuilder(this.alias)
            .where(`${this.alias}.title LIKE :title`, {title: `%${pattern}%`})
            .orWhere(`${this.alias}.description LIKE :description`, {description: `%${pattern}%`})
            .orWhere(`${this.alias}.authors LIKE :authors`, {authors: `%${pattern}%`})
            .skip(offset)
            .take(count)
            .getMany()
    }

    public async update(book: Book): Promise<void> {
        const repository = await this.database.getRepository(Book) as Repository<Book>;

        await repository
            .createQueryBuilder()
            .update(Book)
            .set({ title: book.title, authors: book.authors, description: book.description })
            .where("id = :id", { id: book.id })
            .execute();
    }

    async removeBookById(bookId: string) {
        return `${bookId} removed`;
    }
}