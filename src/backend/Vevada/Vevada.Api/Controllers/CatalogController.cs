using MediatR;

namespace Vevada.Api.Controllers;

public class CatalogController : BaseApiController
{
    public CatalogController(IMediator mediator) : base(mediator)
    {
    }
}
