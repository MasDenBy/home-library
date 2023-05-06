using MasDen.HomeLibrary.Books.Queries.GetBooks;

namespace MasDen.HomeLibrary.Tests.Books.Queries.GetBooks;
public class GetBooksQueryValidatorTests
{
    private readonly GetBooksQueryValidator sut;
    private readonly Faker faker;

    public GetBooksQueryValidatorTests()
    {
        this.sut = new GetBooksQueryValidator();
        this.faker = new Faker();
    }

    [Fact]
    public void Validate_IfCountEqualsZeroOrLess_ShouldFail()
    {
        // Arrange
        var query = new GetBooksQuery(this.faker.Random.PositiveInt(), this.faker.Random.Int(max: 0));

        // Act
        var result = this.sut.Validate(query);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(f => f.ErrorMessage == "'Count' must be greater than '0'.");
    }

    [Fact]
    public void Validate_IfOffsetLessThanZero_ShouldFail()
    {
        // Arrange
        var query = new GetBooksQuery(this.faker.Random.Int(max: -1), this.faker.Random.PositiveInt());

        // Act
        var result = this.sut.Validate(query);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(f => f.ErrorMessage == "'Offset' must be greater than or equal to '0'.");
    }

    [Fact]
    public void Validation_IfValid_ShouldSucced()
    {
        // Arrange
        var query = new GetBooksQuery(this.faker.Random.PositiveInt(), this.faker.Random.PositiveInt());

        // Act
        var result = sut.Validate(query);

        // Assert
        result.IsValid.Should().BeTrue();
    }
}
