using MasDen.HomeLibrary.Books.Commands.UpdateBook;
using MasDen.HomeLibrary.Books.Queries.GetBook;
using MasDen.HomeLibrary.Books.Queries.GetBooks;
using MasDen.HomeLibrary.Books.Queries.Search;
using MasDen.HomeLibrary.Common.Models;
using MasDen.HomeLibrary.Domain;
using MasDen.HomeLibrary.Domain.StronglyTypedIds;
using MasDen.HomeLibrary.TestInfrastructure;
using System.Net.Http.Json;

namespace MasDen.HomeLibrary.IntegrationTests.Controllers;

[Collection("Integration")]
[TestCaseOrderer("MasDen.HomeLibrary.TestInfrastructure.PriorityOrderer", "MasDen.HomeLibrary.TestInfrastructure")]
public class BooksControllerTests : IClassFixture<IntegrationTestsWebApplicationFactory>
{
    private readonly IntegrationTestsWebApplicationFactory factory;
    private readonly Faker faker;

    public BooksControllerTests(IntegrationTestsWebApplicationFactory factory)
    {
        this.factory = factory;
        this.faker = new Faker();
    }

    [Fact]
    [TestPriority(1)]
    public async Task GetPage_ShouldResponse200OkWithPage()
    {
        // Arrange
        var booksNumber = this.faker.Random.Int(min: 7, max: 10);
        var offset = this.faker.Random.Int(min: 0, max: 2);
        var count = this.faker.Random.Int(min: 1, max: 5);

        var libraries = await this.factory.DataHelper.Library.InsertAsync(new LibraryFaker(true).GenerateBetween(1, 3));
        var bookFaker = new BookFaker()
            .WithRandomLibrary(libraries.Select(x => x.Id));

        var books = await this.factory.DataHelper.Book.InsertAsync(bookFaker.GenerateLazy(booksNumber));

        var expectedPage = new PagingCollection<BookPageItemDto>(
            new GetBooksMapper().ToDto(books.Skip(offset).Take(count)).ToList(),
            books.Count);

        // Act
        var response = await this.factory.HttpClient.GetAsync($"/api/books/{offset}/{count}");

        // Assert
        response.Should().Be200Ok().And.BeAs(expectedPage);
    }

    [Fact]
    [TestPriority(2)]
    public async Task Get_ShouldResponse200OkWithBook()
    {
        // Arrange
        var library = await this.factory.DataHelper.Library.InsertAsync(new LibraryFaker(true).Generate().Path);

        var bookFaker = new BookFaker()
            .WithRandomLibrary(new[] { library.Id });

        var book = await this.factory.DataHelper.Book.InsertAsync(bookFaker.Generate());

        var editions = await this.factory.DataHelper.Edition.InsertAsync(new EditionFaker().WithBookId(book.Id).GenerateBetween(1, 5));
#pragma warning disable CS8604 // Possible null reference argument.
        var imageContent = await ImageHelper.SaveImageAsync(book.ImageName, Path.Combine(this.factory.Configuration.ImageDirectory, library.Id.ToString()));
#pragma warning restore CS8604 // Possible null reference argument.

        var expectedDto = new BookDto
        {
            Authors = book.Authors,
            Description = book.Description,
			Image = imageContent,
			Id = book.Id,
            Editions = editions.Select(edition => new EditionDto
			{
				Pages = edition.Pages,
				Year = edition.Year,
				Isbn = edition.Isbn,
				Title = edition.Title,
				FilePath = edition.FilePath
			}).ToArray(),
            Title = book.Title
        };

        // Act
        var response = await this.factory.HttpClient.GetAsync($"/api/books/{book.Id}");

        // Assert
        response.Should().Be200Ok().And.BeAs(expectedDto);
    }

    [Fact]
    [TestPriority(3)]
    public async Task Patch_IfEditionExists_ShouldResponse204NoContentAndUpdateBookAndEdition()
    {
        // Arrange
        var library = await this.factory.DataHelper.Library.InsertAsync(new LibraryFaker(true).Generate().Path);

        var bookFaker = new BookFaker()
            .WithRandomLibrary(new[] { library.Id });

        var book = await this.factory.DataHelper.Book.InsertAsync(bookFaker.Generate());

        var edition = await this.factory.DataHelper.Edition.InsertAsync(new EditionFaker().WithBookId(book.Id).Generate());

        var updateBook = new BookFaker()
            .WithEditions(new[] { new EditionFaker().Generate() })
            .Generate();

        var updateBookCommand = new UpdateBookCommand
        {
            Id = book.Id,
            Authors = updateBook.Authors,
            Description = updateBook.Description,
            Title = updateBook.Title,
            Edition = new UpdateBookEdition
            {
                Id = edition.Id,
                Isbn = edition?.Isbn,
                Pages = edition?.Pages,
                Year = edition?.Year,
            }
        };

        // Act
        var response = await this.factory.HttpClient.PatchAsync($"/api/books/{book.Id}", JsonContent.Create(updateBookCommand));

        // Assert
        response.Should().Be204NoContent();
        await AssertBook(book, updateBookCommand);
    }

