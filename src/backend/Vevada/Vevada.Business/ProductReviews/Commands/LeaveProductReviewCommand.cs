using MediatR;
using Vevada.Business.Common;

namespace Vevada.Business.ProductReviews.Commands;

public record LeaveProductReviewCommand(
    Guid ProductId,
    int UserId,
    int Rating,
    string? Comment
) : IRequest<HandlerResult<int>>;
