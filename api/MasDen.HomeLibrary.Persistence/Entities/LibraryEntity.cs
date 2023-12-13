using MasDen.HomeLibrary.Domain.StronglyTypedIds;

namespace MasDen.HomeLibrary.Persistence.Entities;
public record LibraryEntity
{
    public LibraryId Id { get; init; }
    public string Path { get; init; } = null!;
}
