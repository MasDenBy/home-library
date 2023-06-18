using MasDen.HomeLibrary.Books.DeleteBook;
using MasDen.HomeLibrary.Domain.StronglyTypedIds;

namespace MasDen.HomeLibrary.Tests.Books.Commands.DeleteBook;
public class DeleteBookCommandValidatorTests
{
    private readonly Faker faker;
    private readonly DeleteBookCommandValidator sut;

    public DeleteBookCommandValidatorTests()
    {
        this.faker = new Faker();
        this.sut = new DeleteBookCommandValidator();
    }

    [Fact]
    public void Validation_IfIdLessOrEqualZero_ShouldFail()
    {
        // Arrange
        var command = new DeleteBookCommand(new BookId(this.faker.Random.Int(max: 0)));

        // Act
        var result = this.sut.Validate(command);

        // Assert
        result.IsValid.Should().BeFalse();
    }

    [Fact]
    public void Validation_IfIdBiggerThanZero_ShouldSuccess()
    {
        // Arrange
        var command = new DeleteBookCommand(new BookId(this.faker.Random.Int(min: 1)));

        // Act
        var result = this.sut.Validate(command);

        // Assert
        result.IsValid.Should().BeTrue();
    }
}
