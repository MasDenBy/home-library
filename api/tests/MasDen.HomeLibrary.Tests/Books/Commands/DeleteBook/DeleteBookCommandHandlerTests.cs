using MasDen.HomeLibrary.Books.Commands.DeleteBook;
using MasDen.HomeLibrary.Domain.StronglyTypedIds;
using MasDen.HomeLibrary.Infrastructure.Exceptions;
using MasDen.HomeLibrary.Infrastructure.Persistence;
using MasDen.HomeLibrary.TestInfrastructure.Fakers;

namespace MasDen.HomeLibrary.Tests.Books.Commands.DeleteBook;
public class DeleteBookCommandHandlerTests
{
    private static Faker faker = new();

    private readonly DeleteBookCommandHandler sut;

    private readonly Mock<IUnitOfWork> unitOfWorkMock;
    private readonly Mock<IBookDataStore> bookDataStoreMock;
    private readonly Mock<IBookFileDataStore> bookFileDataStoreMock;
    private readonly Mock<IMetadataDataStore> metadataDataStoreMock;

    public DeleteBookCommandHandlerTests()
    {
        this.bookDataStoreMock = new Mock<IBookDataStore>();
        this.bookFileDataStoreMock = new Mock<IBookFileDataStore>();
        this.metadataDataStoreMock = new Mock<IMetadataDataStore>();

        this.unitOfWorkMock = new Mock<IUnitOfWork>();
        this.unitOfWorkMock.Setup(x => x.Book).Returns(this.bookDataStoreMock.Object);
        this.unitOfWorkMock.Setup(x => x.Metadata).Returns(this.metadataDataStoreMock.Object);
        this.unitOfWorkMock.Setup(x => x.BookFile).Returns(this.bookFileDataStoreMock.Object);

        this.sut = new DeleteBookCommandHandler(unitOfWorkMock.Object);
    }

    [Fact]
    public async Task Handle_IfBookIsNull_ShouldThrowNotFoundException()
    {
        // Act & Assert
        await Assert.ThrowsAsync<NotFoundException>(() => sut.Handle(CreateCommand(), default));
    }

    [Fact]
    public async Task Handle_ShouldDeleteAllEntitiesAndCommit()
    {
        // Arrange
        var metadata = new MetadataFaker(false).Generate();
        var file = new BookFileFaker(false).Generate();
        var book = new BookFaker(false)
            .WithBookFile(file)
            .WithMetadata(metadata)
            .Generate();

        var deleteCommand = CreateCommand(book.Id.Value);

        bookDataStoreMock.Setup(x => x.GetBookAsync(deleteCommand.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(book);

        // Act
        await this.sut.Handle(deleteCommand, default);

        // Assert
        this.unitOfWorkMock.Verify(x => x.BeginTransaction(), Times.Once);
        this.unitOfWorkMock.Verify(x => x.CommitTransaction(), Times.Once);

        this.bookFileDataStoreMock.Verify(x => x.DeleteAsync(file.Id, It.IsAny<CancellationToken>()), Times.Once);
        this.metadataDataStoreMock.Verify(x => x.DeleteAsync(metadata.Id, It.IsAny<CancellationToken>()), Times.Once);
        this.bookDataStoreMock.Verify(x => x.DeleteAsync(book.Id, It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Handle_IfMetadataIsNull_ShouldNotDeleteDeleteMetadata()
    {
        // Arrange
        var file = new BookFileFaker(false).Generate();
        var book = new BookFaker(false)
            .WithBookFile(file)
            .Generate();

        var deleteCommand = CreateCommand(book.Id.Value);

        bookDataStoreMock.Setup(x => x.GetBookAsync(deleteCommand.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(book);

        // Act
        await this.sut.Handle(deleteCommand, default);

        // Assert
        this.unitOfWorkMock.Verify(x => x.BeginTransaction(), Times.Once);
        this.unitOfWorkMock.Verify(x => x.CommitTransaction(), Times.Once);

        this.bookFileDataStoreMock.Verify(x => x.DeleteAsync(file.Id, It.IsAny<CancellationToken>()), Times.Once);
        this.metadataDataStoreMock.Verify(x => x.DeleteAsync(It.IsAny<MetadataId>(), It.IsAny<CancellationToken>()), Times.Never);
        this.bookDataStoreMock.Verify(x => x.DeleteAsync(book.Id, It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Handle_IfExceptionIsThrown_ShouldRollbackTransaction()
    {
        // Arrange
        var book = new BookFaker(false).Generate();

        var deleteCommand = CreateCommand(book.Id.Value);

        bookDataStoreMock.Setup(x => x.GetBookAsync(deleteCommand.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(book);

        // Act
        await Assert.ThrowsAnyAsync<Exception>(() => this.sut.Handle(deleteCommand, default));

        // Assert
        this.unitOfWorkMock.Verify(x => x.BeginTransaction(), Times.Once);
        this.unitOfWorkMock.Verify(x => x.RollbackTransaction(), Times.Once);
    }

    private static DeleteBookCommand CreateCommand(int? id = null) => new(new BookId(id == null ? faker.Random.PositiveInt() : id.Value));
}
