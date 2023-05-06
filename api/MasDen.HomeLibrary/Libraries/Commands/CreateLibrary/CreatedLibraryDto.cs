using MasDen.HomeLibrary.Domain.StronglyTypedIds;

namespace MasDen.HomeLibrary.Libraries.Commands.CreateLibrary;

public class CreatedLibraryDto
{
    public LibraryId Id { get; set; }
    public string Path { get; set; } = null!;
}
