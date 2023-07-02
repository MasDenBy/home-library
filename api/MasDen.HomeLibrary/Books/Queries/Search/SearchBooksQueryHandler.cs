using MasDen.HomeLibrary.Common.Models;
using MasDen.HomeLibrary.Infrastructure.Persistence;
using MediatR;

namespace MasDen.HomeLibrary.Books.Queries.Search;
public class SearchBooksQueryHandler : IRequestHandler<SearchBooksQuery, PagingCollection<SearchBookPageItemDto>>
{
    private readonly IUnitOfWork unitOfWork;

    public SearchBooksQueryHandler(IUnitOfWork unitOfWork)
    {
        this.unitOfWork = unitOfWork;
    }

    public async Task<PagingCollection<SearchBookPageItemDto>> Handle(SearchBooksQuery request, CancellationToken cancellationToken)
    {
        var (entitites, total) = await this.unitOfWork.Book.SearchBooksAsync(request.Pattern, request.Offset, request.Count, cancellationToken);

        return new PagingCollection<SearchBookPageItemDto>(
            items: new SearchBooksMapper().ToDto(entitites).ToList(),
            total: total);
    }
}
