using MediatR;
using Vevada.Business.Common;
using Vevada.Business.ProductReviews.DTOs;

namespace Vevada.Business.ProductReviews.Queries;

public record GetProductReviewsQuery(
    Guid ProductId,
    int Page = 1,
    int PageSize = PagedResponse<object>.DefaultPageSize
) : IRequest<HandlerResult<PagedResponse<ProductReviewDto>>>;
