using MediatR;
using Microsoft.EntityFrameworkCore;
using Vevada.Business.Common;
using Vevada.Business.Products.DTOs;
using Vevada.Business.Products.Queries;
using Vevada.Data;
using Vevada.Data.Constants;

namespace Vevada.Business.Products.Handlers;

public class GetCatalogQueryHandler : IRequestHandler<GetCatalogQuery, HandlerResult<PagedResponse<CatalogProductDto>>>
{
    private readonly VevadaDbContext _dbContext;

    public GetCatalogQueryHandler(VevadaDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<HandlerResult<PagedResponse<CatalogProductDto>>> Handle(GetCatalogQuery request, CancellationToken cancellationToken)
    {
        var baseQuery = _dbContext.Products
            .AsNoTracking()
            .Where(p => p.Status == ProductStatus.Published);

        var totalCount = await baseQuery.CountAsync(cancellationToken);

        var products = await baseQuery
            .OrderByDescending(p => p.CreatedAt)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(p => new CatalogProductDto(
                p.Id,
                p.ProductSeriesId,
                p.Name,
                p.Price,
                p.MainImageId
            ))
            .ToListAsync(cancellationToken);

        var pagedResponse = new PagedResponse<CatalogProductDto>(products, totalCount, request.Page, request.PageSize);

        return HandlerResult<PagedResponse<CatalogProductDto>>.Success(pagedResponse);
    }
}
