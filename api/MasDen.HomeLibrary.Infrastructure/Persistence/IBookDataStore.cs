using MasDen.HomeLibrary.Domain.Entities;
using MasDen.HomeLibrary.Domain.StronglyTypedIds;

namespace MasDen.HomeLibrary.Infrastructure.Persistence;

public interface IBookDataStore : IDataStore<Book>
{
    Task<Book> GetBookAsync(BookId bookId, CancellationToken cancellationToken = default);
    Task<(IReadOnlyCollection<Book> entities, long total)> GetBooksAsync(int offset, int count, CancellationToken cancellationToken = default);
}
