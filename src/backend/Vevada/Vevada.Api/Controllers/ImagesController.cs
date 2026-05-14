using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Vevada.Business.ImageProcessing.Commands;

namespace Vevada.Api.Controllers;

// [Authorize]
public class ImagesController : BaseApiController
{
    public ImagesController(IMediator mediator) : base(mediator)
    {
    }

    [HttpPost]
    public async Task<IActionResult> UploadImage(IFormFile file)
    {
        var command = new UploadImageCommand(file);
        var result = await Mediator.Send(command);

        if (result.IsSuccess)
        {
            return Ok(new { ImageId = result.Value });
        }

        return BadRequest(new { Error = result.Error });
    }
}
