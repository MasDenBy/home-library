using MasDen.HomeLibrary.Domain;
using MasDen.HomeLibrary.Infrastructure.Exceptions;
using MasDen.HomeLibrary.Infrastructure.Persistence;
using MediatR;

namespace MasDen.HomeLibrary.Books.Commands.UpdateBook;
public class UpdateBookCommandHandler : IRequestHandler<UpdateBookCommand>
{
    private readonly IUnitOfWork unitOfWork;

    public UpdateBookCommandHandler(IUnitOfWork unitOfWork)
    {
        this.unitOfWork = unitOfWork;
    }

    public async Task Handle(UpdateBookCommand request, CancellationToken cancellationToken)
    {
        var entity = await this.unitOfWork.Book.GetBookAsync(request.Id) ?? throw new NotFoundException(typeof(Book), request.Id.Value);
        entity.Update(request.Title, request.Description, request.Authors);

        try
        {
            this.unitOfWork.BeginTransaction();

            if (request.Edition != null)
            {
                var edition = new Edition
                {
                    Id = request.Edition.Id,
                    Isbn = request.Edition.Isbn,
                    Pages = request.Edition.Pages,
                    Year = request.Edition.Year,
                    BookId = entity.Id,
                    Title = request.Title
                };

                await this.unitOfWork.Edition.UpdateAsync(edition, cancellationToken);
            }

            await this.unitOfWork.Book.UpdateAsync(entity, cancellationToken);
            this.unitOfWork.CommitTransaction();
        }
        catch (Exception)
        {
            this.unitOfWork.RollbackTransaction();

            throw;
        }
    }
}
