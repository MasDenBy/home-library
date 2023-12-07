using MasDen.HomeLibrary.Domain.StronglyTypedIds;
using MediatR;

namespace MasDen.HomeLibrary.Books.Commands.IndexBook;
public record IndexBookCommand(BookId Id) : IRequest
{
}
