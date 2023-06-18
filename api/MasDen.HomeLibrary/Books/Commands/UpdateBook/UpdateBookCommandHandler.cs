using MasDen.HomeLibrary.Domain.Entities;
using MasDen.HomeLibrary.Domain.StronglyTypedIds;
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

            if (request.Metadata != null)
            {
                var metadata = new Metadata
                {
                    Id = entity.Metadata != null ? entity.Metadata.Id : MetadataId.Empty,
                    Isbn = request.Metadata.Isbn,
                    Pages = request.Metadata.Pages,
                    Year = request.Metadata.Year,
                    BookId = entity.Id
                };

                if (metadata.Id == MetadataId.Empty)
                {
                    var metadataId = await this.unitOfWork.Metadata.CreateAsync(metadata);

                    metadata = metadata with
                    {
                        Id = metadataId
                    };
                }
                else
                {
                    await this.unitOfWork.Metadata.UpdateAsync(metadata, cancellationToken);
                }

                entity.SetMetadata(metadata);
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
