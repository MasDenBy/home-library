using MasDen.HomeLibrary.Domain.Entities;
using MasDen.HomeLibrary.Domain.StronglyTypedIds;

namespace MasDen.HomeLibrary.Infrastructure.Persistence;
public interface IBookFileDataStore
{
    Task DeleteAsync(BookFileId id, CancellationToken cancellationToken = default);
    Task<BookFile> GetByBookIdAsync(BookId bookId, CancellationToken cancellationToken = default);
}
