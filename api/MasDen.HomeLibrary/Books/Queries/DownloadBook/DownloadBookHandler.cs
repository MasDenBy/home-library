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
        var file = await this.unitOfWork.BookFile.GetByBookIdAsync(request.Id, cancellationToken)
            ?? throw new NotFoundException($"The file for book with identifier {request.Id} does not found.");

        if (!File.Exists(file.Path))
        {
            throw new NotFoundException($"The file for book with identifier {request.Id} does not found.");
        }

        return (File.OpenRead(file.Path), Path.GetFileName(file.Path));
    }
}
