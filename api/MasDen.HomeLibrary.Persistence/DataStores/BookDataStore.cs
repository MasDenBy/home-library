using MasDen.HomeLibrary.Domain.Entities;
using MasDen.HomeLibrary.Domain.StronglyTypedIds;
using MasDen.HomeLibrary.Infrastructure.Exceptions;
using MasDen.HomeLibrary.Infrastructure.Persistence;

namespace MasDen.HomeLibrary.Persistence.DataStores;

public class BookDataStore : BaseDataStore<Book>, IBookDataStore
{
    public BookDataStore(IDataObjectFactory dataObjectFactory)
        : base(dataObjectFactory)
    {
    }

    public Task<(IReadOnlyCollection<Book> entities, long total)> GetBooksAsync(int offset, int count, CancellationToken cancellationToken = default)
    {
        return this.DataObject.QueryPageAsync(
            sql: @"
                    SELECT COUNT(*) AS TotalCount FROM book;
                    SELECT * FROM book LIMIT @count OFFSET @offset;",
            param: new
            {
                count,
                offset
            },
            cancellationToken: cancellationToken);
    }

    public Task<(IReadOnlyCollection<Book> entities, long total)> SearchBooksAsync(string pattern, int offset, int count, CancellationToken cancellationToken = default)
    {
        var searchPattern = $"%{pattern}%";

        return this.DataObject.QueryPageAsync(
            sql: @"
                    SELECT COUNT(*) AS TotalCount FROM book
                    WHERE title LIKE @pattern OR description LIKE @pattern OR authors LIKE @pattern;

                    SELECT * FROM book
                    WHERE title LIKE @pattern OR description LIKE @pattern OR authors LIKE @pattern
                    LIMIT @count OFFSET @offset;
                    ",
            param: new
            {
                pattern = searchPattern,
                count,
                offset
            },
            cancellationToken: cancellationToken);
    }

    public async Task<Book> GetBookAsync(BookId bookId, CancellationToken cancellationToken = default)
    {
        var entities = await this.DataObject.QueryAsync<Book, BookFile, Metadata, Book>(
            @"SELECT b.id, b.title, b.authors, b.description, b.libraryId, f.id, f.path, f.imageName, f.bookId, m.id, m.pages, m.year, m.bookId
              FROM book b 
              JOIN bookfile f ON f.bookid = b.id
              LEFT JOIN metadata m ON m.bookid = b.id
              WHERE b.id = @id",
            (book, file, metadata) =>
            {
                book.SetMetadata(metadata);
                book.SetFile(file);

                return book;
            },
            new { id = bookId }, "id, id", cancellationToken);

        return entities.First();
    }

    public async Task UpdateAsync(Book book, CancellationToken cancellationToken = default)
    {
        await this.DataObject.ExecuteAsync(
            sql: @"
                    UPDATE book
                    SET title = @title,
                        authors = @authors,
                        description = @description
                    WHERE id = @id",
            new
            {
                id = book.Id,
                title = book.Title,
                authors = book.Authors,
                description = book.Description
            },
            cancellationToken: cancellationToken);
    }

    public async Task DeleteAsync(BookId id, CancellationToken cancellationToken = default)
    {
        if(!await this.DataObject.DeleteAsync(id.Value, cancellationToken))
        {
            throw new NotFoundException(typeof(Book), id.Value);
        }
    }
}
