import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosResponse } from 'axios';
import { mock, instance, when, verify, anyString, anything } from 'ts-mockito';

import { FileSystemWrapper } from '../fs.wrapper';
import { ImageService } from '../image.service';

jest.mock('axios');

describe('ImageService', () => {
  let service: ImageService;
  let fsMock: FileSystemWrapper;
  let configService: ConfigService;
  let logger: Logger;

  beforeEach(() => {
    jest.clearAllMocks();

    fsMock = mock(FileSystemWrapper);
    configService = mock(ConfigService);
    logger = mock(Logger);

    service = new ImageService(
      instance(fsMock),
      instance(configService),
      instance(logger),
    );

    when(configService.get<string>('IMAGE_DIR')).thenReturn('images');
  });

  test('download', async () => {
    // Arrange
    const axiosMock = axios as jest.Mocked<typeof axios>;
    axiosMock.get.mockResolvedValue(<AxiosResponse<unknown>>{ data: 'data' });

    when(fsMock.pathFromAppRoot(anyString())).thenReturn('root');

    // Act
    const name = await service.download('myfile-S.jpg');

    // Assert
    expect(name).not.toBeNull();

    expect(axiosMock.get).toHaveBeenCalledWith('myfile-M.jpg', {
      responseType: 'arraybuffer',
    });

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

  describe('getImageContent', () => {
    const fileName = 'myfile.png';
    test('return Base64 string if success', async () => {
      // Arrange
      when(fsMock.readFile(anyString())).thenResolve(Buffer.from('content'));
      when(fsMock.pathFromAppRoot(anyString())).thenReturn('root');

      // Act
      const content = await service.getImageContent(fileName);

      // Assert
      expect(content).not.toBeNull();

      verify(fsMock.readFile(anyString())).once();
    });

    test('log exception if failure', async () => {
      // Arrange
      const error = new Error('File does not exist');

      when(fsMock.pathFromAppRoot(anyString())).thenThrow(error);

      // Act
      const content = await service.getImageContent(fileName);

      // Assert
      expect(content).toBeNull();

      verify(logger.error(error)).once();
    });
  });
});
