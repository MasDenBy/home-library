using MediatR;

namespace MasDen.HomeLibrary.Libraries.Commands.CreateLibrary;

public record CreateLibraryCommand(string Path) : IRequest<CreatedLibraryDto>
{
}
