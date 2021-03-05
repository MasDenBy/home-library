import 'reflect-metadata';

import { mock, instance, when, verify } from 'ts-mockito';

import { FileSystemWrapper } from '../../../src/common/services/fs.wrapper';
import { FileManagerService } from '../../../src/fm/services/filemanager.service';

describe('FileManagerService', () => {
    let service: FileManagerService;
    let fmMock: FileSystemWrapper;

    beforeEach(() => {
        fmMock = mock(FileSystemWrapper);
        service = new FileManagerService(instance(fmMock));
    });

    describe('directoryList', () => {
        test('path is not null get folders', async () => {
            // Arrange
            const path = '/';

            when(fmMock.readDirectory(path)).thenResolve([]);

            // Act
            await service.directoryList(path);

            // Assert
            verify(fmMock.osRoot()).never();
            verify(fmMock.readDirectory(path)).once();
        });

        test('path is null get root path', async () => {
            // Arrange
            const fullPath = '/root/';

            when(fmMock.osRoot()).thenReturn(fullPath);
            when(fmMock.readDirectory(fullPath)).thenResolve([]);

            // Act
            const result = await service.directoryList(null);

            // Assert
            expect(result.path).toBe(fullPath);
            expect(result.folders).not.toBeNull();

            verify(fmMock.osRoot()).once();
            verify(fmMock.readDirectory(fullPath)).once();
        });
    });
});