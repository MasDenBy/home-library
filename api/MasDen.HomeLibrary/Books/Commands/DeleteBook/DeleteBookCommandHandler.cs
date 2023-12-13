using MasDen.HomeLibrary.Domain;
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

            if (entity.Editions != null)
            {
                foreach (var edition in entity.Editions)
                {
					await unitOfWork.Edition.DeleteAsync(edition.Id, cancellationToken);
				}
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
