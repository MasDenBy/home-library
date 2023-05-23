using MasDen.HomeLibrary.Common.Models;
using MasDen.HomeLibrary.Infrastructure.Persistence;
using MediatR;

namespace MasDen.HomeLibrary.Books.Queries.GetBooks;
public class GetBooksQueryHandler : IRequestHandler<GetBooksQuery, PagingCollection<BookPageItemDto>>
{
    private readonly IBookDataStore bookDataStore;

    public GetBooksQueryHandler(IBookDataStore bookDataStore)
    {
        this.bookDataStore = bookDataStore;
    }

    public async Task<PagingCollection<BookPageItemDto>> Handle(GetBooksQuery request, CancellationToken cancellationToken)
    {
        var (entitites, total) = await this.bookDataStore.GetBooksAsync(request.Offset, request.Count, cancellationToken);

        return new PagingCollection<BookPageItemDto>(
            items: new GetBooksMapper().ToDto(entitites).ToList(),
            total: total);
    }
}
