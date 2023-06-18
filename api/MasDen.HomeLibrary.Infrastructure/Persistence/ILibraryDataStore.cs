using MasDen.HomeLibrary.Domain.Entities;
using MasDen.HomeLibrary.Domain.StronglyTypedIds;

namespace MasDen.HomeLibrary.Infrastructure.Persistence;

public interface ILibraryDataStore : IDataStore<Library>
{
    Task<LibraryId> CreateAsync(Library library);
    Task DeleteAsync(LibraryId id, CancellationToken cancellationToken = default);
    Task<IReadOnlyCollection<Library>> GetAllAsync(CancellationToken cancellationToken = default);
}