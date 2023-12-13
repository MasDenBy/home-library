namespace MasDen.HomeLibrary.Domain;

public record Edition
{
    public EditionId Id { get; init; }
    public string Title { get; init; } = null!;
    public Isbn? Isbn { get; init; }
    public int? Pages { get; init; }
    public int? Year { get; init; }
    public BookId BookId { get; init; }
    public string FilePath { get; init; } = null!;
}
