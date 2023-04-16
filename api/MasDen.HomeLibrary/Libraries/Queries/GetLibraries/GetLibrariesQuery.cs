using MediatR;

namespace MasDen.HomeLibrary.Libraries.Queries.GetLibraries;

public record GetLibrariesQuery : IRequest<IReadOnlyCollection<LibraryDto>>
{
}
