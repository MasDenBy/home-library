import { Injectable } from "@nestjs/common";

import { Stream } from "stream";

import { Book } from "../database/book.entity";
import { File } from "../database/file.entity";
import { Library } from "../../libraries/database/library.entity";
import { Metadata } from "../database/metadata.entity";
import { IPage } from "../../core/common/dto/page.dto";
import { FileSystemWrapper } from "../../core/common/services/fs.wrapper";
import { ImageService } from "../../core/common/services/image.service";
import { OpenLibraryService } from "../../core/openlibrary/openlibrary.service";
import { BookDataStore } from '../database/book.datastore';

import { BookDto, FileDto, MetadataDto } from "../dto/book.dto";
import { BookSearchDto } from "../dto/book.search.dto";

@Injectable()
export class BookService {
    constructor(private dataStore: BookDataStore, private fs: FileSystemWrapper,
        private openLibraryService: OpenLibraryService, private imageService: ImageService) {}

    public async deleteById(id: number): Promise<void> {
        return await this.dataStore.deleteById(id);
    }

    public async deleteByFilePath(path: string): Promise<void> {
        return this.dataStore.deleteByFilePath(path);
    }

    public async list(offset: number, count: number): Promise<IPage<BookDto>> {
        const books = await this.dataStore.getBooks(offset, count);
        const totalCount = await this.dataStore.count();

        const dtos = [];

        for (const index in books) {
            dtos.push(await this.toDto(books[index]));
        }

        return <IPage<BookDto>> {
            data: dtos,
            count: totalCount
        }
    }

    public async search(dto: BookSearchDto): Promise<IPage<BookDto>> {
        const searchResult = await this.dataStore.searchBooks(dto.pattern, dto.offset, dto.count);

        const dtos = [];

        for (const index in searchResult[0]) {
            dtos.push(await this.toDto(searchResult[0][index]));
        }

        return <IPage<BookDto>> {
            data: dtos,
            count: searchResult[1]
        }
    }

    public async getById(id: number): Promise<BookDto> {
        const book = await this.dataStore.findByIdWithReferences(id);

        return await this.toDto(book);
    }

    public async update(id: number, dto: BookDto): Promise<void> {
        const book = await this.dataStore.findByIdWithReferences(id);

        book.authors = dto.authors;
        book.description = dto.description;
        book.title = dto.title;

        if(dto.metadata) {
            book.metadata = book.metadata ?? new Metadata();
            book.metadata.isbn = dto.metadata.isbn;
            book.metadata.pages = dto.metadata.pages || null;
            book.metadata.year = dto.metadata.year;
        }

        return await this.dataStore.update(book);
    }

    public async createFromFile(path: string, library: Library): Promise<void> {
        const book = <Book> {
            title: this.fs.basename(path),
            file: <File> {
                library: library,
                path: path
            }
        }

        await this.dataStore.addBook(book);
    }

    public async getFile(id: number): Promise<[Stream, string]> {
        const book = await this.dataStore.findByIdWithReferences(id);

        if(book?.file == null) return null;

        return [this.fs.readFileContent(book.file.path), this.fs.basenameExt(book.file.path)];
    }

    public async index(id: number): Promise<void> {
        const book = await this.dataStore.findByIdWithReferences(id);
        let isbn = book.metadata?.isbn;

        if(!isbn) {
            isbn = await this.openLibraryService.search(book.title);
        }

        if(!isbn) return;

        const bookInfo = await this.openLibraryService.findByIsbn(isbn);

        book.authors = bookInfo.details.authors.map(x => x.name).join(', ');
        book.description = bookInfo.details.description?.value;
        book.title = bookInfo.details.title;

        if(!book.metadata) {
            book.metadata = new Metadata();
        }

        book.metadata.isbn = isbn;
        book.metadata.pages = bookInfo.details.number_of_pages;
        book.metadata.year = bookInfo.details.publish_date;

        if(bookInfo.thumbnail_url) {
            const oldName = book.file.imageName;

            book.file.imageName = await this.imageService.download(bookInfo.thumbnail_url);

            if(oldName)
                this.imageService.remove(oldName);
        }

        await this.dataStore.update(book);
    }

    private async toDto(entity: Book): Promise<BookDto> {
        const dto = <BookDto> {
            id: entity.id,
            authors: entity.authors,
            description: entity.description,
            file: <FileDto> {
                id: entity.file.id,
                libraryId: entity.file.library?.id ?? null,
                path: entity.file.path
            },
            title: entity.title
        };

        if(entity.file.imageName) {
            dto.file.image = await this.imageService.getImageContent(entity.file.imageName);
        }

        if(entity.metadata) {
            dto.metadata = <MetadataDto> {
                id: entity.metadata.id,
                isbn: entity.metadata.isbn,
                pages: entity.metadata.pages,
                year: entity.metadata.year
            };
        }

        return dto;
    }
}