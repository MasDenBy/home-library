using MasDen.HomeLibrary.Infrastructure.Persistence;
using MasDen.HomeLibrary.Libraries.Queries.GetLibraries;
using MasDen.HomeLibrary.TestInfrastructure.Fakers;

namespace MasDen.HomeLibrary.Tests.Libraries.Queries.GetLibraries;

public class GetLibrariesQueryHandlerTests
{
    [Fact]
    public async Task Handle_ShouldCallLibraryDataStoreGetAll()
    {
        // Arrange
        var command = new GetLibrariesQuery();
        var libraryDataStoreMock = new Mock<ILibraryDataStore>();
        libraryDataStoreMock.Setup(x => x.GetAllAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(new LibraryFaker().GenerateBetween(1, 3));

        var sut = new GetLibrariesQueryHandler(libraryDataStoreMock.Object);

        // Act
        await sut.Handle(command, default(CancellationToken));

        // Assert
        libraryDataStoreMock.Verify(x => x.GetAllAsync(It.IsAny<CancellationToken>()), Times.Once);
    }
}
