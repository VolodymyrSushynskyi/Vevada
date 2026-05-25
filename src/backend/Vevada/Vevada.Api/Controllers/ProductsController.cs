using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Vevada.Business.Products.Commands;

namespace Vevada.Api.Controllers;

[Route("api/admin/products")]
[Authorize(Roles = "ProductManager, SuperAdmin")]
public class ProductsController : BaseApiController
{
    public ProductsController(IMediator mediator) : base(mediator)
    {
    }

    [HttpPost]
    public async Task<IActionResult> CreateProduct([FromBody] CreateProductCommand command, CancellationToken cancellationToken)
    {
        var result = await Mediator.Send(command, cancellationToken);
        return HandleResult(result);
    }
}
