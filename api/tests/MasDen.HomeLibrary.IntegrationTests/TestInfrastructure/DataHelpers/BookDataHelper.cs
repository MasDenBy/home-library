using Dapper;
using MasDen.HomeLibrary.Domain.Entities;
using MasDen.HomeLibrary.Domain.StronglyTypedIds;

namespace MasDen.HomeLibrary.IntegrationTests.TestInfrastructure.DataHelpers;

internal class BookDataHelper : DataHelperBase
{
    public BookDataHelper(TestsConfiguration configuration)
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
                    sql: "INSERT INTO book (id, title, description, authors, fileId, metadataId, libraryId) VALUES (@id, @title, @description, @authors, @fileId, @metadataId, @libraryId); SELECT CAST(LAST_INSERT_ID() AS INT);",
                    param: new
                    {
                        id = book.Id,
                        title = book.Title,
                        description = book.Description,
                        authors = book.Authors,
                        fileId = book.File.Id,
                        metadataId = book.Metadata?.Id,
                        libraryId = book.LibraryId
                    }));

        book.SetId(id);

        return book;
    }
}
