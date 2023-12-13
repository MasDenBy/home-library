using MasDen.HomeLibrary.Domain;
using MasDen.HomeLibrary.Infrastructure.Persistence;
using MediatR;

namespace MasDen.HomeLibrary.Libraries.Commands.CreateLibrary;
public class CreateLibraryCommandHandler : IRequestHandler<CreateLibraryCommand, CreatedLibraryDto>
{
    private readonly IUnitOfWork unitOfWork;

    public CreateLibraryCommandHandler(IUnitOfWork unitOfWork)
    {
        this.unitOfWork = unitOfWork;
    }

    public async Task<CreatedLibraryDto> Handle(CreateLibraryCommand request, CancellationToken cancellationToken)
    {
        var id = await this.unitOfWork.Library.CreateAsync(request.Path);

		Library library = new(id, request.Path);

		return new LibraryMapper().ToDto(library);
    }
}
