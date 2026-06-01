using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Vevada.Business.Orders.Commands;
using Vevada.Business.Orders.Queries;

namespace Vevada.Api.Controllers;

[Authorize(Roles = "Client")]
public class OrdersController : BaseApiController
{
    public OrdersController(IMediator mediator) : base(mediator)
    {
    }

    private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpPost("checkout")]
    public async Task<IActionResult> PlaceOrder(CancellationToken cancellationToken)
    {
        var command = new PlaceOrderCommand(GetUserId());
        var result = await Mediator.Send(command, cancellationToken);

        return HandleResult(result);
    }

    [HttpGet("active")]
    public async Task<IActionResult> GetActiveOrders(CancellationToken cancellationToken)
    {
        var query = new GetActiveOrdersQuery(GetUserId());
        var result = await Mediator.Send(query, cancellationToken);
        return HandleResult(result);
    }

    [HttpGet("history")]
    public async Task<IActionResult> GetOrderHistory(CancellationToken cancellationToken)
    {
        var query = new GetOrderHistoryQuery(GetUserId());
        var result = await Mediator.Send(query, cancellationToken);
        return HandleResult(result);
    }

    [HttpPost("{orderId:int}/request-cancellation")]
    public async Task<IActionResult> RequestCancellation([FromRoute] int orderId, CancellationToken cancellationToken)
    {
        var command = new RequestOrderCancellationCommand(GetUserId(), orderId);
        var result = await Mediator.Send(command, cancellationToken);

        return HandleResult(result);
    }
}
