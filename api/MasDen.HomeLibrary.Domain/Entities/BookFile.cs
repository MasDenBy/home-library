namespace MasDen.HomeLibrary.Domain.Entities;

public record BookFile
{
    public BookFileId Id { get; init; }
    public string Path { get; init; } = null!;
    public string? ImageName { get; init; }
    public BookId BookId { get; init; }
}
