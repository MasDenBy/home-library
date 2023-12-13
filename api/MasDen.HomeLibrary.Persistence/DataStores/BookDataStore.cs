using MasDen.HomeLibrary.Domain;
using MasDen.HomeLibrary.Domain.StronglyTypedIds;
using MasDen.HomeLibrary.Infrastructure.Exceptions;
using MasDen.HomeLibrary.Infrastructure.Persistence;
using MasDen.HomeLibrary.Persistence.Entities;
using MasDen.HomeLibrary.Persistence.Mappers;

namespace MasDen.HomeLibrary.Persistence.DataStores;

public class BookDataStore : BaseDataStore<BookEntity>, IBookDataStore
{
    public BookDataStore(IDataObjectFactory dataObjectFactory)
        : base(dataObjectFactory)
    {
    }

    public async Task<(IReadOnlyCollection<Book> books, long total)> GetBooksAsync(int offset, int count, CancellationToken cancellationToken = default)
    {
        var (entities, total) = await this.DataObject.QueryPageAsync(
            sql: @"
                    SELECT COUNT(*) AS TotalCount FROM book;
                    SELECT * FROM book LIMIT @count OFFSET @offset;",
            param: new
            {
                count,
                offset
            },
            cancellationToken: cancellationToken);

        return (new BookMapper().ToDomain(entities), total);
    }

    public async Task<(IReadOnlyCollection<Book> books, long total)> SearchBooksAsync(string pattern, int offset, int count, CancellationToken cancellationToken = default)
    {
        var searchPattern = $"%{pattern}%";

        var (entities, total) = await this.DataObject.QueryPageAsync(
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

		return (new BookMapper().ToDomain(entities), total);
	}

    public async Task<Book?> GetBookAsync(BookId bookId, CancellationToken cancellationToken = default)
    {
        var reader = await this.DataObject.QueryMultipleAsync(
            sql: @"
                SELECT b.id, b.title, b.authors, b.description, b.libraryId, b.imageName
                FROM book b
                WHERE b.id = @id;

                SELECT e.id, e.title, e.isbn, e.pages, e.year, e.filePath, e.bookId
                FROM edition e
                WHERE e.bookId = @id;",
            param: new { id = bookId.Value },
            cancellationToken);

        var entity = await reader.ReadFirstAsync<BookEntity>();
        var editions = await reader.ReadAsync<EditionEntity>();

        entity.Editions = editions.ToList();

		return entity != null ? new BookMapper().ToDomain(entity) : null;
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
