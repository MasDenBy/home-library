import { mock, instance, verify, when, anyOfClass } from 'ts-mockito';

import { BookDataObject } from '../../../src/books/dataaccess/book.dataobject';
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
});