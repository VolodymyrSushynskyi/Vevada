using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Vevada.Business.Orders.Commands;

namespace Vevada.Api.Controllers;

[Authorize(Roles ="Client")]
public class OrderController : BaseApiController
{
    public OrderController(IMediator mediator) : base(mediator)
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
}
