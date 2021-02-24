import { injectable } from "inversify";
import { Stream } from "stream";

import { Book } from "../../common/dataaccess/entities/book.entity";
import { File } from "../../common/dataaccess/entities/file.entity";
import { Library } from "../../common/dataaccess/entities/library.entity";
import { Metadata } from "../../common/dataaccess/entities/metadata.entity";
import { IPage } from "../../common/dto/page.dto";
import { FileSystemWrapper } from "../../common/services/fs.wrapper";
import { ImageService } from "../../common/services/image.service";
import { OpenLibraryService } from "../../common/services/openlibrary";
import { BookDataObject } from '../dataaccess/book.dataobject';

import { BookDto, FileDto } from "../dto/book.dto";
import { BookSearchDto } from "../dto/book.search.dto";

@injectable()
export class BookService {

    constructor(private dataObject: BookDataObject, private fs: FileSystemWrapper,
        private openLibraryService: OpenLibraryService, private imageService: ImageService) {}

    public async deleteById(id: number): Promise<void> {
        return await this.dataObject.deleteById(id);
    }

    public async deleteByFilePath(path: string): Promise<void> {
        return this.dataObject.deleteByFilePath(path);
    }

    public async list(offset: number, count: number): Promise<IPage<BookDto>> {
        const books = await this.dataObject.getBooks(offset, count);
        const totalCount = await this.dataObject.count(Book);

        let dtos = [];

        for (let index in books) {
            dtos.push(await this.toDto(books[index]));
        }

        return <IPage<BookDto>> {
            data: dtos,
            count: totalCount
        }
    }

    public async search(dto: BookSearchDto): Promise<IPage<BookDto>> {
        const searchResult = await this.dataObject.searchBooks(dto.pattern, dto.offset, dto.count);

        let dtos = [];

        for (let index in searchResult[0]) {
            dtos.push(await this.toDto(searchResult[0][index]));
        }

        return <IPage<BookDto>> {
            data: dtos,
            count: searchResult[1]
        }
    }

    public async getById(id: number): Promise<BookDto> {
        const book = await this.dataObject.findByIdWithReferences(id);
        
        return await this.toDto(book);
    }

    public async update(id: number, dto: BookDto) {
        const book = await this.dataObject.findByIdWithReferences(id);

        book.authors = dto.authors;
        book.description = dto.description;
        book.title = dto.title;

        return await this.dataObject.update(book);
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

    public async index(id: number) {
        let book = await this.dataObject.findByIdWithReferences(id);
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

        await this.dataObject.update(book);
    }

    private async toDto(entity: Book): Promise<BookDto> {
        let dto = <BookDto> {
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

        return dto;
    }
}