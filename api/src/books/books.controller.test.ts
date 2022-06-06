import { Response } from 'express';

import { mock, instance, when, verify, anything } from 'ts-mockito';

import { BooksController } from './books.controller';
import { BookSearchDto } from './dto/book.search.dto';
import { BookService } from './services/book.service';
import { BookDto } from './dto/book.dto';
import { PassThrough } from 'stream';
import { PageDto } from '../core/common/dto/page.dto';

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
    const queryDto = {
      offset: 10,
      count: 20,
    };

    when(bookServiceMock.list(queryDto.offset, queryDto.count)).thenResolve(
      <PageDto<BookDto>>{},
    );

    // Act
    await controller.list(queryDto);

    // Assert
    verify(bookServiceMock.list(queryDto.offset, queryDto.count)).once();
  });

  test('search', async () => {
    // Arrange
    const dto = <BookSearchDto>{ pattern: 'book', offset: 0, count: 10 };

    when(bookServiceMock.search(dto)).thenResolve(<PageDto<BookDto>>{});

    // Act
    await controller.search(dto);

    // Assert
    verify(bookServiceMock.search(dto)).once();
  });

  test('getBookById', async () => {
    // Arrange
    when(bookServiceMock.getById(id)).thenResolve(<BookDto>{});

    // Act
    await controller.getBookById(id);

    // Assert
    verify(bookServiceMock.getById(id)).once();
  });

  test('put', async () => {
    // Arrange
    const dto = <BookDto>{ authors: null, description: null, title: null };

    // Act
    await controller.put(id, dto);

    // Assert
    verify(bookServiceMock.update(id, anything())).once();
  });

  test('removeBook', async () => {
    // Act
    await controller.removeBook(id);

    // Assert
    verify(bookServiceMock.deleteById(id)).once();
  });

  test('getBookFile', async () => {
    // Arrange
    const fileName = 'file.name';

    const responseMock = mock<Response>();

    const streamMock = new PassThrough();
    streamMock.push('data');
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
    await controller.index(id);

    // Assert
    verify(bookServiceMock.index(id)).once();
  });
});
