import { injectable } from 'inversify';
import { Repository } from 'typeorm';

import { DatabaseWrapper } from '../../common/dataaccess/db.wrapper';
import { DataObject } from '../../common/dataaccess/data.object';
import { Book } from '../../common/dataaccess/entities/book.entity';
import { File } from '../../common/dataaccess/entities/file.entity';

import debug from 'debug';
const debugLog: debug.IDebugger = debug('app:book.dataobject');

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
            .leftJoinAndSelect(`${this.alias}.metadata`, 'metadata')
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
            .leftJoinAndSelect(`${this.alias}.file`, 'file')
            .skip(offset)
            .take(count)
            .getMany()
    }

    public async searchBooks(pattern: string, offset: number, count: number): Promise<[Book[], number]> {
        const repository = await this.database.getRepository(Book) as Repository<Book>;

        const builder = repository
            .createQueryBuilder(this.alias)
            .where(`${this.alias}.title LIKE :title`, {title: `%${pattern}%`})
            .orWhere(`${this.alias}.description LIKE :description`, {description: `%${pattern}%`})
            .orWhere(`${this.alias}.authors LIKE :authors`, {authors: `%${pattern}%`});

        const books = await builder
            .leftJoinAndSelect(`${this.alias}.file`, 'file')
            .skip(offset)
            .take(count)
            .getMany()

        const totalCount = await builder.getCount();

        return [books, totalCount];
    }

    public async update(book: Book): Promise<void> {
        const connection = await this.database.getConnection();
        const queryRunner = connection.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            if(book.metadata)
                await queryRunner.manager.save(book.metadata);

            if(book.file)
                await queryRunner.manager.save(book.file);

            await queryRunner.manager.save(book);

            await queryRunner.commitTransaction();
        } catch (ex) {
            debugLog(ex);
            await queryRunner.rollbackTransaction();
        } finally {
            queryRunner.release();
        }
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