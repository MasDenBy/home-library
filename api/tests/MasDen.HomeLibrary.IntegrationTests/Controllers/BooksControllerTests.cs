using MasDen.HomeLibrary.Books.Queries.GetBook;
using MasDen.HomeLibrary.Books.Queries.GetBooks;
using MasDen.HomeLibrary.Common.Models;

namespace MasDen.HomeLibrary.IntegrationTests.Controllers;

[Collection("Integration")]
public class BooksControllerTests : IClassFixture<TestsFixture>
{
    private readonly TestsFixture fixture;
    private readonly Faker faker;

    public BooksControllerTests(TestsFixture fixture)
    {
        this.fixture = fixture;
        this.faker = new Faker();
    }

    [Fact]
    public async Task GetPage_ShouldResponse200OkWithPage()
    {
        // Arrange
        var booksNumber = this.faker.Random.Int(min: 7, max: 10);
        var offset = this.faker.Random.Int(min: 0, max: 2);
        var count = this.faker.Random.Int(min: 1, max: 5);

        var libraries = await this.fixture.DataHelper.Library.InsertAsync(new LibraryFaker(true).GenerateBetween(1, 3));
        var files = await this.fixture.DataHelper.File.InsertAsync(new FileFaker().GenerateLazy(booksNumber));
        var bookFaker = new BookFaker()
            .WithRandomLibrary(libraries.Select(x => x.Id))
            .WithRandomFile(files);

        var books = await this.fixture.DataHelper.Book.InsertAsync(bookFaker.GenerateLazy(booksNumber));
        var expectedPage = new PagingCollection<BookPageItemDto>(
            new GetBooksMapper().ToDto(books.Skip(offset).Take(count)).ToList(),
            books.Count);

        // Act
        var response = await this.fixture.HttpClient.GetAsync($"/api/books/{offset}/{count}");

        // Assert
        response.Should().Be200Ok().And.BeAs(expectedPage);
    }

    [Fact]
    public async Task Get_ShouldResponse200OkWithBook()
    {
        // Arrange
        var library = await this.fixture.DataHelper.Library.InsertAsync(new LibraryFaker(true).Generate());
        var file = await this.fixture.DataHelper.File.InsertAsync(new FileFaker().Generate());
        var metadata = await this.fixture.DataHelper.Metadata.InsertAsync(new MetadataFaker().Generate());
#pragma warning disable CS8604 // Possible null reference argument.
        var imageContent = await ImageHelper.SaveImageAsync(file.ImageName, Path.Combine(this.fixture.Configuration.ImageDirectory, library.Id.ToString()));
#pragma warning restore CS8604 // Possible null reference argument.

        var bookFaker = new BookFaker()
            .WithRandomLibrary(new[] { library.Id })
            .WithRandomFile(new[] { file })
            .WithRandomMetadata(new[] { metadata });

        var book = await this.fixture.DataHelper.Book.InsertAsync(bookFaker.Generate());

        var expectedDto = new BookDto
        {
            Authors = book.Authors,
            Description = book.Description,
            File = new FileDto
            {
                Image = imageContent
            },
            Id = book.Id,
            Metadata = new MetadataDto
            {
                Pages = metadata.Pages,
                Year = metadata.Year,
            },
            Title = book.Title
        };

        // Act
        var response = await this.fixture.HttpClient.GetAsync($"/api/books/{book.Id}");

        // Assert
        response.Should().Be200Ok().And.BeAs(expectedDto);
    }
}
