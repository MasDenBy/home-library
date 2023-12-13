using MasDen.HomeLibrary.Domain;
using MasDen.HomeLibrary.Persistence.Entities;
using Riok.Mapperly.Abstractions;

namespace MasDen.HomeLibrary.Persistence.Mappers;
[Mapper]
public partial class LibraryMapper
{
	public partial IReadOnlyCollection<Library> ToDomain(IEnumerable<LibraryEntity> entities);
}
