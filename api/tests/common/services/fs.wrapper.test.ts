import 'reflect-metadata';

import { basename, extname } from 'path';
import { promisify } from 'util';
import { lstatSync, Stats } from 'fs';

import { mock, instance, when } from 'ts-mockito';

import { FileSystemWrapper } from '../../../src/common/services/fs.wrapper';

jest.mock('path');
jest.mock('util');
jest.mock('fs');

describe('FileSystemWrapper', () => {
    let wrapper: FileSystemWrapper;

    beforeEach(()=> {
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
});