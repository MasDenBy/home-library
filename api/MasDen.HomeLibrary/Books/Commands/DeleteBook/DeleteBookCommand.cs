using MasDen.HomeLibrary.Domain.StronglyTypedIds;
using MediatR;

namespace MasDen.HomeLibrary.Books.Commands.DeleteBook;
public record DeleteBookCommand(BookId Id) : IRequest
{
}
