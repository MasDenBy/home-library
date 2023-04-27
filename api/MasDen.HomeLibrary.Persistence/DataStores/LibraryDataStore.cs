using MasDen.HomeLibrary.Domain.Entities;
using MasDen.HomeLibrary.Infrastructure.Persistence;

namespace MasDen.HomeLibrary.Persistence.DataStores;

public class LibraryDataStore : BaseDataStore<Library>, ILibraryDataStore
{
    public LibraryDataStore(IDataObjectFactory dataObjectFactory)
        : base(dataObjectFactory)
    {
    }

    public Task<IReadOnlyCollection<Library>> GetAllAsync(CancellationToken cancellationToken = default) =>
        this.DataObject.GetAllAsync(cancellationToken);

    public Task<int> CreateAsync(Library library) =>
        this.DataObject.InsertAsync(library);
}
