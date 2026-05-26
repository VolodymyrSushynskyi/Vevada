using MediatR;
using Microsoft.EntityFrameworkCore;
using Vevada.Business.Common;
using Vevada.Business.Products.DTOs;
using Vevada.Business.Products.Queries;
using Vevada.Data;

namespace Vevada.Business.Products.Handlers;

public class GetAdminProductDetailsQueryHandler : IRequestHandler<GetAdminProductDetailsQuery, HandlerResult<AdminProductDetailsDto>>
{
    private readonly VevadaDbContext _dbContext;

    public GetAdminProductDetailsQueryHandler(VevadaDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<HandlerResult<AdminProductDetailsDto>> Handle(GetAdminProductDetailsQuery request, CancellationToken cancellationToken)
    {
        var product = await _dbContext.Products
            .AsNoTracking()
            .Where(p => p.Id == request.Id)
            .Select(p => new AdminProductDetailsDto(
                p.Id,
                p.ProductSeriesId,
                p.ProductSeries.Name,
                p.Name,
                p.ShortDescription,
                p.FullDescription,
                p.Price,
                p.Status,
                p.AvailableSizes,
                p.MainImageId,
                p.GalleryImages.OrderBy(g => g.ImageAssetId).Select(g => g.ImageAssetId).ToList()
            ))
            .FirstOrDefaultAsync(cancellationToken);

        if (product == null)
        {
            return HandlerResult<AdminProductDetailsDto>.Failure("Product not found.");
        }

        return HandlerResult<AdminProductDetailsDto>.Success(product);
    }
}
