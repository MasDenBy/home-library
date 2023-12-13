using MasDen.HomeLibrary.Domain;
using MasDen.HomeLibrary.Domain.StronglyTypedIds;

namespace MasDen.HomeLibrary.Books.Queries.GetBook;

public record BookDto
{
    public BookId Id { get; set; }
    public string Title { get; set; } = null!;
    public string? Authors { get; set; }
    public string? Description { get; set; }
	public string? Image { get; init; }
    public IReadOnlyCollection<EditionDto> Editions { get; init; } = null!;
}

public record EditionDto
{
	public string Title { get; init; } = null!;
	public Isbn? Isbn { get; init; }
	public int? Pages { get; set; }
    public int? Year { get; set; }
	public string FilePath { get; init; } = null!;
}