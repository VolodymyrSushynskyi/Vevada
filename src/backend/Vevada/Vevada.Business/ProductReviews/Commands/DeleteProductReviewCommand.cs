using MediatR;
using Vevada.Business.Common;

namespace Vevada.Business.ProductReviews.Commands;

public record DeleteProductReviewCommand(
    Guid ProductId,
    int UserId
) : IRequest<HandlerResult<bool>>;
