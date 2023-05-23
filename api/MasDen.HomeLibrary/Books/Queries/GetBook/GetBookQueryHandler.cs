using MasDen.HomeLibrary.Infrastructure.Persistence;
using MasDen.HomeLibrary.Infrastructure.Services;
using MediatR;

namespace MasDen.HomeLibrary.Books.Queries.GetBook;
public class GetBookQueryHandler : IRequestHandler<GetBookQuery, BookDto>
{
    private readonly IBookDataStore bookDataStore;
    private readonly IImageService imageService;

    public GetBookQueryHandler(IBookDataStore bookDataStore, IImageService imageService)
    {
        this.bookDataStore = bookDataStore;
        this.imageService = imageService;
    }

    public async Task<BookDto> Handle(GetBookQuery request, CancellationToken cancellationToken)
    {
        var entity = await this.bookDataStore.GetBookAsync(request.BookId);
        var dto = new BookMapper().ToDto(entity);

        if (!string.IsNullOrWhiteSpace(entity.File.ImageName))
        {
            dto.File.Image = await this.imageService.GetImageContentAsync(entity.LibraryId, entity.File.ImageName);
        }

        return dto;
    }
}
