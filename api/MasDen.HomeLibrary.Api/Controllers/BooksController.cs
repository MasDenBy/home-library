using MasDen.HomeLibrary.Books.Queries.GetBooks;
using MasDen.HomeLibrary.Common.Models;
using Microsoft.AspNetCore.Mvc;

namespace MasDen.HomeLibrary.Api.Controllers;
public class BooksController : ApiControllerBase
{
    [HttpGet("{offset}/{count}")]
    public Task<PagingCollection<BookDto>> GetPage(int offset, int count, CancellationToken cancellationToken = default) =>
        this.Mediator.Send(new GetBooksQuery(offset, count), cancellationToken);
}
