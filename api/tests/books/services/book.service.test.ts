import { off } from 'process';
import { mock, instance, verify, when, anyOfClass, deepEqual, anything } from 'ts-mockito';
import { ReadStream } from 'typeorm/platform/PlatformTools';

import { BookDataObject } from '../../../src/books/dataaccess/book.dataobject';
import { BookDto } from '../../../src/books/dto/book.dto';
import { BookSearchDto } from '../../../src/books/dto/book.search.dto';
import { BookService } from '../../../src/books/services/book.service';
import { Book } from '../../../src/common/dataaccess/entities/book.entity';
import { Library } from '../../../src/common/dataaccess/entities/library.entity';
import { FileSystemWrapper } from '../../../src/common/services/fs.wrapper';

describe('BookService', () => {
    let service: BookService;
    let dataObjectMock: BookDataObject;
    let fsMock: FileSystemWrapper;

    beforeEach(()=> {
        dataObjectMock = mock(BookDataObject);
        fsMock = mock(FileSystemWrapper);

        service = new BookService(instance(dataObjectMock), instance(fsMock));
    });

    test('createFromFile', async () => {
        // Arrange
        const fileName = 'test.book.pdf';

        when(fsMock.basename(fileName)).thenReturn('test.book');

        // Act
        await service.createFromFile(fileName, new Library());

        // Assert
        verify(dataObjectMock.addBook(anyOfClass(Book)));
    });

    test('list', async () => {
        // Arrange
        const offset = 10;
        const count = 20;
        const book = <Book>{ file: {} };

        when(dataObjectMock.getBooks(offset, count)).thenResolve([book]);

        // Act
        await service.list(offset, count);

        // Assert
        verify(dataObjectMock.getBooks(offset, count)).once();
        verify(dataObjectMock.count(Book)).once();
    });

    test('search', async () => {
        // Arrange
        const dto = <BookSearchDto> { pattern: 'book', offset: 0, count: 10 };
        const book = <Book>{ file: {} };

        when(dataObjectMock.searchBooks(dto.pattern, dto.offset, dto.count)).thenResolve([[book], 10]);

        // Act
        await service.search(dto);

        // Assert
        verify(dataObjectMock.searchBooks(dto.pattern, dto.offset, dto.count)).once();
    });

    test('getById', async () => {
        // Arrange
        const id = 10;
        const book = <Book>{ file: {} };

        when(dataObjectMock.findByIdWithReferences(id)).thenResolve(book);

        // Act
        await service.getById(id);

        // Assert
        verify(dataObjectMock.findByIdWithReferences(id)).once();
    });

    test('update', async () => {
        // Arrange
        const dto = <BookDto> { id:10, authors: null, description: null, title: null };

        // Act
        await service.update(dto);

        // Assert
        verify(dataObjectMock.update(anything())).once();
    });

    test('deleteById', async () => {
        // Arrange
        const id = 10;

        // Act
        await service.deleteById(id);

        // Assert
        verify(dataObjectMock.deleteById(id)).once();
    });

    describe('getFile', () => {
        const id = 10;

        test('book is null should return null', async () => {
            // Arrange
            when(dataObjectMock.findByIdWithReferences(id)).thenResolve(null);

            // Act
            const result = await service.getFile(id);

            // Assert
            expect(result).toBeNull();
        });

        test('file is null should return null', async () => {
            // Arrange
            when(dataObjectMock.findByIdWithReferences(id)).thenResolve(<Book>{});

            // Act
            const result = await service.getFile(id);

            // Assert
            expect(result).toBeNull();
        });

        test('return stream and file name', async () => {
            // Arrange
            const book = <Book>{ file: { path: 'path' }};
            const readStream = mock(ReadStream);

            when(dataObjectMock.findByIdWithReferences(id)).thenResolve(book);
            when(fsMock.readFileContent(book.file.path)).thenReturn(instance(readStream));
            when(fsMock.basenameExt(book.file.path)).thenReturn('file.txt');

            // Act
            const result = await service.getFile(id);

            // Assert
            expect(result).not.toBeNull();
            expect(result[0]).not.toBeNull();
            expect(result[1]).not.toBeNull();

            verify(fsMock.readFileContent(book.file.path));
            verify(fsMock.basenameExt(book.file.path));
        });

        test('deleteByFilePath', async () => {
            // Arrange
            const path = 'file.dat';
    
            // Act
            await service.deleteByFilePath(path);
    
            // Assert
            verify(dataObjectMock.deleteByFilePath(path)).once();
        });
    });
});