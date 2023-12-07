using MasDen.HomeLibrary.Domain.Entities;
using MasDen.HomeLibrary.Infrastructure.Exceptions;
using MasDen.HomeLibrary.Infrastructure.Persistence;
using MediatR;

namespace MasDen.HomeLibrary.Books.Commands.DeleteBook;

public class DeleteBookCommandHandler : IRequestHandler<DeleteBookCommand>
{
    private readonly IUnitOfWork unitOfWork;

    public DeleteBookCommandHandler(IUnitOfWork unitOfWork)
    {
        this.unitOfWork = unitOfWork;
    }

    public async Task Handle(DeleteBookCommand request, CancellationToken cancellationToken)
    {
        var entity = await unitOfWork.Book.GetBookAsync(request.Id, cancellationToken)
            ?? throw new NotFoundException(typeof(Book), request.Id.Value);

        try
        {
            unitOfWork.BeginTransaction();

            await unitOfWork.BookFile.DeleteAsync(entity.File.Id, cancellationToken);

            if (entity.Metadata != null)
            {
                await unitOfWork.Metadata.DeleteAsync(entity.Metadata.Id, cancellationToken);
            }

            await unitOfWork.Book.DeleteAsync(entity.Id, cancellationToken);

            unitOfWork.CommitTransaction();
        }
        catch
        {
            unitOfWork.RollbackTransaction();

            throw;
        }
    }
}
