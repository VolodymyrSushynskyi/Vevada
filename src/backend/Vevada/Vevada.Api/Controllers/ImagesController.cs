using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Vevada.Business.ImageProcessing.Commands;

namespace Vevada.Api.Controllers;

[Route("api/admin/images")]
[Authorize(Roles = "ProductManager, SuperAdmin")]
public class ImagesController : BaseApiController
{
    public ImagesController(IMediator mediator) : base(mediator)
    {
    }

    [HttpPost]
    [RequestSizeLimit(10_485_760)]
    [RequestFormLimits(MultipartBodyLengthLimit = 10_485_760)]
    [EnableRateLimiting("ImageUploadLimit")]
    public async Task<IActionResult> UploadImage(IFormFile file, CancellationToken cancellationToken)
    {
        var command = new UploadImageCommand(file);
        var result = await Mediator.Send(command, cancellationToken);
        return HandleResult(result);
    }
}
