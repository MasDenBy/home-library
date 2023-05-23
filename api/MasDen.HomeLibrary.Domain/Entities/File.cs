namespace MasDen.HomeLibrary.Domain.Entities;

public record File
{
    public FileId Id { get; init; }
    public string Path { get; init; } = null!;
    public string? ImageName { get; init; }
}
