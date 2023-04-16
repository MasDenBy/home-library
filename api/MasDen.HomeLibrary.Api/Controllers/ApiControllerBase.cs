using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace MasDen.HomeLibrary.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public abstract class ApiControllerBase : ControllerBase
{
    private ISender? mediator;

    protected ISender Mediator => this.mediator ??= HttpContext.RequestServices.GetRequiredService<ISender>();
}