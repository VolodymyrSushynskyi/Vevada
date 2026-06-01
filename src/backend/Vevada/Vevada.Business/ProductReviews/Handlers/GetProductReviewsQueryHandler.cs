using MediatR;
using Microsoft.EntityFrameworkCore;
using Vevada.Business.Common;
using Vevada.Business.ProductReviews.DTOs;
using Vevada.Business.ProductReviews.Queries;
using Vevada.Data;

namespace Vevada.Business.ProductReviews.Handlers;

public class GetProductReviewsQueryHandler : IRequestHandler<GetProductReviewsQuery, HandlerResult<PagedResponse<ProductReviewDto>>>
{
    private readonly VevadaDbContext _dbContext;

    public GetProductReviewsQueryHandler(VevadaDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<HandlerResult<PagedResponse<ProductReviewDto>>> Handle(GetProductReviewsQuery request, CancellationToken cancellationToken)
    {
        var validReviewsQuery = _dbContext.ProductReviews.AsNoTracking()
            .Where(pr => pr.ProductId == request.ProductId)
            .Join(
                _dbContext.ClientDetails.AsNoTracking(),
                review => review.UserId,
                client => client.UserId,
                (review, client) => new { review, client }
            );

        var totalCount = await validReviewsQuery.CountAsync(cancellationToken);

        var items = await validReviewsQuery
            .OrderByDescending(x => x.review.CreatedAt)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(x => new ProductReviewDto(
                x.review.Id,
                x.review.UserId,
                x.client.FirstName + " " + x.client.LastName,
                x.review.Rating,
                x.review.Comment,
                x.review.CreatedAt
            ))
            .ToListAsync(cancellationToken);

        var response = new PagedResponse<ProductReviewDto>(
            items,
            totalCount,
            request.Page,
            request.PageSize
        );

        return HandlerResult<PagedResponse<ProductReviewDto>>.Success(response);
    }
}
