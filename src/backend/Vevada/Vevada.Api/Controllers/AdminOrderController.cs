using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Vevada.Business.Orders.Commands;

namespace Vevada.Api.Controllers;

[Route("api/admin/orders")]
[Authorize(Roles = "ProductManager, Manufacturer")]
public class AdminOrderController : BaseApiController
{
    public AdminOrderController(IMediator mediator) : base(mediator)
    {
    }

    private int GetAdminId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    //[HttpGet("available")]
    //public async Task<IActionResult> GetAvailableOrders(CancellationToken cancellationToken)
    //{
    //    //var query = new GetAvailableOrdersQuery();
    //    //var result = await Mediator.Send(query, cancellationToken);

    //    //return HandleResult(result);
    //}

    [HttpPost("{orderId:int}/assign")]
    public async Task<IActionResult> AssignOrder([FromRoute] int orderId, CancellationToken cancellationToken)
    {
        var command = new AssignManufacturerOrderCommand(GetAdminId(), orderId);
        var result = await Mediator.Send(command, cancellationToken);

        return HandleResult(result);
    }
}
