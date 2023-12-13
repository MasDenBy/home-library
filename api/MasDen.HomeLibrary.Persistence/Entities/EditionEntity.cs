using MasDen.HomeLibrary.Domain;
using MasDen.HomeLibrary.Domain.StronglyTypedIds;

namespace MasDen.HomeLibrary.Persistence.Entities;

public record EditionEntity
{
    public EditionId Id { get; init; }
	public string Title { get; init; } = null!;
	public Isbn? Isbn { get; init; }
    public int? Pages { get; init; }
    public int? Year { get; init; }
    public BookId BookId { get; init; }
    public string FilePath { get; init; } = null!;
}
