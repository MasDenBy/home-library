import { mock, instance, when, verify } from 'ts-mockito';

import { FileManagerController } from './filemanager.controller';
import { FolderDto } from './folder.dto';
import { FileManagerService } from './services/filemanager.service';

describe('FileManagerController', () => {
    let controller: FileManagerController;
    let service: FileManagerService;

    beforeEach(() => {
        service = mock(FileManagerService);
        controller = new FileManagerController(instance(service));
    });

    test('list', async () => {
        // Arrange
        const path = '/';

        when(service.directoryList(path)).thenResolve(<FolderDto>{});

        // Act
        const result = await controller.list(path);

        // Assert
        expect(result).not.toBeNull();

        verify(service.directoryList(path)).once();
    });
});