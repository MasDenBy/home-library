import {
  mock,
  instance,
  verify,
  when,
  anyOfClass,
  anything,
  anyString,
  objectContaining,
} from 'ts-mockito';
import { ReadStream } from 'typeorm/platform/PlatformTools';

import { BookDataStore } from '../database/book.datastore';
import { BookDto, MetadataDto } from '../dto/book.dto';
import { BookSearchDto } from '../dto/book.search.dto';
import { BookService } from './book.service';
import { Book } from '../database/book.entity';
import { Library } from '../../libraries/database/library.entity';
import { Metadata } from '../database/metadata.entity';
import { FileSystemWrapper } from '../../core/common/services/fs.wrapper';
import { ImageService } from '../../core/common/services/image.service';
import { OpenLibraryService } from '../../core/openlibrary/openlibrary.service';
import { BookInfo } from '../../core/openlibrary/openlibrary.dto';

describe('BookService', () => {
  const id = 10;

  let service: BookService;
  let dataStoreMock: BookDataStore;
  let fsMock: FileSystemWrapper;
  let openlibraryMock: OpenLibraryService;
  let imageServiceMock: ImageService;

  beforeEach(() => {
    dataStoreMock = mock(BookDataStore);
    fsMock = mock(FileSystemWrapper);
    openlibraryMock = mock(OpenLibraryService);
    imageServiceMock = mock(ImageService);

    service = new BookService(
      instance(dataStoreMock),
      instance(fsMock),
      instance(openlibraryMock),
      instance(imageServiceMock),
    );
  });

  test('createFromFile', async () => {
    // Arrange
    const fileName = 'test.book.pdf';

    when(fsMock.basename(fileName)).thenReturn('test.book');

    // Act
    await service.createFromFile(fileName, new Library());

    // Assert
    verify(dataStoreMock.addBook(anyOfClass(Book)));
  });

  test('list', async () => {
    // Arrange
    const offset = 10;
    const count = 20;
    const book = <Book>{ file: {} };

    when(dataStoreMock.getBooks(offset, count)).thenResolve([book]);

    // Act
    await service.list(offset, count);

    // Assert
    verify(dataStoreMock.getBooks(offset, count)).once();
    verify(dataStoreMock.count()).once();
  });

  test('search', async () => {
    // Arrange
    const dto = <BookSearchDto>{ pattern: 'book', offset: 0, count: 10 };
    const book = <Book>{ file: {} };

    when(
      dataStoreMock.searchBooks(dto.pattern, dto.offset, dto.count),
    ).thenResolve([[book], 10]);

    // Act
    await service.search(dto);

    // Assert
    verify(
      dataStoreMock.searchBooks(dto.pattern, dto.offset, dto.count),
    ).once();
  });

  test('getById', async () => {
    // Arrange
    const book = <Book>{
      file: { imageName: 'image.png' },
      metadata: { isbn: 'isbn' },
    };

    when(dataStoreMock.findByIdWithReferences(id)).thenResolve(book);

    // Act
    await service.getById(id);

    // Assert
    verify(dataStoreMock.findByIdWithReferences(id)).once();
    verify(imageServiceMock.getImageContent(book.file.imageName)).once();
  });

  describe('update', () => {
    const dto = <BookDto>{
      id: 10,
      authors: null,
      description: null,
      title: null,
    };

    test('works', async () => {
      // Arrange

      when(dataStoreMock.findByIdWithReferences(dto.id)).thenResolve(<Book>{
        metadata: {} as MetadataDto,
      });

      // Act
      await service.update(dto.id, dto);

      // Assert
      verify(dataStoreMock.findByIdWithReferences(dto.id)).once();
      verify(dataStoreMock.update(anything())).once();
    });

    test('should create metadata if it is null', async () => {
      // Arrange
      dto.metadata = { isbn: 'isbn', id: 0, pages: 100, year: '1987' };

      when(dataStoreMock.findByIdWithReferences(dto.id)).thenResolve(<Book>{});

      // Act
      await service.update(dto.id, dto);

      // Assert
      verify(dataStoreMock.findByIdWithReferences(dto.id)).once();
      verify(
        dataStoreMock.update(objectContaining({ metadata: {} } as Book)),
      ).once();
    });
  });

  test('deleteById', async () => {
    // Act
    await service.deleteById(id);

    // Assert
    verify(dataStoreMock.deleteById(id)).once();
  });

  describe('getFile', () => {
    test('book is null should return null', async () => {
      // Arrange
      when(dataStoreMock.findByIdWithReferences(id)).thenResolve(null);

      // Act
      const result = await service.getFile(id);

      // Assert
      expect(result).toBeNull();
    });

    test('file is null should return null', async () => {
      // Arrange
      when(dataStoreMock.findByIdWithReferences(id)).thenResolve(<Book>{});

      // Act
      const result = await service.getFile(id);

      // Assert
      expect(result).toBeNull();
    });

    test('return stream and file name', async () => {
      // Arrange
      const book = <Book>{ file: { path: 'path' } };
      const readStream = mock(ReadStream);

      when(dataStoreMock.findByIdWithReferences(id)).thenResolve(book);
      when(fsMock.readFileContent(book.file.path)).thenReturn(
        instance(readStream),
      );
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
      verify(dataStoreMock.deleteByFilePath(path)).once();
    });
  });

  describe('index', () => {
    test('metadata is missing then search in openlibrary', async () => {
      // Arrange
      const book = <Book>{ metadata: null, title: 'title' };

      when(dataStoreMock.findByIdWithReferences(id)).thenResolve(book);

      // Act
      await service.index(id);

      // Assert
      verify(openlibraryMock.search(book.title)).once();
    });

    test('ISBN is missing then search in openlibrary', async () => {
      // Arrange
      const book = <Book>{ metadata: <Metadata>{ isbn: null }, title: 'title' };

      when(dataStoreMock.findByIdWithReferences(id)).thenResolve(book);

      // Act
      await service.index(id);

      // Assert
      verify(openlibraryMock.search(book.title)).once();
    });

    test('when ISBN is not found then stop processing', async () => {
      // Arrange
      const book = <Book>{ metadata: <Metadata>{ isbn: null }, title: 'title' };

      when(dataStoreMock.findByIdWithReferences(id)).thenResolve(book);

      // Act
      await service.index(id);

      // Assert
      verify(openlibraryMock.findByIsbn(anyString())).never();
    });

    describe('should', () => {
      const isbn = 'isbn';
      const oldImageName = 'old_image';
      const newImageName = 'new_image';
      const authorName = 'author1';

      const bookInfo = <BookInfo>{
        details: {
          number_of_pages: 15,
          authors: [{ name: authorName }],
          description: { value: 'description' },
          publish_date: '1985',
          title: 'book title',
        },
        thumbnail_url: 'url',
      };

      beforeEach(async () => {
        // Arrange
        const book = <Book>{
          title: 'title',
          file: { imageName: oldImageName },
        };

        when(dataStoreMock.findByIdWithReferences(id)).thenResolve(book);

        when(openlibraryMock.search(book.title)).thenResolve(isbn);
        when(openlibraryMock.findByIsbn(isbn)).thenResolve(bookInfo);

        when(imageServiceMock.download(bookInfo.thumbnail_url)).thenResolve(
          newImageName,
        );

        // Act
        await service.index(id);
      });

      test('create metadata if missing', () => {
        // Assert
        verify(
          dataStoreMock.update(
            objectContaining(<Book>{ metadata: { isbn: isbn } }),
          ),
        ).once();
      });

      test('remove old image and download new', () => {
        // Assert
        verify(imageServiceMock.download(bookInfo.thumbnail_url)).once();
        verify(imageServiceMock.remove(oldImageName)).once();
      });

      test('update book with all details', () => {
        // Assert
        verify(
          dataStoreMock.update(
            objectContaining(<Book>{
              authors: authorName,
              description: bookInfo.details.description.value,
              title: bookInfo.details.title,
              metadata: {
                isbn: isbn,
                pages: bookInfo.details.number_of_pages,
                year: bookInfo.details.publish_date,
              },
              file: {
                imageName: newImageName,
              },
            }),
          ),
        ).once();
      });
    });
  });
});
