using MasDen.HomeLibrary.Domain.Entities;

namespace MasDen.HomeLibrary.Infrastructure.Persistence;

public interface ILibraryDataStore : IDataStore<Library>
{
    Task<int> CreateAsync(Library library);
    Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default);
    Task<IReadOnlyCollection<Library>> GetAllAsync(CancellationToken cancellationToken = default);
}