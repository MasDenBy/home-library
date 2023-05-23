using MasDen.HomeLibrary.Domain.Entities;
using MasDen.HomeLibrary.Domain.StronglyTypedIds;
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

    public async Task<Book> GetBookAsync(BookId bookId, CancellationToken cancellationToken = default)
    {
        var entities = await this.DataObject.QueryAsync<Book, Domain.Entities.File, Metadata, Book>(
            @"SELECT b.id, b.title, b.authors, b.description, b.libraryId, b.fileId as Id, f.path, f.imageName, b.metadataId as Id, m.pages, m.year
              FROM book b 
              JOIN file f ON f.id = b.fileId
              LEFT JOIN metadata m ON m.id = b.metadataId
              WHERE b.id = @id",
            (book, file, metadata) =>
            {
                book.SetMetadata(metadata);
                book.SetFile(file);

                return book;
            },
            new { id = bookId }, "Id, Id", cancellationToken);

        return entities.First();
    }
}
