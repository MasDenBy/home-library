using MasDen.HomeLibrary.Domain.Entities;

namespace MasDen.HomeLibrary.Infrastructure.Persistence;

public interface IBookDataStore : IDataStore<Book>
{
    Task<(IReadOnlyCollection<Book> entities, long total)> GetBooksAsync(int offset, int count, CancellationToken cancellationToken = default);
}
