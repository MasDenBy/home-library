using MasDen.HomeLibrary.Common.Models;
using MediatR;

namespace MasDen.HomeLibrary.Books.Queries.GetBooks;

public record GetBooksQuery(int Offset, int Count) : IRequest<PagingCollection<BookDto>>
{
}
