using MasDen.HomeLibrary.Books.Queries.GetBook;
using MasDen.HomeLibrary.Domain.StronglyTypedIds;

namespace MasDen.HomeLibrary.Tests.Books.Queries.GetBook;
public class GetBookQueryValidatorTests
{
    private readonly GetBookQueryValidator sut;
    private readonly Faker faker;

    public GetBookQueryValidatorTests()
    {
        this.sut = new GetBookQueryValidator();
        this.faker = new Faker();
    }

    [Fact]
    public void Validate_IfBookIdLessThanZero_ShouldFail()
    {
        // Arrange
        var query = new GetBookQuery(new BookId(this.faker.Random.Int(max: -1)));

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
        var query = new GetBookQuery(new BookId(this.faker.Random.PositiveInt()));

        // Act
        var result = sut.Validate(query);

        // Assert
        result.IsValid.Should().BeTrue();
    }
}
