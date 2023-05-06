using MasDen.HomeLibrary.Domain.Entities;
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
}
