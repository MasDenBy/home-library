import { mock, instance, verify } from 'ts-mockito';

import axios, { AxiosResponse } from 'axios';

import { OpenLibraryService } from './openlibrary.service';
import { BookInfo, SearchResponseDto } from './openlibrary.dto';
import { Logger } from '@nestjs/common';

jest.mock('axios');

describe('OpenLibraryService', () => {
  const pattern = 'search pattern';
  const expectedException = new Error('Test exception');

  let service: OpenLibraryService;
  let logger: Logger;

  beforeEach(() => {
    jest.resetAllMocks();

    logger = mock(Logger);
    service = new OpenLibraryService(instance(logger));
  });

  describe('search', () => {
    let axiosMock: jest.Mocked<typeof axios>;

    beforeEach(() => {
      axiosMock = axios as jest.Mocked<typeof axios>;
    });

    test('if found zero items should return null', async () => {
      // Arrange
      axiosMock.get.mockResolvedValue(<AxiosResponse<SearchResponseDto>>{
        data: { numFound: 0 },
      });

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
          docs: [{ isbn: null }],
        },
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
          docs: [{ isbn: [] }],
        },
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
          docs: [{ isbn: [firstIsbn, 'second'] }],
        },
      });

      // Act
      const result = await service.search(pattern);

      // Assert
      expect(result).toBe(firstIsbn);
    });

    test('if exception occurs log it', async () => {
      // Arrange
      axiosMock.get.mockRejectedValue(expectedException);

      // Act
      await service.search(pattern);

      // Assert
      verify(logger.error(expectedException)).once();
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
        data: response,
      });

      // Act
      const result = await service.findByIsbn(isbn);

      // Assert
      expect(result).not.toBeNull();
    });

    test('if exception occurs log it', async () => {
      // Arrange
      axiosMock.get.mockRejectedValue(expectedException);

      // Act
      await service.search(pattern);

      // Assert
      verify(logger.error(expectedException)).once();
    });
  });
});
