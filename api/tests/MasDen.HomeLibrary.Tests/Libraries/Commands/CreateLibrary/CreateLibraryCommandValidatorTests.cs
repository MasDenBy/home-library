using MasDen.HomeLibrary.Libraries.Commands.CreateLibrary;

namespace MasDen.HomeLibrary.Tests.Libraries.Commands.CreateLibrary;

public class CreateLibraryCommandValidatorTests
{
    private readonly Faker faker;
    private readonly CreateLibraryCommandValidator sut;

    public CreateLibraryCommandValidatorTests()
    {
        this.faker = new Faker();
        this.sut = new CreateLibraryCommandValidator();
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    public void Validation_IfPathNullOrEmpty_ShouldFail(string? path)
    {
        // Arrange
#pragma warning disable CS8604 // Possible null reference argument.
        var command = new CreateLibraryCommand(path);
#pragma warning restore CS8604 // Possible null reference argument.

        // Act
        var result = sut.Validate(command);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(f => f.ErrorMessage == "'Path' must not be empty.");
    }

    [Fact]
    public void Validation_IfPathLengthMoreThan500Characters_ShouldFail()
    {
        // Arrange
        var path = string.Join(string.Empty, this.faker.Random.Chars(count: this.faker.Random.Int(min: 501, max: 520)));
        var command = new CreateLibraryCommand(path);

        // Act
        var result = sut.Validate(command);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(f => f.ErrorMessage.StartsWith("The length of 'Path' must be 500 characters or fewer"));
    }

    [Fact]
    public void Validation_IfValid_ShouldSucced()
    {
        // Arrange
        var command = new CreateLibraryCommand(this.faker.System.DirectoryPath());

        // Act
        var result = sut.Validate(command);

        // Assert
        result.IsValid.Should().BeTrue();
    }
}
