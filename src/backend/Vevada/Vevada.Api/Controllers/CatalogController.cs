using MediatR;
using Microsoft.AspNetCore.Mvc;
using Vevada.Business.Products.Queries;

namespace Vevada.Api.Controllers;

public class CatalogController : BaseApiController
{
    public CatalogController(IMediator mediator) : base(mediator)
    {
    }

    [HttpGet]
    public async Task<IActionResult> GetCatalog([FromQuery] int page, [FromQuery] int pageSize, CancellationToken cancellationToken = default)
    {
        page = page < 1 ? 1 : page;
        pageSize = pageSize > 10 ? 10 : pageSize;

        var query = new GetCatalogQuery(page, pageSize);
        var result = await Mediator.Send(query, cancellationToken);

        return HandleResult(result);
    }
}
