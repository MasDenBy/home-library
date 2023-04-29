using MasDen.HomeLibrary.Domain.Entities;
using MasDen.HomeLibrary.Infrastructure.Exceptions;
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

    public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        var entity = await this.DataObject.QuerySingleAsync("Id = @id", new { id }, cancellationToken);

        return entity == null
            ? throw new NotFoundException(typeof(Library), id)
            : await this.DataObject.DeleteAsync(entity);
    }
}
