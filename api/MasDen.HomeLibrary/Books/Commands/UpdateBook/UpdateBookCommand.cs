using MasDen.HomeLibrary.Domain.StronglyTypedIds;
using MediatR;

namespace MasDen.HomeLibrary.Books.Commands.UpdateBook;
public record UpdateBookCommand : IRequest
{
    public BookId Id { get; init; }
    public string Title { get; init; } = null!;
    public string? Authors { get; init; }
    public string? Description { get; init; }
    public UpdateBookMetadata? Metadata { get; init; }
}

public record UpdateBookMetadata
{
    public int? Pages { get; init; }
    public int? Year { get; init; }
    public string? Isbn { get; init; }
}
