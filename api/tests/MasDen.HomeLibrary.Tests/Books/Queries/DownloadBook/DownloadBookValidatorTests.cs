using MasDen.HomeLibrary.Books.Queries.DownloadBook;
using MasDen.HomeLibrary.Domain.StronglyTypedIds;

namespace MasDen.HomeLibrary.Tests.Books.Queries.DownloadBook;

public class DownloadBookValidatorTests
{
    private readonly DownloadBookValidator sut;
    private readonly Faker faker;

    public DownloadBookValidatorTests()
    {
        this.sut = new DownloadBookValidator();
        this.faker = new Faker();
    }

    [Fact]
    public void Validate_IfBookIdLessThanZero_ShouldFail()
    {
        // Arrange
        var query = new DownloadBookQuery(new BookId(this.faker.Random.Int(max: -1)));

        // Act
        var result = this.sut.Validate(query);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(f => f.ErrorMessage == "'Id' must be greater than '0'.");
    }

    [Fact]
    public void Validation_IfValid_ShouldSucced()
    {
        // Arrange
        var query = new DownloadBookQuery(new BookId(this.faker.Random.PositiveInt()));

        // Act
        var result = sut.Validate(query);

        // Assert
        result.IsValid.Should().BeTrue();
    }
}
