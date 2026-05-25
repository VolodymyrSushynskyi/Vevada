using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Vevada.Business.Products.Commands;
using Vevada.Business.Products.Queries;
using Vevada.Data.Constants;

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

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteProduct(Guid id, CancellationToken cancellationToken)
    {
        var command = new DeleteProductCommand(id);
        var result = await Mediator.Send(command, cancellationToken);
        return HandleResult(result);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateProduct(Guid id, [FromBody] UpdateProductCommand command, CancellationToken cancellationToken)
    {
        if (id != command.Id)
        {
            return BadRequest(new { error = "Route ID does not match Command ID." });
        }

        var result = await Mediator.Send(command, cancellationToken);
        return HandleResult(result);
    }

    [HttpGet]
    public async Task<IActionResult> GetProducts(
        [FromQuery] int page,
        [FromQuery] int pageSize,
        [FromQuery] ProductStatus? status = null,
        CancellationToken cancellationToken = default)
    {
        page = page < 1 ? 1 : page;
        pageSize = pageSize > 50 ? 50 : pageSize;

        var query = new GetAdminProductsQuery(page, pageSize, status);
        var result = await Mediator.Send(query, cancellationToken);

        return HandleResult(result);
    }
}
