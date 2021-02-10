import "reflect-metadata";

import { mock, instance, verify, when, anyString, anyOfClass } from 'ts-mockito';

import { BookService } from '../../../src/books/services/book.service';
import { Library } from '../../../src/common/dataaccess/entities/library.entity';
import { FileSystemWrapper } from '../../../src/common/services/fs.wrapper';
import { IndexerService } from '../../../src/common/services/indexer.service';

describe('IndexerService', () => {
    let indexer: IndexerService;
    let fsMock: FileSystemWrapper;
    let bookServiceMock: BookService;

    beforeEach(() => {
        fsMock = mock(FileSystemWrapper);
        bookServiceMock = mock(BookService);
        indexer = new IndexerService(instance(fsMock), instance(bookServiceMock));
    });

    test('index', async () => {
        // Arrange
        const lib1 = <Library> { path: '/lib1' };

        when(fsMock.readFiles(lib1.path)).thenResolve(['filename.book', 'second.book']);

        // Act
        await indexer.index([lib1]);

        // Assert
        verify(fsMock.readFiles(anyString())).once();
        verify(bookServiceMock.createFromFile(anyString(), lib1)).twice();    
    });
});