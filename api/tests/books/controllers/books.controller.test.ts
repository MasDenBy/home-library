import 'reflect-metadata';

import { Request } from 'express';

import { mock, instance, when, verify, deepEqual, anything } from 'ts-mockito';

import { BooksController } from '../../../src/books/controllers/books.controller';
import { BookSearchDto } from '../../../src/books/dto/book.search.dto';
import { BookService } from '../../../src/books/services/book.service';
import { Book } from '../../../src/common/dataaccess/entities/book.entity';
import { BookDto } from '../../../src/books/dto/book.dto';

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

    test('search', async () => {
        // Arrange
        const dto = <BookSearchDto> { pattern: 'book', offset: 0, count: 10 };

        when(bookServiceMock.search(dto)).thenResolve([new Book()]);

        const requestMock: Request = mock<Request>();
        when(requestMock.body).thenReturn(dto);

        // Act
        const result = await controller.search(instance(requestMock));

        // Assert
        expect(result.statusCode).toBe(200);
        expect(result.json).toBeTruthy();

        verify(bookServiceMock.search(dto)).once();
    });

    test('getBookById', async () => {
        // Arrange
        const id = 10;

        when(bookServiceMock.getById(id)).thenResolve(new Book());

        // Act
        const result = await controller.getBookById(id);

        // Assert
        expect(result.statusCode).toBe(200);
        expect(result.json).toBeTruthy();

        verify(bookServiceMock.getById(id)).once();
    });

    test('put', async () => {
        // Arrange
        const id = 10;
        const dto = <BookDto> { authors: null, description: null, title: null };

        const requestMock: Request = mock<Request>();
        when(requestMock.body).thenReturn(dto);

        // Act
        const result = await controller.put(id, instance(requestMock));

        // Assert
        expect(result.statusCode).toBe(204);

        verify(bookServiceMock.update(anything())).once();
    });

    test('removeBook', async () => {
        // Arrange
        const id = 10;

        // Act
        const result = await controller.removeBook(id);

        // Assert
        expect(result.statusCode).toBe(204);

        verify(bookServiceMock.deleteById(id)).once();
    });
});