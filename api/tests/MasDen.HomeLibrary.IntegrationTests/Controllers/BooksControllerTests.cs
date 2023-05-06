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
            .WithRandomFile(files.Select(x => x.Id));

        var books = await this.fixture.DataHelper.Book.InsertAsync(bookFaker.GenerateLazy(booksNumber));
        var expectedPage = new PagingCollection<BookDto>(
            new BookMapper().ToDto(books.Skip(offset).Take(count)).ToList(),
            books.Count);

        // Act
        var response = await this.fixture.HttpClient.GetAsync($"/api/books/{offset}/{count}");

        // Assert
        response.Should().Be200Ok().And.BeAs(expectedPage);
    }
}
