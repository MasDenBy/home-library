import 'reflect-metadata';

import { Request, Response } from 'express';

import { mock, instance, when, verify, anything } from 'ts-mockito';

import { BooksController } from '../../../src/books/controllers/books.controller';
import { BookSearchDto } from '../../../src/books/dto/book.search.dto';
import { BookService } from '../../../src/books/services/book.service';
import { BookDto } from '../../../src/books/dto/book.dto';
import { PassThrough } from 'stream';
import { IPage } from '../../../src/common/dto/page.dto';
import { OkResult } from 'inversify-express-utils/dts/results';
import { results } from 'inversify-express-utils';

describe('BooksController', () => {
    const id = 10;

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

        when(bookServiceMock.list(offset, count)).thenResolve(<IPage<BookDto>> {});

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

        when(bookServiceMock.search(dto)).thenResolve(<IPage<BookDto>> {});

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
        when(bookServiceMock.getById(id)).thenResolve(<BookDto>{});

        // Act
        const result = await controller.getBookById(id);

        // Assert
        expect(result.statusCode).toBe(200);
        expect(result.json).toBeTruthy();

        verify(bookServiceMock.getById(id)).once();
    });

    test('put', async () => {
        // Arrange
        const dto = <BookDto> { authors: null, description: null, title: null };

        const requestMock: Request = mock<Request>();
        when(requestMock.body).thenReturn(dto);

        // Act
        const result = await controller.put(id, instance(requestMock));

        // Assert
        expect(result.statusCode).toBe(204);

        verify(bookServiceMock.update(id, anything())).once();
    });

    test('removeBook', async () => {
        // Act
        const result = await controller.removeBook(id);

        // Assert
        expect(result.statusCode).toBe(204);

        verify(bookServiceMock.deleteById(id)).once();
    });

    test('getBookFile', async () => {
        // Arrange
        const fileName = 'file.name';

        const responseMock = mock<Response>();

        const streamMock = new PassThrough();
        streamMock.push("data");
        streamMock.end();

        when(bookServiceMock.getFile(id)).thenResolve([streamMock, fileName]);

        // Act
        await controller.getBookFile(id, instance(responseMock));

        // Assert
        verify(bookServiceMock.getFile(id)).once();
    });

    test('index', async () => {
        // Arrange

        // Act
        const result = await controller.index(id);

        // Assert
        expect(result).toBeInstanceOf(results.OkResult);

        verify(bookServiceMock.index(id)).once();
    });
});