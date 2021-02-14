import 'reflect-metadata';

import { basename, extname, join, parse, ParsedPath } from 'path';
import { promisify } from 'util';
import { createReadStream, lstatSync, ReadStream, Stats } from 'fs';

import { mock, instance, when } from 'ts-mockito';

import { FileSystemWrapper } from '../../../src/common/services/fs.wrapper';

jest.mock('path');
jest.mock('util');
jest.mock('fs');

describe('FileSystemWrapper', () => {
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

    test('pathFromRoot', () => {
        // Arrange
        const root = 'root';
        const cwdPath = '/';

        const parseMock = parse as jest.MockedFunction<(filePath: string) => ParsedPath>;
        parseMock.mockReturnValue(<ParsedPath>{ root: root });

        const joinMock = join as jest.MockedFunction<typeof join>;

        const spy = jest.spyOn(process, 'cwd');
        spy.mockReturnValue(cwdPath);

        // Act
        wrapper.pathFromRoot('');

        // Assert
        expect(parseMock).toHaveBeenCalledWith(cwdPath);
        expect(joinMock).toBeCalledTimes(1);
    });
});