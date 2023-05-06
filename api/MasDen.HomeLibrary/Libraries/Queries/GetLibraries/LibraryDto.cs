using MasDen.HomeLibrary.Domain.StronglyTypedIds;

namespace MasDen.HomeLibrary.Libraries.Queries.GetLibraries;

public class LibraryDto
{
    public LibraryId Id { get; set; }
    public string Path { get; set; } = null!;
}
