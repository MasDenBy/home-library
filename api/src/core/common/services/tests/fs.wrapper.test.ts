import { basename, extname, parse, ParsedPath, join } from 'path';
import { promisify } from 'util';
import {
  createReadStream,
  lstatSync,
  ReadStream,
  Stats,
  existsSync,
  mkdirSync,
  unlinkSync,
} from 'fs';

import { mock, instance, when, anything, verify } from 'ts-mockito';

import { FileSystemWrapper } from '../fs.wrapper';
import { Logger } from '@nestjs/common';

jest.mock('path');
jest.mock('util');
jest.mock('fs');
jest.mock('app-root-path', () => {
  return {
    path: jest.fn().mockReturnValue('root'),
  };
});

describe('FileSystemWrapper', () => {
  const testFileName = 'file.name';

  let wrapper: FileSystemWrapper;
  let logger: Logger;

  beforeEach(() => {
    jest.resetAllMocks();
    logger = mock(Logger);
    wrapper = new FileSystemWrapper(instance(logger));
  });

  describe('readFiles', () => {
    let readdirAsyncMock: jest.Mock<any, any>;
    let promisifyMock: jest.MockedFunction<typeof promisify>;
    let lstatSyncMock: jest.MockedFunction<typeof lstatSync>;

    beforeEach(() => {
      readdirAsyncMock = jest.fn();
      readdirAsyncMock.mockReturnValueOnce(['file1.pdf', 'folder']);
      readdirAsyncMock.mockReturnValueOnce([]);

      promisifyMock = promisify as jest.MockedFunction<typeof promisify>;
      promisifyMock.mockReturnValue(readdirAsyncMock);

      lstatSyncMock = lstatSync as jest.MockedFunction<typeof lstatSync>;
    });

    test('successfully return files', async () => {
      // Arrange
      const fileStats = mock(Stats);
      when(fileStats.isDirectory()).thenReturn(false);
      when(fileStats.isFile()).thenReturn(true);
  
      const dirStats = mock(Stats);
      when(dirStats.isDirectory()).thenReturn(true);
  
      lstatSyncMock.mockReturnValueOnce(instance(fileStats));
      lstatSyncMock.mockReturnValueOnce(instance(dirStats));
  
      // Act
      const result = await wrapper.readFiles('folder');
  
      // Assert
      expect(result.length).toBe(1);
    });

    test('when the file/folder does not accessible then do not log the exception', async () => {
      // Arrange
      lstatSyncMock.mockImplementationOnce(() => {
        throw { code: 'EPERM' };
      });
      lstatSyncMock.mockImplementationOnce(() => {
        throw { code: 'EBUSY' };
      });

      // Act
      const result = await wrapper.readFiles('folder');
  
      // Assert
      expect(result.length).toBe(0);
      verify(logger.error(anything())).never();
    });

    test('when exception occurs then log the exception', async () => {
      // Arrange
      const expectedError = new Error('test');

      lstatSyncMock.mockImplementationOnce(() => {
        throw expectedError;
      });

      // Act
      await wrapper.readFiles('folder');
  
      // Assert
      verify(logger.error(expectedError)).once();
    });
  });

  test('basename', () => {
    // Arrange
    const extension = '.pdf';
    const fileName = 'book.pdf';
    const returnValue = 'book';

    const extnameMock = extname as jest.MockedFunction<(p: string) => string>;
    extnameMock.mockReturnValue(extension);

    const basenameMock = basename as jest.MockedFunction<
      (filePath: string, extension: string) => string
    >;
    basenameMock.mockReturnValue(returnValue);

    // Act
    const actual = wrapper.basename(fileName);

    // Assert
    expect(actual).toBe(returnValue);

    expect(extnameMock).toHaveBeenCalledWith(fileName);
    expect(basenameMock).toHaveBeenCalledWith(fileName, extension);
  });

  test('basenameExt', () => {
    // Arrange
    const fileName = 'fullpath/book.pdf';
    const returnValue = 'book.pdf';

    const basenameMock = basename as jest.MockedFunction<
      (filePath: string) => string
    >;
    basenameMock.mockReturnValue(returnValue);

    // Act
    const actual = wrapper.basenameExt(fileName);

    // Assert
    expect(actual).toBe(returnValue);

    expect(basenameMock).toHaveBeenCalledWith(fileName);
  });

  test('readFileContent', () => {
    // Arrange
    const fileName = 'fullpath/book.pdf';

    const createReadStreamMock = createReadStream as jest.MockedFunction<
      (filePath: string) => ReadStream
    >;

    // Act
    wrapper.readFileContent(fileName);

    // Assert
    expect(createReadStreamMock).toHaveBeenCalledWith(fileName);
  });

  describe('readDirectory', () => {
    let readdirAsyncMock: jest.Mock<any, any>;
    let promisifyMock: jest.MockedFunction<typeof promisify>;
    let lstatSyncMock: jest.MockedFunction<typeof lstatSync>;

    beforeEach(() => {
      readdirAsyncMock = jest.fn();
      readdirAsyncMock.mockReturnValueOnce(['folder2', 'folder']);

      promisifyMock = promisify as jest.MockedFunction<typeof promisify>;
      promisifyMock.mockReturnValue(readdirAsyncMock);

      lstatSyncMock = lstatSync as jest.MockedFunction<typeof lstatSync>;
    });

    test('successfully return folders', async () => {
      // Arrange
      const dirStats = mock(Stats);
      when(dirStats.isDirectory()).thenReturn(true);
  
      lstatSyncMock.mockReturnValue(instance(dirStats));
  
      // Act
      const result = await wrapper.readDirectory('folder');
  
      // Assert
      expect(result.length).toBe(2);
    });

    test('when the folder does not accessible then do not log the exception', async () => {
      // Arrange
      lstatSyncMock.mockImplementationOnce(() => {
        throw { code: 'EPERM' };
      });
      lstatSyncMock.mockImplementationOnce(() => {
        throw { code: 'EBUSY' };
      });

      // Act
      const result = await wrapper.readDirectory('folder');
  
      // Assert
      expect(result.length).toBe(0);
      verify(logger.error(anything())).never();
    });

    test('when exception occurs then log the exception', async () => {
      // Arrange
      const expectedError = new Error('test');

      lstatSyncMock.mockImplementationOnce(() => {
        throw expectedError;
      });

      // Act
      await wrapper.readDirectory('folder');
  
      // Assert
      verify(logger.error(expectedError)).once();
    });
  });

  test('osRoot', () => {
    // Arrange
    const root = 'root';
    const cwdPath = '/';

    const parseMock = parse as jest.MockedFunction<
      (filePath: string) => ParsedPath
    >;
    parseMock.mockReturnValue(<ParsedPath>{ root: root });

    const spy = jest.spyOn(process, 'cwd');
    spy.mockReturnValue(cwdPath);

    // Act
    wrapper.osRoot();

    // Assert
    expect(parseMock).toHaveBeenCalledWith(cwdPath);
  });

  test('pathFromAppRoot', () => {
    const joinMock = join as jest.MockedFunction<typeof join>;

    // Act
    wrapper.pathFromAppRoot('directory');

    // Assert
    expect(joinMock).toHaveBeenCalled();
  });

  test('writeFile', async () => {
    // Arrange
    const testContent = 'content';

    const writeFileAsyncMock = jest.fn();

    const promisifyMock = promisify as jest.MockedFunction<typeof promisify>;
    promisifyMock.mockReturnValue(writeFileAsyncMock);

    // Act
    await wrapper.writeFile(testContent, testFileName);

    // Assert
    expect(writeFileAsyncMock).toHaveBeenCalledWith(testFileName, testContent);
  });

  test('deleteFile', async () => {
    // Arrange
    const unlinkSyncMock = unlinkSync as jest.MockedFunction<typeof unlinkSync>;

    // Act
    await wrapper.deleteFile(testFileName);

    // Assert
    expect(unlinkSyncMock).toHaveBeenCalledWith(testFileName);
  });

  test('readFile', async () => {
    // Arrange
    const readFileAsyncMock = jest.fn();

    const promisifyMock = promisify as jest.MockedFunction<typeof promisify>;
    promisifyMock.mockReturnValue(readFileAsyncMock);

    // Act
    await wrapper.readFile(testFileName);

    // Assert
    expect(readFileAsyncMock).toHaveBeenCalledWith(testFileName);
  });

  describe('checkOrCreateDirectory', () => {
    const testDir = 'test';

    let existsSyncMock: jest.MockedFunction<typeof existsSync>;
    let mkdirSyncMock: jest.MockedFunction<typeof mkdirSync>;

    beforeEach(() => {
      jest.clearAllMocks();

      existsSyncMock = existsSync as jest.MockedFunction<typeof existsSync>;
      mkdirSyncMock = mkdirSync as jest.MockedFunction<typeof mkdirSync>;
    });

    test('if directory does not exist then create', () => {
      // Arrange
      existsSyncMock.mockReturnValue(false);

      // Act
      wrapper.checkOrCreateDirectory(testDir);

      // Assert
      expect(existsSyncMock).toHaveBeenCalledWith(testDir);
      expect(mkdirSyncMock).toHaveBeenCalledWith(testDir, { recursive: true });
    });

    test('if directory exists then skip creation', () => {
      // Arrange
      existsSyncMock.mockReturnValue(true);

      // Act
      wrapper.checkOrCreateDirectory(testDir);

      // Assert
      expect(existsSyncMock).toHaveBeenCalledWith(testDir);
      expect(mkdirSyncMock).not.toHaveBeenCalled();
    });
  });
});
