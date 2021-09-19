import { mock, instance, when, verify } from 'ts-mockito';
import { LibrariesController } from './libraries.controller';
import { LibraryService } from './services/library.service';
import { LibraryDto } from './library.dto';

describe('/libraries', () => {
  let controller: LibrariesController;
  let libraryServiceMock: LibraryService;

  beforeEach(() => {
    libraryServiceMock = mock(LibraryService);

    controller = new LibrariesController(instance(libraryServiceMock));
  });

  test('list', async () => {
    // Arrange
    const responseBody = [new LibraryDto()];

    when(libraryServiceMock.list()).thenResolve(responseBody);

    // Act
    const result = await controller.list();

    // Assert
    expect(result).toEqual(responseBody);
  });

  test('getById', async () => {
    // Arrange
    const testId = 1;
    const dto = <LibraryDto>{ id: testId, path: 'lib' };

    when(libraryServiceMock.getById(testId)).thenResolve(dto);

    // Act
    const result = await controller.getById(testId);

    // Assert
    expect(result).toEqual(dto);
  });

  test('create', async () => {
    // Arrange
    const testId = 1;
    const dto = <LibraryDto>{ path: 'lib' };

    when(libraryServiceMock.save(dto)).thenResolve(testId);

    // Act
    const result = await controller.create(dto);

    // Assert
    expect(result).toEqual(testId);
    verify(libraryServiceMock.save(dto)).once();
  });

  test('delete', async () => {
    // Arrange
    const testId = 1;

    when(libraryServiceMock.deleteById(testId));

    // Act
    await controller.delete(testId);

    // Assert
    verify(libraryServiceMock.deleteById(testId)).once();
  });

  test('index', async () => {
    // Arrange
    const id = 5;

    // Act
    await controller.index(id);

    // Assert
    verify(libraryServiceMock.index(id)).once();
  });
});
