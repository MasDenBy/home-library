using MasDen.HomeLibrary.Books.Queries.Search;

namespace MasDen.HomeLibrary.Tests.Books.Queries.Search;
public class SearchBooksQueryValidatorTests
{
    private readonly SearchBooksQueryValidator sut;
    private readonly Faker faker;

    public SearchBooksQueryValidatorTests()
    {
        this.sut = new SearchBooksQueryValidator();
        this.faker = new Faker();
    }

    [Fact]
    public void Validate_IfCountEqualsZeroOrLess_ShouldFail()
    {
        // Arrange
        var query = new SearchBooksQuery(this.faker.Lorem.Word(), this.faker.Random.PositiveInt(), this.faker.Random.Int(max: 0));

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
        var query = new SearchBooksQuery(this.faker.Lorem.Word(), this.faker.Random.Int(max: -1), this.faker.Random.PositiveInt());

        // Act
        var result = this.sut.Validate(query);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(f => f.ErrorMessage == "'Offset' must be greater than or equal to '0'.");
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    public void Validation_IfPatternIsNullOrEmpty_ShouldFail(string pattern)
    {
        // Arrange
        var query = new SearchBooksQuery(pattern, this.faker.Random.PositiveInt(), this.faker.Random.PositiveInt());

        // Act
        var result = sut.Validate(query);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(f => f.ErrorMessage == "'Pattern' must not be empty.");
    }

    [Fact]
    public void Validation_IfValid_ShouldSucceed()
    {
        // Arrange
        var query = new SearchBooksQuery(this.faker.Lorem.Word(), this.faker.Random.PositiveInt(), this.faker.Random.PositiveInt());

        // Act
        var result = sut.Validate(query);

        // Assert
        result.IsValid.Should().BeTrue();
    }
}
