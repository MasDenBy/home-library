import { injectable } from 'inversify';
import { Repository } from 'typeorm';

import { DatabaseWrapper } from '../../common/dataaccess/db.wrapper';
import { DataObject } from '../../common/dataaccess/data.object';
import { Book } from '../../common/dataaccess/entities/book.entity';
import { File } from '../../common/dataaccess/entities/file.entity';


@injectable()
export class BookDataObject extends DataObject {
    private alias: string = 'book';

    constructor(public database: DatabaseWrapper) {
        super(database);
    }

    public async findByIdWithReferences(id: number) : Promise<Book> {
        const repository = await this.database.getRepository(Book) as Repository<Book>;

        return await repository
            .createQueryBuilder(this.alias)
            .leftJoinAndSelect(`${this.alias}.file`, 'file')
            .where(`${this.alias}.id = :id`, { id: id })
            .getOne();
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

    public async deleteById(id: number): Promise<void> {
        const book = await this.findByIdWithReferences(id);

        await this.delete(File, book.file.id);
        await this.delete(Book, book.id);
    }

    public async deleteByFilePath(path: string): Promise<void> {
        const connection = await this.database.getConnection();

        const file = await connection.getRepository(File).findOne({ path: path });
        const book = await connection.getRepository(Book).findOne({ file: file });
        
        await this.deleteById(book.id);
    }
}