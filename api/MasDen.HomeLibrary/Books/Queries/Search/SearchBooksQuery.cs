using MasDen.HomeLibrary.Common.Models;
using MediatR;

namespace MasDen.HomeLibrary.Books.Queries.Search;

public record SearchBooksQuery(string Pattern, int Offset, int Count) : IRequest<PagingCollection<SearchBookPageItemDto>>
{
}