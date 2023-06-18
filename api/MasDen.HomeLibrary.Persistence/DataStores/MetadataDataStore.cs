using MasDen.HomeLibrary.Domain.Entities;
using MasDen.HomeLibrary.Domain.StronglyTypedIds;
using MasDen.HomeLibrary.Infrastructure.Exceptions;
using MasDen.HomeLibrary.Infrastructure.Persistence;

namespace MasDen.HomeLibrary.Persistence.DataStores;
public class MetadataDataStore : BaseDataStore<Metadata>, IMetadataDataStore
{
    public MetadataDataStore(IDataObjectFactory dataObjectFactory)
        : base(dataObjectFactory)
    {
    }

    public Task<MetadataId> CreateAsync(Metadata metadata) =>
        this.DataObject.InsertAsync<MetadataId>(
            insertSql: "INSERT INTO metadata (id, isbn, pages, year, bookId) VALUES (@id, @isbn, @pages, @year, @bookId)",
            param: new
            {
                id = metadata.Id,
                isbn = metadata.Isbn,
                pages = metadata.Pages,
                year = metadata.Year,
                bookId = metadata.BookId
            });

    public async Task UpdateAsync(Metadata metadata, CancellationToken cancellationToken = default)
    {
        await this.DataObject.ExecuteAsync(
            sql: @"
                    UPDATE metadata
                    SET isbn = @isbn,
                        pages = @pages,
                        year = @year
                    WHERE id = @id",
            new
            {
                id = metadata.Id,
                isbn = metadata.Isbn,
                pages = metadata.Pages,
                year = metadata.Year
            },
            cancellationToken: cancellationToken);
    }

    public async Task DeleteAsync(MetadataId id, CancellationToken cancellationToken = default)
    {
        if(!await this.DataObject.DeleteAsync(id.Value, cancellationToken))
        {
            throw new NotFoundException(typeof(Metadata), id.Value);
        }
    }
}
