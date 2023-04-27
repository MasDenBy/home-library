using MasDen.HomeLibrary.Infrastructure.Persistence;
using MediatR;

namespace MasDen.HomeLibrary.Libraries.Queries.GetLibraries;

public class GetLibrariesQueryHandler : IRequestHandler<GetLibrariesQuery, IReadOnlyCollection<LibraryDto>>
{
    private readonly ILibraryDataStore libraryDataStore;

    public GetLibrariesQueryHandler(ILibraryDataStore libraryDataStore)
    {
        this.libraryDataStore = libraryDataStore;
    }

    public async Task<IReadOnlyCollection<LibraryDto>> Handle(GetLibrariesQuery request, CancellationToken cancellationToken)
    {
        var entities = await this.libraryDataStore.GetAllAsync(cancellationToken);

        return new LibraryMapper().ToDto(entities);
    }
}
