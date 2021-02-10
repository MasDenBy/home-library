import 'reflect-metadata';

import { mock, instance, when, verify } from 'ts-mockito';

import { BooksController } from '../../../src/books/controllers/books.controller';
import { BookService } from '../../../src/books/services/book.service';
import { Book } from '../../../src/common/dataaccess/entities/book.entity';

describe('BooksController', () => {
    let controller: BooksController;
    let bookServiceMock: BookService;

    beforeEach(() => {
        bookServiceMock = mock(BookService);
        controller = new BooksController(instance(bookServiceMock));
    });

    test('list', async () => {
        // Arrange
        const offset = 10;
        const count = 20;

        when(bookServiceMock.list(offset, count)).thenResolve([new Book()]);

        // Act
        const result = await controller.list(offset, count);

        // Assert
        expect(result.statusCode).toBe(200);
        expect(result.json).toBeTruthy();

        verify(bookServiceMock.list(offset, count)).once();
    });
});