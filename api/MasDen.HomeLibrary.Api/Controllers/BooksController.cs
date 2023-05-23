using MasDen.HomeLibrary.Books.Queries.GetBook;
using MasDen.HomeLibrary.Books.Queries.GetBooks;
using MasDen.HomeLibrary.Common.Models;
using MasDen.HomeLibrary.Domain.StronglyTypedIds;
using Microsoft.AspNetCore.Mvc;

namespace MasDen.HomeLibrary.Api.Controllers;
public class BooksController : ApiControllerBase
{
    [HttpGet("{offset}/{count}")]
    public Task<PagingCollection<BookPageItemDto>> GetPage(int offset, int count, CancellationToken cancellationToken = default) =>
        this.Mediator.Send(new GetBooksQuery(offset, count), cancellationToken);

    [HttpGet("{id}")]
    public Task<BookDto> Get(BookId id, CancellationToken cancellationToken = default) =>
        this.Mediator.Send(new GetBookQuery(id), cancellationToken);
}
