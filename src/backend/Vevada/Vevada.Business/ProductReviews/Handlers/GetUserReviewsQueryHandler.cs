using MediatR;
using Microsoft.EntityFrameworkCore;
using Vevada.Business.Common;
using Vevada.Business.ProductReviews.DTOs;
using Vevada.Business.ProductReviews.Queries;
using Vevada.Data;

namespace Vevada.Business.ProductReviews.Handlers;

public class GetUserReviewsQueryHandler : IRequestHandler<GetUserReviewsQuery, HandlerResult<PagedResponse<UserReviewDto>>>
{
    private readonly VevadaDbContext _dbContext;

    public GetUserReviewsQueryHandler(VevadaDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<HandlerResult<PagedResponse<UserReviewDto>>> Handle(GetUserReviewsQuery request, CancellationToken cancellationToken)
    {
        var baseQuery = _dbContext.ProductReviews
            .AsNoTracking()
            .Where(pr => pr.UserId == request.UserId);

        var totalCount = await baseQuery.CountAsync(cancellationToken);

        var items = await baseQuery
            .OrderByDescending(pr => pr.CreatedAt)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(pr => new UserReviewDto(
                pr.Id,
                pr.ProductId,
                pr.Product.Name,
                pr.Product.MainImageId,
                pr.Rating,
                pr.Comment,
                pr.CreatedAt
            ))
            .ToListAsync(cancellationToken);

        var response = new PagedResponse<UserReviewDto>(
            items,
            totalCount,
            request.Page,
            request.PageSize
        );

        return HandlerResult<PagedResponse<UserReviewDto>>.Success(response);
    }
}
