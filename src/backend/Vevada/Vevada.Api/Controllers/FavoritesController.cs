using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Vevada.Business.Favorites.Commands;
using Vevada.Business.Favorites.Queries;

namespace Vevada.Api.Controllers;

[Authorize(Roles = "Client")]
public class FavoritesController : BaseApiController
{
    public FavoritesController(IMediator mediator) : base(mediator)
    {
    }

    private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpPost("toggle/{productId:guid}")]
    public async Task<IActionResult> ToggleFavorite([FromRoute] Guid productId, CancellationToken cancellationToken)
    {
        var command = new ToggleFavoriteCommand(GetUserId(), productId);
        var result = await Mediator.Send(command, cancellationToken);

        return HandleResult(result);
    }

    [HttpGet]
    public async Task<IActionResult> GetMyFavorites(CancellationToken cancellationToken)
    {
        var query = new GetFavoritesQuery(GetUserId());
        var result = await Mediator.Send(query, cancellationToken);

        return HandleResult(result);
    }
}
