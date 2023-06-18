using MasDen.HomeLibrary.Domain.Entities;
using MasDen.HomeLibrary.Infrastructure.Exceptions;
using MasDen.HomeLibrary.Infrastructure.Persistence;
using MediatR;

namespace MasDen.HomeLibrary.Books.DeleteBook;

public class DeleteBookCommandHandler : IRequestHandler<DeleteBookCommand>
{
    private readonly IUnitOfWork unitOfWork;

    public DeleteBookCommandHandler(IUnitOfWork unitOfWork)
    {
        this.unitOfWork = unitOfWork;
    }

    public async Task Handle(DeleteBookCommand request, CancellationToken cancellationToken)
    {
        var entity = await this.unitOfWork.Book.GetBookAsync(request.Id, cancellationToken)
            ?? throw new NotFoundException(typeof(Book), request.Id.Value);

        try
        {
            this.unitOfWork.BeginTransaction();

            await this.unitOfWork.BookFile.DeleteAsync(entity.File.Id, cancellationToken);

            if (entity.Metadata != null)
            {
                await this.unitOfWork.Metadata.DeleteAsync(entity.Metadata.Id, cancellationToken);
            }

            await this.unitOfWork.Book.DeleteAsync(entity.Id, cancellationToken);

            this.unitOfWork.CommitTransaction();
        }
        catch
        {
            this.unitOfWork.RollbackTransaction();

            throw;
        }
    }
}
