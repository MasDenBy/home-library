using MasDen.HomeLibrary.Domain.Entities;
using MasDen.HomeLibrary.Libraries.Queries.GetLibraries;
using Riok.Mapperly.Abstractions;

namespace MasDen.HomeLibrary.Common.Mappers;

[Mapper]
public partial class LibraryMapper
{
    public partial LibraryDto ToDto(Library library);
    public partial IReadOnlyCollection<LibraryDto> ToDto(IEnumerable<Library> libraries);
}
