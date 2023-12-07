using MasDen.HomeLibrary.Books.Commands.UpdateBook;
using MasDen.HomeLibrary.Books.Commands.DeleteBook;
using MasDen.HomeLibrary.Books.Queries.GetBook;
using MasDen.HomeLibrary.Books.Queries.GetBooks;
using MasDen.HomeLibrary.Books.Queries.Search;
using MasDen.HomeLibrary.Common.Models;
using MasDen.HomeLibrary.Domain.StronglyTypedIds;
using Microsoft.AspNetCore.Mvc;
using MasDen.HomeLibrary.Books.Queries.DownloadBook;
using MasDen.HomeLibrary.Books.Commands.IndexBook;

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

    [HttpGet("{id}/file")]
    public async Task<IActionResult> Download(BookId id, CancellationToken cancellationToken = default)
    {
        var (stream, fileName) = await this.Mediator.Send(new DownloadBookQuery(id), cancellationToken);

        return File(stream, "application/octet-stream", fileName);
    }

    [HttpPost("{id}/index")]
    public async Task<IActionResult> IndexAsync(BookId id, CancellationToken cancellationToken = default)
    {
        await this.Mediator.Send(new IndexBookCommand(id), cancellationToken);

        return NoContent();
    }
}
