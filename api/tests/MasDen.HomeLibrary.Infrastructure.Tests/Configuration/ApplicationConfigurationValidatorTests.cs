using MasDen.HomeLibrary.Infrastructure.Configuration;

namespace MasDen.HomeLibrary.Infrastructure.Tests.Configuration;

public class ApplicationConfigurationValidatorTests
{
    private readonly ApplicationConfigurationValidator sut = new();

    [InlineData(null)]
    [InlineData("")]
    [Theory]
    public void Validate_IfDatabaseConnectionStringIsNotValid_ShouldReturnInvalidResult(string? value)
    {
        // Arrange
#pragma warning disable CS8601 // Possible null reference assignment.
        var applicationConfiguration = new ApplicationConfiguration { DatabaseConnectionString = value };
#pragma warning restore CS8601 // Possible null reference assignment.

        // Act
        var result = this.sut.Validate(applicationConfiguration);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(x => x.PropertyName == "DatabaseConnectionString");
    }

    [Fact]
    public void Validate_IfConfigurationIsValid_ShouldReturnValidResult()
    {
        // Arrange
        var applicationConfiguration = new ApplicationConfiguration { DatabaseConnectionString = "Server=localhost;Database=test;" };

        // Act
        var result = this.sut.Validate(applicationConfiguration);

        // Assert
        result.IsValid.Should().BeTrue();
    }
}
