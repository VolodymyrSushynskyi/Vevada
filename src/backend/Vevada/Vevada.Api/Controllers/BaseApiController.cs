using MediatR;
using Microsoft.AspNetCore.Mvc;
using Vevada.Business.Common;

namespace Vevada.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BaseApiController : ControllerBase
{
    private readonly IMediator _mediator;

    protected IMediator Mediator => _mediator;

    public BaseApiController(IMediator mediator)
    {
        _mediator = mediator;
    }

    protected ActionResult HandleResult<T>(HandlerResult<T> result)
    {
        if (result == null) return NotFound();

        if (result.IsSuccess)
        {
            return Ok(result.Value);
        }

        return BadRequest(new { error = result.Error });
    }
}
