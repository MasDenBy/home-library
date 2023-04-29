using MediatR;

namespace MasDen.HomeLibrary.Libraries.Commands.DeleteLibrary;

public record DeleteLibraryCommand(int Id) : IRequest
{
}
