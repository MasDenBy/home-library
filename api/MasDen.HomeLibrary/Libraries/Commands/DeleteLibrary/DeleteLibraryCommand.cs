using MasDen.HomeLibrary.Domain.StronglyTypedIds;
using MediatR;

namespace MasDen.HomeLibrary.Libraries.Commands.DeleteLibrary;

public record DeleteLibraryCommand(LibraryId Id) : IRequest
{
}
