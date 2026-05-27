using MediatR;
using Microsoft.EntityFrameworkCore;
using Vevada.Business.Common;
using Vevada.Business.Products.DTOs;
using Vevada.Business.Products.Queries;
using Vevada.Data;
using Vevada.Data.Constants;

namespace Vevada.Business.Products.Handlers;

public class GetAdminProductsQueryHandler : IRequestHandler<GetAdminProductsQuery, HandlerResult<AdminProductListResponse>>
{
    private readonly VevadaDbContext _dbContext;

    public GetAdminProductsQueryHandler(VevadaDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<HandlerResult<AdminProductListResponse>> Handle(GetAdminProductsQuery request, CancellationToken cancellationToken)
    {
        var baseQuery = _dbContext.Products.AsNoTracking();

        var statusCounts = await baseQuery
            .GroupBy(p => p.Status)
            .Select(g => new { Status = g.Key, Count = g.Count() })
            .ToListAsync(cancellationToken);

        var publishedCount = statusCounts.FirstOrDefault(x => x.Status == ProductStatus.Published)?.Count ?? 0;
        var draftsCount = statusCounts.FirstOrDefault(x => x.Status == ProductStatus.Draft)?.Count ?? 0;
        var totalCount = statusCounts.Sum(x => x.Count);

        var tabCounts = new List<TabCountDto>
        {
            new TabCountDto("Total", totalCount),
            new TabCountDto("Published", publishedCount),
            new TabCountDto("Drafts", draftsCount)
        };

        var filteredQuery = baseQuery;
        if (request.Status.HasValue)
        {
            filteredQuery = filteredQuery.Where(p => p.Status == request.Status.Value);
        }

        var pagedTotalCount = await filteredQuery.CountAsync(cancellationToken);

        var products = await filteredQuery
            .OrderByDescending(p => p.CreatedAt)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(p => new AdminProductListItemDto(
                p.Id,
                p.MainImageId,
                p.Name,
                p.Status,
                p.UpdatedAt ?? p.CreatedAt
            ))
            .ToListAsync(cancellationToken);

        var pagedResponse = new PagedResponse<AdminProductListItemDto>(products, pagedTotalCount, request.Page, request.PageSize);
        var finalResponse = new AdminProductListResponse(tabCounts, pagedResponse);

        return HandlerResult<AdminProductListResponse>.Success(finalResponse);
    }
}
