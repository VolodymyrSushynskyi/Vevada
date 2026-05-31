using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Vevada.Business.Carts.Commands;
using Vevada.Business.Carts.DTOs;
using Vevada.Business.Carts.Queries;

namespace Vevada.Api.Controllers;

[Authorize(Roles = "Client")]
public class CartController : BaseApiController
{
    public CartController(IMediator mediator) : base(mediator)
    {
    }

    private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpPost]
    public async Task<IActionResult> AddItem([FromBody] AddCartItemDto request, CancellationToken cancellationToken)
    {
        var command = new AddCartItemCommand(
            GetUserId(),
            request.ProductId,
            request.Size,
            request.Quantity);

        var result = await Mediator.Send(command, cancellationToken);

        return HandleResult(result);
    }

    [HttpPut("{cartItemId:int}")]
    public async Task<IActionResult> UpdateItemQuantity(
        [FromRoute] int cartItemId,
        [FromBody] UpdateCartItemQuantityDto request,
        CancellationToken cancellationToken)
    {
        var command = new UpdateCartItemQuantityCommand(
            GetUserId(),
            cartItemId,
            request.Quantity);

        var result = await Mediator.Send(command, cancellationToken);

        return HandleResult(result);
    }

    [HttpDelete("{cartItemId:int}")]
    public async Task<IActionResult> RemoveItem([FromRoute] int cartItemId, CancellationToken cancellationToken)
    {
        var command = new RemoveCartItemCommand(GetUserId(), cartItemId);
        var result = await Mediator.Send(command, cancellationToken);

        return HandleResult(result);
    }

    [HttpGet]
    public async Task<IActionResult> GetCart(CancellationToken cancellationToken)
    {
        var query = new GetCartQuery(GetUserId());
        var result = await Mediator.Send(query, cancellationToken);

        return HandleResult(result);
    }
}
