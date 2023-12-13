using MasDen.HomeLibrary.Domain;
using MasDen.HomeLibrary.Domain.StronglyTypedIds;

namespace MasDen.HomeLibrary.Infrastructure.Persistence;
public interface IEditionDataStore
{
    Task<EditionId> CreateAsync(Edition edition);
    Task DeleteAsync(EditionId id, CancellationToken cancellationToken = default);
	Task<Edition> GetAsync(EditionId id, BookId bookId, CancellationToken cancellationToken = default);
	Task UpdateAsync(Edition edition, CancellationToken cancellationToken = default);
}
