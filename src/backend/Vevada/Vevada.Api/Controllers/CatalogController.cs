using MediatR;
using Microsoft.AspNetCore.Mvc;
using Vevada.Business.Common;
using Vevada.Business.Products.Queries;

namespace Vevada.Api.Controllers;

public class CatalogController : BaseApiController
{
    public CatalogController(IMediator mediator) : base(mediator)
    {
    }

    [HttpGet]
    public async Task<IActionResult> GetCatalog([FromQuery] int page = 1, [FromQuery] int pageSize = PagedResponse<object>.DefaultPageSize, CancellationToken cancellationToken = default)
    {
        page = page < 1 ? 1 : page;
        pageSize = pageSize < 1 ? 1 : pageSize > PagedResponse<object>.MaxPageSize ? PagedResponse<object>.MaxPageSize : pageSize;

        var query = new GetCatalogQuery(page, pageSize);
        var result = await Mediator.Send(query, cancellationToken);

        return HandleResult(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetProductById(Guid id, CancellationToken cancellationToken)
    {
        var query = new GetProductDetailsQuery(id);
        var result = await Mediator.Send(query, cancellationToken);

        return HandleResult(result);
    }
}
