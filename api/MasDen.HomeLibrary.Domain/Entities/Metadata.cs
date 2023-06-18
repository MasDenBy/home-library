namespace MasDen.HomeLibrary.Domain.Entities;

public record Metadata
{
    public MetadataId Id { get; init; }
    public string? Isbn { get; init; }
    public int? Pages { get; init; }
    public int? Year { get; init; }
    public BookId BookId { get; init; }
}
