using MasDen.HomeLibrary.Infrastructure.Persistence;
using MasDen.HomeLibrary.Libraries.Queries.GetLibraries;

namespace MasDen.HomeLibrary.Tests.Libraries.Queries.GetLibraries;

public class GetLibrariesQueryHandlerTests
{
    [Fact]
    public async Task Handle_ShouldCallLibraryDataStoreGetAll()
    {
        // Arrange
        var command = new GetLibrariesQuery();
        var libraryDataStoreMock = Substitute.For<ILibraryDataStore>();
        var sut = new GetLibrariesQueryHandler(libraryDataStoreMock);

        // Act
        await sut.Handle(command, default(CancellationToken));

        // Assert
        await libraryDataStoreMock.Received().GetAllAsync();
    }
}
