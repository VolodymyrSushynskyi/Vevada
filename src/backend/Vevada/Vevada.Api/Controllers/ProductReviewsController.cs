using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Vevada.Business.Common;
using Vevada.Business.ProductReviews.Commands;
using Vevada.Business.ProductReviews.DTOs;
using Vevada.Business.ProductReviews.Queries;

namespace Vevada.Api.Controllers;

[Route("api/products/{productId:guid}/reviews")]
public class ProductReviewsController : BaseApiController
{
    public ProductReviewsController(IMediator mediator) : base(mediator)
    {
    }

    [HttpPut]
    [Authorize(Roles = "Client")]
    public async Task<IActionResult> LeaveReview(Guid productId, [FromBody] LeaveReviewDto payload, CancellationToken cancellationToken)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new { error = "Invalid user." });
        }

        var command = new LeaveProductReviewCommand(
            productId,
            userId,
            payload.Rating,
            payload.Comment
        );

        var result = await Mediator.Send(command, cancellationToken);

        return HandleResult(result);
    }

    [HttpGet]
    public async Task<IActionResult> GetReviews(
        Guid productId,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = PagedResponse<object>.DefaultPageSize,
        CancellationToken cancellationToken = default)
    {
        page = page < 1 ? 1 : page;
        pageSize = pageSize < 1 ? 1 : pageSize > PagedResponse<object>.MaxPageSize ? PagedResponse<object>.MaxPageSize : pageSize;

        var query = new GetProductReviewsQuery(productId, page, pageSize);
        var result = await Mediator.Send(query, cancellationToken);

        return HandleResult(result);
    }
}
