using MasDen.HomeLibrary.Domain.Entities;
using MasDen.HomeLibrary.Infrastructure.Persistence;
using MasDen.HomeLibrary.Libraries.Commands.CreateLibrary;
using MasDen.HomeLibrary.TestInfrastructure.Fakers;

namespace MasDen.HomeLibrary.Tests.Libraries.Commands.CreateLibrary;
public class CreateLibraryCommandHandlerTests
{
    private readonly Faker faker = new();

    [Fact]
    public async Task Handle_ShouldReturnCreatedDto()
    {
        // Arrange
        var library = new LibraryFaker().Generate();
        var command = new CreateLibraryCommand(library.Path);

        var libraryDataStoreMock = new Mock<ILibraryDataStore>();
        libraryDataStoreMock.Setup(x => x.CreateAsync(It.IsAny<Library>())).ReturnsAsync(library.Id);

        var unitOfWorkMock = new Mock<IUnitOfWork>();
        unitOfWorkMock.Setup(x => x.Library).Returns(libraryDataStoreMock.Object);

        var sut = new CreateLibraryCommandHandler(unitOfWorkMock.Object);

        // Act
        var dto = await sut.Handle(command, default(CancellationToken));

        // Assert
        dto.Id.Should().Be(library.Id);
        dto.Path.Should().Be(library.Path);

        libraryDataStoreMock.Verify(x => x.CreateAsync(It.Is<Library>(a => a.Path == command.Path)), Times.Once);
    }
}
