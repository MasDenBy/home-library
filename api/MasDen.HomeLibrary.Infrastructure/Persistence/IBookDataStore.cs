using MasDen.HomeLibrary.Domain;
using MasDen.HomeLibrary.Domain.StronglyTypedIds;

namespace MasDen.HomeLibrary.Infrastructure.Persistence;

public interface IBookDataStore
{
    Task DeleteAsync(BookId id, CancellationToken cancellationToken = default);
    Task<Book?> GetBookAsync(BookId bookId, CancellationToken cancellationToken = default);
    Task<(IReadOnlyCollection<Book> books, long total)> GetBooksAsync(int offset, int count, CancellationToken cancellationToken = default);
    Task<(IReadOnlyCollection<Book> books, long total)> SearchBooksAsync(string pattern, int offset, int count, CancellationToken cancellationToken = default);
    Task UpdateAsync(Book book, CancellationToken cancellationToken = default);
}
