using MasDen.HomeLibrary.Domain;
using MasDen.HomeLibrary.Domain.StronglyTypedIds;
using MasDen.HomeLibrary.Infrastructure.Exceptions;
using MasDen.HomeLibrary.Infrastructure.Persistence;
using MasDen.HomeLibrary.Persistence.Entities;
using MasDen.HomeLibrary.Persistence.Mappers;

namespace MasDen.HomeLibrary.Persistence.DataStores;

public class LibraryDataStore : BaseDataStore<LibraryEntity>, ILibraryDataStore
{
    public LibraryDataStore(IDataObjectFactory dataObjectFactory)
        : base(dataObjectFactory)
    {
    }

    public async Task<IReadOnlyCollection<Library>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var entity = await this.DataObject.GetAllAsync(cancellationToken);

        return new LibraryMapper().ToDomain(entity);
	}

    public Task<LibraryId> CreateAsync(string path) =>
        this.DataObject.InsertAsync<LibraryId>(
            insertSql: "INSERT INTO library (path) VALUES (@path)",
            param: new
            {
                path
            });

    public async Task DeleteAsync(LibraryId id, CancellationToken cancellationToken = default)
    {
        if(!await this.DataObject.DeleteAsync(id.Value, cancellationToken))
        {
            throw new NotFoundException(typeof(Library), id.Value);
        }
    }
}
