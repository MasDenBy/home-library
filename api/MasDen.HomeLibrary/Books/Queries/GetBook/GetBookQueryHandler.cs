using MasDen.HomeLibrary.Domain;
using MasDen.HomeLibrary.Infrastructure.Exceptions;
using MasDen.HomeLibrary.Infrastructure.Persistence;
using MasDen.HomeLibrary.Infrastructure.Services;
using MediatR;

namespace MasDen.HomeLibrary.Books.Queries.GetBook;
public class GetBookQueryHandler : IRequestHandler<GetBookQuery, BookDto>
{
    private readonly IUnitOfWork unitOfWork;
    private readonly IImageService imageService;

    public GetBookQueryHandler(IUnitOfWork unitOfWork, IImageService imageService)
    {
        this.unitOfWork = unitOfWork;
        this.imageService = imageService;
    }

    public async Task<BookDto> Handle(GetBookQuery request, CancellationToken cancellationToken)
    {
        var entity = await this.unitOfWork.Book.GetBookAsync(request.BookId)
            ?? throw new NotFoundException(typeof(Book), request.BookId.Value);

        var dto = new BookMapper().ToDto(entity);

        if (!string.IsNullOrWhiteSpace(entity.ImageName))
        {
            dto = dto with
            {
                Image = await this.imageService.GetImageContentAsync(entity.LibraryId, entity.ImageName)
            };
        }

        return dto;
    }
}
