using MasDen.HomeLibrary.Infrastructure.Exceptions;
using MasDen.HomeLibrary.Infrastructure.Persistence;
using MediatR;

namespace MasDen.HomeLibrary.Books.Queries.DownloadBook;
public class DownloadBookHandler : IRequestHandler<DownloadBookQuery, (Stream, string)>
{
    private readonly IUnitOfWork unitOfWork;

    public DownloadBookHandler(IUnitOfWork unitOfWork)
    {
        this.unitOfWork = unitOfWork;
    }

    public async Task<(Stream, string)> Handle(DownloadBookQuery request, CancellationToken cancellationToken)
    {
        var edition = await this.unitOfWork.Edition.GetAsync(request.EditionId, request.BookId, cancellationToken)
            ?? throw new NotFoundException($"The file for book edition with identifier {request.EditionId} does not found.");

        if (!File.Exists(edition.FilePath))
        {
            throw new NotFoundException($"The file for book edition with identifier {request.EditionId} does not found.");
        }

        return (File.OpenRead(edition.FilePath), Path.GetFileName(edition.FilePath));
    }
}
