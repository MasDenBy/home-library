using MasDen.HomeLibrary.Domain.Entities;
using MasDen.HomeLibrary.Infrastructure.Persistence;
using MasDen.HomeLibrary.Libraries.Commands.CreateLibrary;

namespace MasDen.HomeLibrary.Tests.Libraries.Commands.CreateLibrary;
public class CreateLibraryCommandHandlerTests
{
    private readonly Faker faker = new();

    [Fact]
    public async Task Handle_ShouldReturnCreatedDto()
    {
        // Arrange
        var library = new Library(this.faker.Random.Int(), this.faker.System.DirectoryPath());
        var command = new CreateLibraryCommand(library.Path);

        var libraryDataStoreMock = Substitute.For<ILibraryDataStore>();
        libraryDataStoreMock.CreateAsync(Arg.Any<Library>()).Returns(library.Id);

        var sut = new CreateLibraryCommandHandler(libraryDataStoreMock);

        // Act
        var dto = await sut.Handle(command, default(CancellationToken));

        // Assert
        dto.Id.Should().Be(library.Id);
        dto.Path.Should().Be(library.Path);

        await libraryDataStoreMock.Received().CreateAsync(Arg.Is<Library>(a => a.Path == command.Path));
    }
}
