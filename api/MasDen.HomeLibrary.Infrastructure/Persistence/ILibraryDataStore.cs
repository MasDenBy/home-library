using MasDen.HomeLibrary.Domain;
using MasDen.HomeLibrary.Domain.StronglyTypedIds;

namespace MasDen.HomeLibrary.Infrastructure.Persistence;

public interface ILibraryDataStore
{
    Task<LibraryId> CreateAsync(string path);
    Task DeleteAsync(LibraryId id, CancellationToken cancellationToken = default);
    Task<IReadOnlyCollection<Library>> GetAllAsync(CancellationToken cancellationToken = default);
}