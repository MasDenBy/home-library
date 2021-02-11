import { mock, instance, verify, when, anyOfClass, deepEqual } from 'ts-mockito';

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

        // Act
        await service.list(offset, count);

        // Assert
        verify(dataObjectMock.getBooks(offset, count)).once();
    });

    test('search', async () => {
        // Arrange
        const dto = <BookSearchDto> { pattern: 'book', offset: 0, count: 10 };

        // Act
        await service.search(dto);

        // Assert
        verify(dataObjectMock.searchBooks(dto.pattern, dto.offset, dto.count)).once();
    });

    test('getById', async () => {
        // Arrange
        const id = 10;

        // Act
        await service.getById(id);

        // Assert
        verify(dataObjectMock.findById(Book, id)).once();
    });

    test('update', async () => {
        // Arrange
        const dto = <BookDto> { id:10, authors: null, description: null, title: null };

        // Act
        await service.update(dto);

        // Assert
        verify(dataObjectMock.update(deepEqual({file: null, ...dto}))).once();
    });
});