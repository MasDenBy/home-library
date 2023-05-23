using MasDen.HomeLibrary.Domain.StronglyTypedIds;
using MediatR;

namespace MasDen.HomeLibrary.Books.Queries.GetBook;
public record GetBookQuery(BookId BookId) : IRequest<BookDto>
{
}
