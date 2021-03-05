import 'reflect-metadata';

import axios, { AxiosResponse } from 'axios';

import { OpenLibraryService } from '../../../../src/common/services/openlibrary';
import { BookInfo, SearchResponseDto } from '../../../../src/common/services/openlibrary/openlibrary.dto';

jest.mock('axios');

describe('OpenLibraryService', () => {
    const pattern = 'search pattern';

    let service: OpenLibraryService;

    beforeEach(() => {
        jest.resetAllMocks();
        service = new OpenLibraryService();
    });

    describe('search', () => {
        let axiosMock: jest.Mocked<typeof axios>;

        beforeEach(() => {
            axiosMock = axios as jest.Mocked<typeof axios>;
        });

        test('if found zero items should return null', async () => {
            // Arrange
            axiosMock.get.mockResolvedValue(<AxiosResponse<SearchResponseDto>>{ data: { numFound:0 } });

            // Act
            const result = await service.search(pattern);

            // Assert
            expect(result).toBeNull();
        });

        test('if found ISBN items are null should return null', async () => {
            // Arrange
            axiosMock.get.mockResolvedValue(<AxiosResponse<SearchResponseDto>>{
                data: {
                    numFound: 1,
                    docs: [{ isbn: null }]
                }
            });

            // Act
            const result = await service.search(pattern);

            // Assert
            expect(result).toBeNull();
        });

        test('if found zero ISBN items should return null', async () => {
            // Arrange
            axiosMock.get.mockResolvedValue(<AxiosResponse<SearchResponseDto>>{
                data: {
                    numFound: 1,
                    docs: [{ isbn: [] }]
                }
            });

            // Act
            const result = await service.search(pattern);

            // Assert
            expect(result).toBeNull();
        });

        test('if found one or more ISBN items should return the first', async () => {
            // Arrange
            const firstIsbn = 'first';

            axiosMock.get.mockResolvedValue(<AxiosResponse<SearchResponseDto>>{
                data: {
                    numFound: 1,
                    docs: [{ isbn: [firstIsbn, 'second'] }]
                }
            });

            // Act
            const result = await service.search(pattern);

            // Assert
            expect(result).toBe(firstIsbn);
        });
    });

    describe('findByIsbn', () => {
        const isbn = '123456789';

        let axiosMock: jest.Mocked<typeof axios>;

        beforeEach(() => {
            axiosMock = axios as jest.Mocked<typeof axios>;
        });

        test('if response doesn not have data should return null', async () => {
            // Arrange
            axiosMock.get.mockResolvedValue(<AxiosResponse<unknown>>{ data: null });

            // Act
            const result = await service.findByIsbn(isbn);

            // Assert
            expect(result).toBeNull();
        });

        test('if response have data should return book info', async () => {
            // Arrange
            const response = {};
            response[`isbn:${isbn}`] = <BookInfo>{ details: { title: 'title' } };

            axiosMock.get.mockResolvedValue(<AxiosResponse<unknown>>{
                data: response
            });

            // Act
            const result = await service.findByIsbn(isbn);

            // Assert
            expect(result).not.toBeNull();
        });
    });
});