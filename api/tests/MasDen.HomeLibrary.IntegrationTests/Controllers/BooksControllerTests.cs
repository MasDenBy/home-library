﻿using System.Net.Http.Json;
using MasDen.HomeLibrary.Books.Commands.UpdateBook;
using MasDen.HomeLibrary.Books.Queries.GetBook;
using MasDen.HomeLibrary.Books.Queries.GetBooks;
using MasDen.HomeLibrary.Common.Models;
using MasDen.HomeLibrary.Domain.Entities;
using MasDen.HomeLibrary.TestInfrastructure;

namespace MasDen.HomeLibrary.IntegrationTests.Controllers;

[Collection("Integration")]
[TestCaseOrderer("MasDen.HomeLibrary.TestInfrastructure.PriorityOrderer", "MasDen.HomeLibrary.TestInfrastructure")]
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
    [TestPriority(1)]
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
    [TestPriority(2)]
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
            Metadata = new Books.Queries.GetBook.MetadataDto
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

    [Fact]
    [TestPriority(3)]
    public async Task Patch_IfMetadataExists_ShouldResponse204NoContentAndUpdateBookAndMetadata()
    {
        // Arrange
        var library = await this.fixture.DataHelper.Library.InsertAsync(new LibraryFaker(true).Generate());
        var file = await this.fixture.DataHelper.File.InsertAsync(new FileFaker().Generate());
        var metadata = await this.fixture.DataHelper.Metadata.InsertAsync(new MetadataFaker().Generate());

        var bookFaker = new BookFaker()
            .WithRandomLibrary(new[] { library.Id })
            .WithRandomFile(new[] { file })
            .WithRandomMetadata(new[] { metadata });

        var book = await this.fixture.DataHelper.Book.InsertAsync(bookFaker.Generate());

        var updateBook = new BookFaker()
            .WithMetadata(new MetadataFaker().Generate())
            .Generate();

        var updateBookCommand = new UpdateBookCommand
        {
            Id = book.Id,
            Authors = updateBook.Authors,
            Description = updateBook.Description,
            Title = updateBook.Title,
            Metadata = new UpdateBookMetadata
            {
                Isbn = updateBook.Metadata?.Isbn,
                Pages = updateBook.Metadata?.Pages,
                Year = updateBook.Metadata?.Year,
            }
        };

        // Act
        var response = await this.fixture.HttpClient.PatchAsync($"/api/books/{book.Id}", JsonContent.Create(updateBookCommand));

        // Assert
        response.Should().Be204NoContent();
        await AssertBook(book, updateBookCommand);
    }

    [Fact]
    [TestPriority(4)]
    public async Task Patch_IfNoMetadataExists_ShouldResponse204NoContentAndUpdateBookAndCreateMetadata()
    {
        // Arrange
        var library = await this.fixture.DataHelper.Library.InsertAsync(new LibraryFaker(true).Generate());
        var file = await this.fixture.DataHelper.File.InsertAsync(new FileFaker().Generate());

        var bookFaker = new BookFaker()
            .WithRandomLibrary(new[] { library.Id })
            .WithRandomFile(new[] { file });

        var book = await this.fixture.DataHelper.Book.InsertAsync(bookFaker.Generate());

        var updateBook = new BookFaker()
            .WithMetadata(new MetadataFaker().Generate())
            .Generate();

        var updateBookCommand = new UpdateBookCommand
        {
            Id = book.Id,
            Authors = updateBook.Authors,
            Description = updateBook.Description,
            Title = updateBook.Title,
            Metadata = new UpdateBookMetadata
            {
                Isbn = updateBook.Metadata?.Isbn,
                Pages = updateBook.Metadata?.Pages,
                Year = updateBook.Metadata?.Year,
            }
        };

        // Act
        var response = await this.fixture.HttpClient.PatchAsync($"/api/books/{book.Id}", JsonContent.Create(updateBookCommand));

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
        var response = await this.fixture.HttpClient.PatchAsync($"/api/books/{book2.Id}", JsonContent.Create(updateBookCommand));

        // Assert
        response.Should().Be400BadRequest();
    }

    private async Task AssertBook(Book book, UpdateBookCommand updateBookCommand)
    {
        var actualBook = await this.fixture.DataHelper.Book.GetBookAsync(book.Id);
        actualBook.Should().NotBeNull();
        actualBook.Title.Should().Be(updateBookCommand.Title);
        actualBook.Authors.Should().Be(updateBookCommand.Authors);
        actualBook.Description.Should().Be(updateBookCommand.Description);
        actualBook.Metadata.Isbn.Should().Be(updateBookCommand.Metadata.Isbn);
        actualBook.Metadata.Pages.Should().Be(updateBookCommand.Metadata.Pages);
        actualBook.Metadata.Year.Should().Be(updateBookCommand.Metadata.Year);
    }
}
