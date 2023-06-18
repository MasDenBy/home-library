using MasDen.HomeLibrary.Domain.Entities;
using MasDen.HomeLibrary.Domain.StronglyTypedIds;

namespace MasDen.HomeLibrary.Infrastructure.Persistence;
public interface IMetadataDataStore : IDataStore<Metadata>
{
    Task<MetadataId> CreateAsync(Metadata metadata);
    Task DeleteAsync(MetadataId id, CancellationToken cancellationToken = default);
    Task UpdateAsync(Metadata metadata, CancellationToken cancellationToken = default);
}
