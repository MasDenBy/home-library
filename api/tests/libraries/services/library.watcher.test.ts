import { mock, instance, verify } from 'ts-mockito';

import { BookService } from '../../../src/books/services/book.service';
import { LibraryWatcher } from '../../../src/libraries/services/library.watcher';

import { watch } from 'chokidar';
import { Library } from '../../../src/common/dataaccess/entities/library.entity';
import { EventEmitter } from 'events';

jest.mock('chokidar');

describe('LibraryWatcher', () => {
    let watcher: LibraryWatcher;
    let bookServiceMock: BookService;

    beforeEach(() => {
        jest.resetAllMocks();

        bookServiceMock = mock(BookService);
        watcher = new LibraryWatcher(instance(bookServiceMock));
    });

    describe('run', () => {
        const library = <Library>{ path: 'test' };
        const testPath = 'path';

        let watchMock: jest.MockedFunction<typeof watch>;
        let fsWatcherMock: EventEmitter;

        beforeEach(() => {
            fsWatcherMock = new EventEmitter();
            watchMock = watch as jest.MockedFunction<typeof watch>;
            watchMock.mockReturnValue(fsWatcherMock as never);
        });

        test('add new file', () => {
            // Act
            watcher.run(library);
    
            fsWatcherMock.emit('add', testPath);
    
            // Assert
            verify(bookServiceMock.createFromFile(testPath, library)).once();
        });

        test('delete file', () => {
            // Act
            watcher.run(library);
    
            fsWatcherMock.emit('unlink', testPath);
    
            // Assert
            verify(bookServiceMock.deleteByFilePath(testPath)).once();
        });
    })
});