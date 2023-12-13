using MasDen.HomeLibrary.Domain;
using Riok.Mapperly.Abstractions;

namespace MasDen.HomeLibrary.Libraries.Commands.CreateLibrary;

[Mapper]
public partial class LibraryMapper
{
    public partial CreatedLibraryDto ToDto(Library library);
}
