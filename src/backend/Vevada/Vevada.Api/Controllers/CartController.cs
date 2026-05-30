using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Vevada.Business.Carts.Commands;
using Vevada.Business.Carts.DTOs;

namespace Vevada.Api.Controllers;

public class CartController : BaseApiController
{
    public CartController(IMediator mediator) : base(mediator)
    {
    }

    private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpPost("items")]
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

    [HttpPut("items/{cartItemId:int}")]
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
}
