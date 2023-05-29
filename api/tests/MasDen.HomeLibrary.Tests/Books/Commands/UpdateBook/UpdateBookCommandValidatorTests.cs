using MasDen.HomeLibrary.Books.Commands.UpdateBook;
using MasDen.HomeLibrary.Domain.StronglyTypedIds;

namespace MasDen.HomeLibrary.Tests.Books.Commands.UpdateBook;
public class UpdateBookCommandValidatorTests
{
    private readonly UpdateBookCommandValidator sut;
    private readonly Faker faker;

    public UpdateBookCommandValidatorTests()
    {
        this.sut = new UpdateBookCommandValidator();
        this.faker = new Faker();
    }

    [Fact]
    public void Validation_IfValid_ShouldSucceed()
    {
        // Arrange
        var command = new UpdateBookCommandFaker().Generate();

        // Act
        var result = sut.Validate(command);

        // Assert
        result.IsValid.Should().BeTrue();
    }

    [Fact]
    public void Validation_IfMetadataIsNull_ShouldSucceed()
    {
        // Arrange
        var command = new UpdateBookCommandFaker()
            .WithMetadata(null)
            .Generate();

        // Act
        var result = sut.Validate(command);

        // Assert
        result.IsValid.Should().BeTrue();
    }

    [Fact]
    public void Validation_IfIdLessThanZero_ShouldFail()
    {
        // Arrange
        var command = new UpdateBookCommandFaker()
            .WithId(this.faker.Random.Int(max: -1))
            .Generate();

        // Act
        var result = sut.Validate(command);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(f => f.ErrorMessage.StartsWith("'Id Value' must be greater than '0'."));
    }

    [Theory]
    [InlineData("")]
    [InlineData(null)]
    public void Validation_IfTitleNullOrEmpty_ShouldFail(string? title)
    {
        // Arrange
        var command = new UpdateBookCommandFaker()
            .WithTitle(title)
            .Generate();

        // Act
        var result = sut.Validate(command);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(f => f.ErrorMessage.StartsWith("'Title' must not be empty."));
    }

    [Fact]
    public void Validation_IfTitleBiggerThan1000Characters_ShouldFail()
    {
        // Arrange
        var title = this.faker.Random.String(minLength: 1001, maxLength: 2000);

        var command = new UpdateBookCommandFaker()
            .WithTitle(title)
            .Generate();

        // Act
        var result = sut.Validate(command);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(f => f.ErrorMessage.StartsWith("The length of 'Title' must be 1000 characters or fewer"));
    }

    [Fact]
    public void Validation_IfDescriptionBiggerThan4000Characters_ShouldFail()
    {
        // Arrange
        var description = this.faker.Random.String(minLength: 4001, maxLength: 5000);

        var command = new UpdateBookCommandFaker()
            .WithDescription(description)
            .Generate();

        // Act
        var result = sut.Validate(command);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(f => f.ErrorMessage.StartsWith("The length of 'Description' must be 4000 characters or fewer"));
    }

    [Fact]
    public void Validation_IfAuthorsBiggerThan255Characters_ShouldFail()
    {
        // Arrange
        var authors = this.faker.Random.String(minLength: 256, maxLength: 300);

        var command = new UpdateBookCommandFaker()
            .WithAuthors(authors)
            .Generate();

        // Act
        var result = sut.Validate(command);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(f => f.ErrorMessage.StartsWith("The length of 'Authors' must be 255 characters or fewer"));
    }

    [Fact]
    public void Validation_IfMetadataYearLessThanZero_ShouldFail()
    {
        // Arrange
        var metadata = new UpdateBookMetadataFaker()
            .WithYear(this.faker.Random.Int(max: -1))
            .Generate();

        var command = new UpdateBookCommandFaker()
            .WithMetadata(metadata)
            .Generate();

        // Act
        var result = sut.Validate(command);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(f => f.ErrorMessage.StartsWith("'Metadata Year' must be greater than or equal to '0'."));
    }

    [Fact]
    public void Validation_IfMetadataPagesLessThanZero_ShouldFail()
    {
        // Arrange
        var metadata = new UpdateBookMetadataFaker()
            .WithPages(this.faker.Random.Int(max: -1))
            .Generate();

        var command = new UpdateBookCommandFaker()
            .WithMetadata(metadata)
            .Generate();

        // Act
        var result = sut.Validate(command);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(f => f.ErrorMessage.StartsWith("'Metadata Pages' must be greater than '0'."));
    }

    [Fact]
    public void Validation_IfMetadataIsbnGreaterThan13Characters_ShouldFail()
    {
        // Arrange
        var metadata = new UpdateBookMetadataFaker()
            .WithIsbn(this.faker.Random.String(minLength: 14, maxLength: 50))
            .Generate();

        var command = new UpdateBookCommandFaker()
            .WithMetadata(metadata)
            .Generate();

        // Act
        var result = sut.Validate(command);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(f => f.ErrorMessage.StartsWith("The length of 'Metadata Isbn' must be 13 characters or fewer"));
    }

    private class UpdateBookCommandFaker : Faker<UpdateBookCommand>
    {
        public UpdateBookCommandFaker()
        {
            this.WithAuthors(this.FakerHub.Person.FullName);
            this.WithDescription(this.FakerHub.Lorem.Sentence());
            this.WithTitle(this.FakerHub.Lorem.Sentence());
            this.WithId(this.FakerHub.Random.Int(min: 1));
            this.WithMetadata(new UpdateBookMetadataFaker().Generate());
        }

        public UpdateBookCommandFaker WithId(int value)
        {
            RuleFor(x => x.Id, s => new BookId(value));

            return this;
        }

        public UpdateBookCommandFaker WithTitle(string? title)
        {
            RuleFor(x => x.Title, s => title);

            return this;
        }

        public UpdateBookCommandFaker WithDescription(string value)
        {
            RuleFor(x => x.Description, s => value);

            return this;
        }

        public UpdateBookCommandFaker WithAuthors(string value)
        {
            RuleFor(x => x.Authors, s => value);

            return this;
        }

        public UpdateBookCommandFaker WithMetadata(UpdateBookMetadata? value)
        {
            RuleFor(x => x.Metadata, setter => value);

            return this;
        }
    }

    private class UpdateBookMetadataFaker : Faker<UpdateBookMetadata>
    {
        public UpdateBookMetadataFaker()
        {
            this.WithIsbn(this.FakerHub.Random.String(length: 13));
            this.WithPages(this.FakerHub.Random.Int(min: 1));
            this.WithYear(this.FakerHub.Random.Int(min: 0));
        }

        public UpdateBookMetadataFaker WithIsbn(string? value)
        {
            RuleFor(x => x.Isbn, s => value);

            return this;
        }

        public UpdateBookMetadataFaker WithPages(int? value)
        {
            RuleFor(x => x.Pages, s => value);

            return this;
        }

        public UpdateBookMetadataFaker WithYear(int? value)
        {
            RuleFor(x => x.Year, s => value);

            return this;
        }
    }
}
