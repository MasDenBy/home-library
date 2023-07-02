using MasDen.HomeLibrary.Books.Commands.UpdateBook;
using MasDen.HomeLibrary.Books.DeleteBook;
using MasDen.HomeLibrary.Books.Queries.GetBook;
using MasDen.HomeLibrary.Books.Queries.GetBooks;
using MasDen.HomeLibrary.Books.Queries.Search;
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

    [HttpPatch("{id}")]
    public async Task<IActionResult> Patch(BookId id, UpdateBookCommand command, CancellationToken cancellationToken = default)
    {
        if(id != command.Id)
        {
            return this.BadRequest();
        }

        await this.Mediator.Send(command, cancellationToken);

        return this.NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(BookId id, CancellationToken cancellationToken = default)
    {
        await this.Mediator.Send(new DeleteBookCommand(id), cancellationToken);

        return NoContent();
    }

    [HttpPost("search")]
    public Task<PagingCollection<SearchBookPageItemDto>> Search(SearchBooksQuery query, CancellationToken cancellationToken = default) =>
        this.Mediator.Send(query, cancellationToken);
}
