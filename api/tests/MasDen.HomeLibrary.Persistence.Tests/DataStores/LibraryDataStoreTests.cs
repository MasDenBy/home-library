using MasDen.HomeLibrary.Domain.StronglyTypedIds;
using MasDen.HomeLibrary.Infrastructure.Exceptions;
using MasDen.HomeLibrary.Infrastructure.Persistence;
using MasDen.HomeLibrary.Persistence.DataStores;
using MasDen.HomeLibrary.Persistence.Entities;
using MasDen.HomeLibrary.TestInfrastructure.Fakers;

namespace MasDen.HomeLibrary.Persistence.Tests.DataStores;
public class LibraryDataStoreTests
{
    private readonly LibraryDataStore sut;
    private readonly Mock<IDataObjectFactory> dataObjectFactoryMock;
    private readonly Mock<IDataObject<LibraryEntity>> dataObjectMock;

    public LibraryDataStoreTests()
    {
        this.dataObjectMock = new Mock<IDataObject<LibraryEntity>>();

        this.dataObjectFactoryMock = new Mock<IDataObjectFactory>();
        this.dataObjectFactoryMock.Setup(x => x.Create<LibraryEntity>()).Returns(this.dataObjectMock.Object);

        this.sut = new LibraryDataStore(this.dataObjectFactoryMock.Object);
    }

    [Fact]
    public async Task DeleteAsync_IfEntityDoesNotFound_ShouldThrowNotFoundException()
    {
        // Act & Assert
        await Assert.ThrowsAsync<NotFoundException>(() => this.sut.DeleteAsync(new LibraryId(1)));
    }

    [Fact]
    public async Task DeleteAsync_IfEntityFound_ShouldCallDeleteFromDataStore()
    {
        // Arrange
        var library = new LibraryFaker().Generate();

        dataObjectMock.Setup(x=>x.DeleteAsync(It.IsAny<int>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);

        // Act
        await this.sut.DeleteAsync(library.Id);

        // Assert
        dataObjectMock.Verify(x => x.DeleteAsync(library.Id.Value, It.IsAny<CancellationToken>()), Times.Once);
    }
}
