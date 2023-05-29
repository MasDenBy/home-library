using MasDen.HomeLibrary.Infrastructure.Persistence;
using MediatR;

namespace MasDen.HomeLibrary.Libraries.Queries.GetLibraries;

public class GetLibrariesQueryHandler : IRequestHandler<GetLibrariesQuery, IReadOnlyCollection<LibraryDto>>
{
    private readonly IUnitOfWork unitOfWork;

    public GetLibrariesQueryHandler(IUnitOfWork unitOfWork)
    {
        this.unitOfWork = unitOfWork;
    }

    public async Task<IReadOnlyCollection<LibraryDto>> Handle(GetLibrariesQuery request, CancellationToken cancellationToken)
    {
        var entities = await this.unitOfWork.Library.GetAllAsync(cancellationToken);

        return new LibraryMapper().ToDto(entities);
    }
}
