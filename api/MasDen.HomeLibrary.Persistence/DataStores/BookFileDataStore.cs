using MasDen.HomeLibrary.Domain.Entities;
using MasDen.HomeLibrary.Domain.StronglyTypedIds;
using MasDen.HomeLibrary.Infrastructure.Exceptions;
using MasDen.HomeLibrary.Infrastructure.Persistence;

namespace MasDen.HomeLibrary.Persistence.DataStores;

public class BookFileDataStore : BaseDataStore<BookFile>, IBookFileDataStore
{
    public BookFileDataStore(IDataObjectFactory dataObjectFactory)
        : base(dataObjectFactory)
    {
    }

    public async Task DeleteAsync(BookFileId id, CancellationToken cancellationToken = default)
    {
        if(!await this.DataObject.DeleteAsync(id.Value, cancellationToken))
        {
            throw new NotFoundException(typeof(BookFile), id.Value);
        }
    }
}
