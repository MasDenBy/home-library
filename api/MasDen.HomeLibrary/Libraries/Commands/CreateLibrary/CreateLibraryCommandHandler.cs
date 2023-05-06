using MasDen.HomeLibrary.Domain.Entities;
using MasDen.HomeLibrary.Infrastructure.Persistence;
using MediatR;

namespace MasDen.HomeLibrary.Libraries.Commands.CreateLibrary;
public class CreateLibraryCommandHandler : IRequestHandler<CreateLibraryCommand, CreatedLibraryDto>
{
    private readonly ILibraryDataStore libraryDataStore;

    public CreateLibraryCommandHandler(ILibraryDataStore libraryDataStore)
    {
        this.libraryDataStore = libraryDataStore;
    }

    public async Task<CreatedLibraryDto> Handle(CreateLibraryCommand request, CancellationToken cancellationToken)
    {
        Library library = new(request.Path);

        var id = await this.libraryDataStore.CreateAsync(library);

        library.SetId(id);

        return new LibraryMapper().ToDto(library);
    }
}
