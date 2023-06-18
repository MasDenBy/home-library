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
                    sql: "INSERT INTO book (id, title, description, authors, libraryId) VALUES (@id, @title, @description, @authors, @libraryId); SELECT CAST(LAST_INSERT_ID() AS INT);",
                    param: new
                    {
                        id = book.Id,
                        title = book.Title,
                        description = book.Description,
                        authors = book.Authors,
                        libraryId = book.LibraryId
                    }));

        book.SetId(id);

        return book;
    }

    public async Task<Book> GetBookAsync(BookId bookId)
    {
        using var connection = this.CreateConnection();

        CommandDefinition command = new(@"SELECT b.id, b.title, b.authors, b.description, b.libraryId, f.id, f.path, f.imageName, f.bookId, m.id, m.pages, m.year, m.isbn, m.bookId
              FROM book b 
              JOIN bookfile f ON f.bookid = b.id
              LEFT JOIN metadata m ON m.bookid = b.id
              WHERE b.id = @id", new { id = bookId });

        var books = await this.AsyncRetryPolicy.ExecuteAsync(async () => await connection.QueryAsync<Book, BookFile, Metadata, Book>(command, (book, file, metadata) =>
        {
            book.SetMetadata(metadata);
            book.SetFile(file);

            return book;
        }, "id, id"));

        return books.First();
    }
}
