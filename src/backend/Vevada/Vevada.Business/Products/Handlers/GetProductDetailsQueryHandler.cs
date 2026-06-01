using MediatR;
using Microsoft.EntityFrameworkCore;
using Vevada.Business.Common;
using Vevada.Business.Products.DTOs;
using Vevada.Business.Products.Queries;
using Vevada.Data;
using Vevada.Data.Constants;

namespace Vevada.Business.Products.Handlers;

public class GetProductDetailsQueryHandler : IRequestHandler<GetProductDetailsQuery, HandlerResult<ProductDetailsDto>>
{
    private readonly VevadaDbContext _dbContext;

    public GetProductDetailsQueryHandler(VevadaDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<HandlerResult<ProductDetailsDto>> Handle(GetProductDetailsQuery request, CancellationToken cancellationToken)
    {
        var product = await _dbContext.Products
            .AsNoTracking()
            .Where(p => p.Id == request.Id && p.Status == ProductStatus.Published)
            .Select(p => new ProductDetailsDto(
                p.Id,
                p.ProductSeriesId,
                p.ProductSeries.Name,
                p.Name,
                p.ShortDescription,
                p.FullDescription,
                p.Price,
                p.AvailableSizes,
                p.MainImageId,
                p.GalleryImages.OrderBy(g => g.ImageAssetId).Select(g => g.ImageAssetId).ToList(),
                p.ProductSeries.Products
                    .Where(sibling => sibling.Status == ProductStatus.Published)
                    .Select(sibling => new ProductVariationDto(
                        sibling.Id,
                        sibling.MainImageId
                    ))
                    .ToList(),
                p.Reviews.Any() ? Math.Round(p.Reviews.Average(r => (double)r.Rating), 1) : 0,
                p.Reviews.Count()
            ))
            .FirstOrDefaultAsync(cancellationToken);

        if (product == null)
        {
            return HandlerResult<ProductDetailsDto>.Failure("Product not found.");
        }

        return HandlerResult<ProductDetailsDto>.Success(product);
    }
}
