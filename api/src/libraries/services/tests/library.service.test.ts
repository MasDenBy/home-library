import { DeleteResult } from 'typeorm';
import { mock, instance, when, verify, anyOfClass, anything } from 'ts-mockito';
import { LibraryService } from '../library.service';
import { LibraryDataStore } from '../../database/library.datastore';
import { LibraryDto } from '../../dto/library.dto';
import { Library } from '../../database/library.entity';
import { IndexerService } from '../indexer.service';
import { ImageService } from '../../../core/common/services/image.service';
import { FileSystemWrapper } from '../../../core/common/services/fs.wrapper';

describe('LibraryService', () => {
  let service: LibraryService;
  let dataStoreMock: LibraryDataStore;
  let indexerMock: IndexerService;
  let fsMock: FileSystemWrapper;
  let imageServiceMock: ImageService;

  beforeEach(() => {
    dataStoreMock = mock(LibraryDataStore);
    indexerMock = mock(IndexerService);
    fsMock = mock(FileSystemWrapper);
    imageServiceMock = mock(ImageService);

    service = new LibraryService(
      instance(dataStoreMock),
      instance(indexerMock),
      instance(fsMock),
      instance(imageServiceMock),
    );
  });

  test('list', async () => {
    // Arrange
    when(dataStoreMock.list()).thenResolve([]);

    // Act
    await service.list();

    // Assert
    verify(dataStoreMock.list()).once();
  });

  test('save', async () => {
    // Arrange
    const id = 1;
    const path = 'test';
    const dto = <LibraryDto>{ path: path };
    const library = <Library>{ id: id, path: 'test' };

    when(dataStoreMock.save(anyOfClass(Library))).thenResolve(library);

    // Act
    const actual = await service.save(dto);

    // Assert
    expect(actual).toBe(id);

    verify(dataStoreMock.save(anyOfClass(Library))).once();
  });

  test('getById', async () => {
    // Arrange
    const entity = <Library>{ id: 1, path: 'new' };

    when(dataStoreMock.findById(entity.id)).thenResolve(entity);

    // Act
    const dto = await service.getById(entity.id);

    // Assert
    expect(dto.id).toBe(entity.id);
    expect(dto.path).toBe(entity.path);

    verify(dataStoreMock.findById(entity.id)).once();
  });

  test('deleteById', async () => {
    // Arrange
    const id = 1;
    const imageDirectory = 'images/temp';

    when(imageServiceMock.getImagesDirectory(id)).thenReturn(imageDirectory);

    // Act
    await service.deleteById(id);

    // Assert
    verify(dataStoreMock.deleteById(id)).once();
    verify(fsMock.deleteFolder(imageDirectory)).once();
  });

  describe('index', () => {
    test('library exist, then index', async () => {
      // Arrange
      const id = 2;
      const lib = <Library>{ id: id };

      when(dataStoreMock.findById(id)).thenResolve(lib);

      // Act
      await service.index(id);

      // Assert
      verify(indexerMock.index(lib)).once();
    });

    test('library do not exist, then index does not fire', async () => {
      // Arrange
      const id = 2;

      when(dataStoreMock.findById(id)).thenResolve(null);

      // Act
      await service.index(id);

      // Assert
      verify(indexerMock.index(anything())).never();
    });
  });
});