    [Fact]
    [TestPriority(5)]
    public async Task Patch_IfCommandIdNotEqualParameterId_ShouldResponse400BadRequest()
    {
        // Arrange
        var book1 = new BookFaker().Generate();
        var book2 = new BookFaker().Generate();

        var updateBookCommand = new UpdateBookCommand
        {
            Id = book1.Id
        };

        // Act
        var response = await this.factory.HttpClient.PatchAsync($"/api/books/{book2.Id}", JsonContent.Create(updateBookCommand));

        // Assert
        response.Should().Be400BadRequest();
    }

    [Fact]
    [TestPriority(6)]
    public async Task Delete_ShouldResponse204NoContentAndDeleteEntities()
    {
        // Arrange
        var library = await this.factory.DataHelper.Library.InsertAsync(new LibraryFaker(true).Generate().Path);

        var bookFaker = new BookFaker()
            .WithRandomLibrary(new[] { library.Id });

        var book = await this.factory.DataHelper.Book.InsertAsync(bookFaker.Generate());

        await this.factory.DataHelper.Edition.InsertAsync(new EditionFaker().WithBookId(book.Id).Generate());

        // Act
        var response = await this.factory.HttpClient.DeleteAsync($"/api/books/{book.Id}");

        // Assert
        response.Should().Be204NoContent();
    }

    [Fact]
    [TestPriority(7)]
    public async Task Search_ShouldResponse200OkWithPage()
    {
        // Arrange
        var booksNumber = this.faker.Random.Int(min: 15, max: 30);
        var offset = 0;
        var count = this.faker.Random.Int(min: 1, max: 5);

        var libraries = await this.factory.DataHelper.Library.InsertAsync(new LibraryFaker(true).GenerateBetween(1, 3));
        var bookFaker = new BookFaker()
            .WithRandomLibrary(libraries.Select(x => x.Id));

        var books = await this.factory.DataHelper.Book.InsertAsync(bookFaker.GenerateLazy(booksNumber));

        var firstBook = books.First();
        var pattern = string.Concat(firstBook.Title.Skip(1).Take(this.faker.Random.Int(3, 5)));

        var searchRequest = new SearchBooksQuery(pattern, offset, count);

        // Act
        var response = await this.factory.HttpClient.PostAsJsonAsync("/api/books/search", searchRequest);

        // Assert
        var result = await response.Should().Be200Ok()
            .And.Subject.Content.ReadFromJsonAsync<PagingCollection<SearchBookPageItemDto>>();

        result?.Items.Should().HaveCountGreaterThanOrEqualTo(1);
    }

    [Fact]
    [TestPriority(8)]
    public async Task Download_ShouldResponse200OkWithBookFile()
    {
        // Arrange
        var bookContent = this.faker.Lorem.Text();
        var bookFilePath = Path.Combine(Directory.GetCurrentDirectory(), this.faker.System.FileName());

        File.WriteAllText(bookFilePath, bookContent);

        var library = await this.factory.DataHelper.Library.InsertAsync(new LibraryFaker(true).Generate().Path);

        var bookFaker = new BookFaker()
            .WithLibrary(library.Id);

        var book = await this.factory.DataHelper.Book.InsertAsync(bookFaker.Generate());
        var edition = await this.factory.DataHelper.Edition.InsertAsync(
            new EditionFaker().WithBookId(book.Id)
                .WithFilePath(bookFilePath)
                .Generate());

        // Act
        var response = await this.factory.HttpClient.GetAsync($"/api/books/{book.Id}/editions/{edition.Id}/file");

        // Assert
        await response.Should().Be200Ok().And.Subject.Content.ReadAsStreamAsync();
    }

    private async Task AssertBook(Book book, UpdateBookCommand updateBookCommand)
    {
        var actualBook = await this.factory.DataHelper.Book.GetBookAsync(book.Id);
#pragma warning disable CS8602 // Dereference of a possibly null reference.
        var actualEdition = await this.factory.DataHelper.Edition.GetAsync(updateBookCommand.Edition.Id);
#pragma warning restore CS8602 // Dereference of a possibly null reference.

        actualBook.Should().NotBeNull();
        actualBook.Title.Should().Be(updateBookCommand.Title);
        actualBook.Authors.Should().Be(updateBookCommand.Authors);
        actualBook.Description.Should().Be(updateBookCommand.Description);

        actualEdition.Isbn.Should().Be(updateBookCommand.Edition?.Isbn);
        actualEdition.Pages.Should().Be(updateBookCommand.Edition?.Pages);
        actualEdition.Year.Should().Be(updateBookCommand.Edition?.Year);
    }
}
