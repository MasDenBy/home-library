using MasDen.HomeLibrary.Domain.StronglyTypedIds;

namespace MasDen.HomeLibrary.Books.Queries.GetBook;

public record BookDto
{
    public BookId Id { get; set; }
    public string Title { get; set; } = null!;
    public string? Authors { get; set; }
    public string? Description { get; set; }
    public FileDto File { get; set; } = null!;
    public MetadataDto? Metadata { get; set; }
}

public record FileDto
{
    public string? Image { get; set; }
}

public record MetadataDto
{
    public int? Pages { get; set; }
    public int? Year { get; set; }
}