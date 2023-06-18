using MasDen.HomeLibrary.Domain.StronglyTypedIds;
using MediatR;

namespace MasDen.HomeLibrary.Books.DeleteBook;
public record DeleteBookCommand(BookId Id) : IRequest
{
}
