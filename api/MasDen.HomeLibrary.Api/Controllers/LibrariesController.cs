using MasDen.HomeLibrary.Libraries.Queries.GetLibraries;
using Microsoft.AspNetCore.Mvc;

namespace MasDen.HomeLibrary.Api.Controllers;

[ApiController]
public class LibrariesController : ApiControllerBase
{
    [HttpGet]
    public Task<IReadOnlyCollection<LibraryDto>> Get(CancellationToken cancellationToken) =>
        this.Mediator.Send(new GetLibrariesQuery(), cancellationToken);
}
