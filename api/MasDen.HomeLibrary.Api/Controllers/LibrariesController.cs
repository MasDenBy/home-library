using MasDen.HomeLibrary.Domain.StronglyTypedIds;
using MasDen.HomeLibrary.Libraries.Commands.CreateLibrary;
using MasDen.HomeLibrary.Libraries.Commands.DeleteLibrary;
using MasDen.HomeLibrary.Libraries.Queries.GetLibraries;
using Microsoft.AspNetCore.Mvc;

namespace MasDen.HomeLibrary.Api.Controllers;

public class LibrariesController : ApiControllerBase
{
    [HttpGet]
    public Task<IReadOnlyCollection<LibraryDto>> Get(CancellationToken cancellationToken) =>
        this.Mediator.Send(new GetLibrariesQuery(), cancellationToken);

    [HttpPost]
    public async Task<IActionResult> Post(string path, CancellationToken cancellationToken)
    {
        var dto = await this.Mediator.Send(new CreateLibraryCommand(path), cancellationToken);

        return Created($"/api/libraries/{dto.Id}", dto);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(LibraryId id, CancellationToken cancellationToken)
    {
        await this.Mediator.Send(new DeleteLibraryCommand(id), cancellationToken);

        return NoContent();
    }
}
