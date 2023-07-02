using MasDen.HomeLibrary.Domain.StronglyTypedIds;

namespace MasDen.HomeLibrary.Books.Queries.Search;
public record SearchBookPageItemDto
{
    public BookId Id { get; init; }
    public string Title { get; init; } = null!;
    public string? Authors { get; init; }
}
