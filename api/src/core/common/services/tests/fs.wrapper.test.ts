import { basename, extname, parse, ParsedPath, join } from 'path';
import { promisify } from 'util';
import { createReadStream, lstatSync, ReadStream, Stats, existsSync, mkdirSync, unlinkSync } from 'fs';

import { mock, instance, when } from 'ts-mockito';

import { FileSystemWrapper } from '../fs.wrapper';

jest.mock('path');
jest.mock('util');
jest.mock('fs');
jest.mock('app-root-path', () => {
    return {
        path: jest.fn().mockReturnValue('root')
    }
});

describe('FileSystemWrapper', () => {
    const testFileName = 'file.name';

    let wrapper: FileSystemWrapper;

    beforeEach(()=> {
        jest.resetAllMocks();
        wrapper = new FileSystemWrapper();
    });

    test('readFiles', async () => {
        // Arrange
        const readdirAsyncMock = jest.fn();
        readdirAsyncMock.mockReturnValueOnce(['file1.pdf', 'folder']);
        readdirAsyncMock.mockReturnValueOnce([]);

        const promisifyMock = promisify as jest.MockedFunction<typeof promisify>;
        promisifyMock.mockReturnValue(readdirAsyncMock);

        const fileStats = mock(Stats);
        when(fileStats.isDirectory()).thenReturn(false);
        when(fileStats.isFile()).thenReturn(true);

        const dirStats = mock(Stats);
        when(dirStats.isDirectory()).thenReturn(true);

        const lstatSyncMock = lstatSync as jest.MockedFunction<typeof lstatSync>;
        lstatSyncMock.mockReturnValueOnce(instance(fileStats));
        lstatSyncMock.mockReturnValueOnce(instance(dirStats));

        // Act
        const result = await wrapper.readFiles('folder');

        // Assert
        expect(result.length).toBe(1);
    });

    test('basename', () => {
        // Arrange
        const extension = '.pdf';
        const fileName = 'book.pdf';
        const returnValue = 'book';

        const extnameMock = extname as jest.MockedFunction<(p: string) => string>;
        extnameMock.mockReturnValue(extension);

        const basenameMock = basename as jest.MockedFunction<(filePath: string, extension: string) => string>;
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

        const basenameMock = basename as jest.MockedFunction<(filePath: string) => string>;
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

        const createReadStreamMock = createReadStream as jest.MockedFunction<(filePath: string) => ReadStream>;

        // Act
        wrapper.readFileContent(fileName);

        // Assert
        expect(createReadStreamMock).toHaveBeenCalledWith(fileName);
    });

    test('readDirectory', async () => {
        // Arrange
        const readdirAsyncMock = jest.fn();
        readdirAsyncMock.mockReturnValueOnce(['folder2', 'folder']);

        const promisifyMock = promisify as jest.MockedFunction<typeof promisify>;
        promisifyMock.mockReturnValue(readdirAsyncMock);

        const dirStats = mock(Stats);
        when(dirStats.isDirectory()).thenReturn(true);

        const lstatSyncMock = lstatSync as jest.MockedFunction<typeof lstatSync>;
        lstatSyncMock.mockReturnValue(instance(dirStats));

        // Act
        const result = await wrapper.readDirectory('folder');

        // Assert
        expect(result.length).toBe(2);
    });

    test('osRoot', () => {
        // Arrange
        const root = 'root';
        const cwdPath = '/';

        const parseMock = parse as jest.MockedFunction<(filePath: string) => ParsedPath>;
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
            expect(mkdirSyncMock).toHaveBeenCalledWith(testDir, { recursive:true });
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