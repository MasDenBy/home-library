import { mock, instance, verify, when, anyString } from 'ts-mockito';

import { BookService } from '../../../books/services/book.service';
import { Library } from '../../database/library.entity';
import { FileSystemWrapper } from '../../../core/common/services/fs.wrapper';
import { IndexerService } from '../../services/indexer.service';
import { LibraryWatcher } from '../../services/library.watcher';

describe('IndexerService', () => {
  let indexer: IndexerService;
  let fsMock: FileSystemWrapper;
  let bookServiceMock: BookService;
  let watcherMock: LibraryWatcher;

  beforeEach(() => {
    fsMock = mock(FileSystemWrapper);
    bookServiceMock = mock(BookService);
    watcherMock = mock(LibraryWatcher);
    indexer = new IndexerService(
      instance(fsMock),
      instance(bookServiceMock),
      instance(watcherMock),
    );
  });

  test('index', async () => {
    // Arrange
    const lib1 = <Library>{ path: '/lib1' };

    when(fsMock.readFiles(lib1.path)).thenResolve([
      'filename.book',
      'second.book',
    ]);

    // Act
    await indexer.index(lib1);

    // Assert
    verify(fsMock.readFiles(anyString())).once();
    verify(bookServiceMock.createFromFile(anyString(), lib1)).twice();
    verify(watcherMock.run(lib1)).once();
  });
});
