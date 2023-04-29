using MasDen.HomeLibrary.Infrastructure.Persistence;
using MediatR;

namespace MasDen.HomeLibrary.Libraries.Commands.DeleteLibrary;
public class DeleteLibraryCommandHandler : IRequestHandler<DeleteLibraryCommand>
{
    private readonly ILibraryDataStore libraryDataStore;

    public DeleteLibraryCommandHandler(ILibraryDataStore libraryDataStore)
    {
        this.libraryDataStore = libraryDataStore;
    }

    public Task Handle(DeleteLibraryCommand request, CancellationToken cancellationToken) =>
        this.libraryDataStore.DeleteAsync(request.Id, cancellationToken);
}
