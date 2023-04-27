using MasDen.HomeLibrary.Domain.Entities;
using Riok.Mapperly.Abstractions;

namespace MasDen.HomeLibrary.Libraries.Queries.GetLibraries;

[Mapper]
public partial class LibraryMapper
{
    public partial LibraryDto ToDto(Library library);
    public partial IReadOnlyCollection<LibraryDto> ToDto(IEnumerable<Library> libraries);
}
