using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Vevada.Business.Orders.Commands;
using Vevada.Business.Orders.DTOs;
using Vevada.Business.Orders.Queries;

namespace Vevada.Api.Controllers;

[Route("api/admin/orders")]
[Authorize(Roles = "ProductManager, Manufacturer")]
public class AdminOrderController : BaseApiController
{
    public AdminOrderController(IMediator mediator) : base(mediator)
    {
    }

    private int GetAdminId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpPost("{orderId:int}/assign")]
    public async Task<IActionResult> AssignOrder([FromRoute] int orderId, CancellationToken cancellationToken)
    {
        var command = new AssignManufacturerOrderCommand(GetAdminId(), orderId);
        var result = await Mediator.Send(command, cancellationToken);

        return HandleResult(result);
    }

    [HttpPut("{orderId:int}/status")]
    public async Task<IActionResult> UpdateOrderStatus(
        [FromRoute] int orderId,
        [FromBody] UpdateManufacturerOrderStatusRequest request,
        CancellationToken cancellationToken)
    {
        var command = new UpdateManufacturerOrderStatusCommand(GetAdminId(), orderId, request.NewStatus);
        var result = await Mediator.Send(command, cancellationToken);

        return HandleResult(result);
    }

    [HttpGet("available")]
    public async Task<IActionResult> GetAvailableOrders(CancellationToken cancellationToken)
    {
        var query = new GetAvailableManufacturerOrdersQuery();
        var result = await Mediator.Send(query, cancellationToken);

        return HandleResult(result);
    }

    [HttpGet("active")]
    public async Task<IActionResult> GetActiveOrders(CancellationToken cancellationToken)
    {
        var query = new GetManufacturerActiveOrdersQuery(GetAdminId());
        var result = await Mediator.Send(query, cancellationToken);

        return HandleResult(result);
    }

    [HttpGet("finished")]
    public async Task<IActionResult> GetFinishedOrders(CancellationToken cancellationToken)
    {
        var query = new GetFinishedManufacturerOrdersQuery(GetAdminId());
        var result = await Mediator.Send(query, cancellationToken);

        return HandleResult(result);
    }
}
