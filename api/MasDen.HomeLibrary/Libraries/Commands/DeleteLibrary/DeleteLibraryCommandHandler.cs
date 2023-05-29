using MasDen.HomeLibrary.Infrastructure.Persistence;
using MediatR;

namespace MasDen.HomeLibrary.Libraries.Commands.DeleteLibrary;
public class DeleteLibraryCommandHandler : IRequestHandler<DeleteLibraryCommand>
{
    private readonly IUnitOfWork unitOfWork;

    public DeleteLibraryCommandHandler(IUnitOfWork unitOfWork)
    {
        this.unitOfWork = unitOfWork;
    }

    public Task Handle(DeleteLibraryCommand request, CancellationToken cancellationToken) =>
        this.unitOfWork.Library.DeleteAsync(request.Id, cancellationToken);
}
