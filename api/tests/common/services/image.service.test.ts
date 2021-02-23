import 'reflect-metadata';

import axios, { AxiosResponse } from 'axios';
import { mock, instance, when, verify, anyString, anything } from 'ts-mockito';

import { FileSystemWrapper } from '../../../src/common/services/fs.wrapper';
import { ImageService } from '../../../src/common/services/image.service';

jest.mock('axios');

describe('ImageService', () => {
    let service: ImageService;
    let fsMock: FileSystemWrapper;

    beforeEach(() => {
        jest.clearAllMocks();

        fsMock = mock(FileSystemWrapper);
        service = new ImageService(instance(fsMock));
    });

    test('download', async () => {
        // Arrange
        const axiosMock = axios as jest.Mocked<typeof axios>;
        axiosMock.get.mockResolvedValue(<AxiosResponse<any>>{ data: 'data' });

        when(fsMock.pathFromAppRoot(anyString())).thenReturn('root');

        // Act
        const name = await service.download('myfile-S.jpg');

        // Assert
        expect(name).not.toBeNull();

        expect(axiosMock.get).toHaveBeenCalledWith('myfile-M.jpg', { responseType: 'arraybuffer' });

        verify(fsMock.pathFromAppRoot(anyString())).once();
        verify(fsMock.checkOrCreateDirectory(anyString())).once();
        verify(fsMock.writeFile(anything(), anyString())).once();
    });

    test('remove', async () => {
        // Arrange
        when(fsMock.pathFromAppRoot(anyString())).thenReturn('root');

        // Act
        await service.remove('myfile-S.jpg');

        // Assert
        verify(fsMock.pathFromAppRoot(anyString())).once();
        verify(fsMock.deleteFile(anyString())).once();
    });

    test('getImageContent', async () => {
        // Arrange
        const fileName: string = 'myfile.png';

        when(fsMock.readFile(anyString())).thenResolve(Buffer.from("content"));
        when(fsMock.pathFromAppRoot(anyString())).thenReturn('root');

        // Act
        const content = await service.getImageContent(fileName);

        // Assert
        expect(content).not.toBeNull();

        verify(fsMock.readFile(anyString())).once();
    });
});