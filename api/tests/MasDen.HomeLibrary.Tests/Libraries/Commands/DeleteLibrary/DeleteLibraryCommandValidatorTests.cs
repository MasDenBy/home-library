using MasDen.HomeLibrary.Libraries.Commands.DeleteLibrary;

namespace MasDen.HomeLibrary.Tests.Libraries.Commands.DeleteLibrary;

public class DeleteLibraryCommandValidatorTests
{
    private readonly Faker faker;
    private readonly DeleteLibraryCommandValidator sut;

    public DeleteLibraryCommandValidatorTests()
    {
        this.faker = new Faker();
        this.sut = new DeleteLibraryCommandValidator();
    }

    [Fact]
    public void Validation_IfIdLessOrEqualZero_ShouldFail()
    {
        // Arrange
        var command = new DeleteLibraryCommand(this.faker.Random.Int(max: 0));

        // Act
        var result = this.sut.Validate(command);

        // Assert
        result.IsValid.Should().BeFalse();
    }

    [Fact]
    public void Validation_IfIdBiggerThanZero_ShouldSuccess()
    {
        // Arrange
        var command = new DeleteLibraryCommand(this.faker.Random.Int(min: 1));

        // Act
        var result = this.sut.Validate(command);

        // Assert
        result.IsValid.Should().BeTrue();
    }
}
