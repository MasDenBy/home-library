using MasDen.HomeLibrary.Domain.Entities;

namespace MasDen.HomeLibrary.Infrastructure.Persistence;

public interface ILibraryDataStore : IDataStore<Library>
{
    Task<IReadOnlyCollection<Library>> GetAllAsync(CancellationToken cancellationToken = default);
}