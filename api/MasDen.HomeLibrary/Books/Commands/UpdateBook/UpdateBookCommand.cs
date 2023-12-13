using MasDen.HomeLibrary.Domain;
using MasDen.HomeLibrary.Domain.StronglyTypedIds;
using MediatR;

namespace MasDen.HomeLibrary.Books.Commands.UpdateBook;
public record UpdateBookCommand : IRequest
{
    public BookId Id { get; init; }
    public string Title { get; init; } = null!;
    public string? Authors { get; init; }
    public string? Description { get; init; }
    public UpdateBookEdition? Edition { get; init; }
}

public record UpdateBookEdition
{
    public EditionId Id { get; init; }
    public int? Pages { get; init; }
    public int? Year { get; init; }
    public Isbn? Isbn { get; init; }
    public string? Title { get; init; }
}
