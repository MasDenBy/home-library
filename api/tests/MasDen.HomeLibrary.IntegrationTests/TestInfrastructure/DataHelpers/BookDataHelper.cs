using Dapper;
using MasDen.HomeLibrary.Domain;
using MasDen.HomeLibrary.Domain.StronglyTypedIds;
using MasDen.HomeLibrary.Infrastructure.Configuration;
using MasDen.HomeLibrary.Persistence.Entities;

namespace MasDen.HomeLibrary.IntegrationTests.TestInfrastructure.DataHelpers;

internal class BookDataHelper : DataHelperBase
{
    public BookDataHelper(ApplicationConfiguration configuration)
        : base(configuration)
    {
    }

    protected override string TableName => "book";

    public async Task<IReadOnlyCollection<Book>> InsertAsync(IEnumerable<Book> books)
    {
        List<Book> result = new();

        foreach (var book in books)
        {
            result.Add(await InsertAsync(book));
        }

        return result;
    }

    public async Task<Book> InsertAsync(Book book)
    {
        using var connection = this.CreateConnection();

        var id = await this.AsyncRetryPolicy
            .ExecuteAsync(async () => await
                connection.QuerySingleAsync<BookId>(
                    sql: "INSERT INTO book (id, title, description, authors, imageName, libraryId) VALUES (@id, @title, @description, @authors, @imageName, @libraryId); SELECT CAST(LAST_INSERT_ID() AS INT);",
                    param: new
                    {
                        id = book.Id,
                        title = book.Title,
                        description = book.Description,
                        authors = book.Authors,
                        imageName = book.ImageName,
                        libraryId = book.LibraryId
                    }));

        book.SetId(id);

        return book;
    }

    public async Task<BookEntity> GetBookAsync(BookId bookId)
    {
        using var connection = this.CreateConnection();

        CommandDefinition command = new(@"SELECT b.id, b.title, b.authors, b.description, b.libraryId
              FROM book b
              WHERE b.id = @id", new { id = bookId });

        return await this.AsyncRetryPolicy.ExecuteAsync(
            async () => await connection.QueryFirstAsync<BookEntity>(command));
    }
}
