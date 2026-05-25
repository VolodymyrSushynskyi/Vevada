using MediatR;
using Microsoft.EntityFrameworkCore;
using Vevada.Business.Common;
using Vevada.Business.Products.Commands;
using Vevada.Data;
using Vevada.Data.Constants;
using Vevada.Data.Entities;

namespace Vevada.Business.Products.Handlers;

public class CreateProductCommandHandler : IRequestHandler<CreateProductCommand, HandlerResult<Guid>>
{
    private readonly VevadaDbContext _dbContext;

    public CreateProductCommandHandler(VevadaDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<HandlerResult<Guid>> Handle(CreateProductCommand request, CancellationToken cancellationToken)
    {
        var mainImageExists = await _dbContext.ImageAssets
            .AnyAsync(i => i.Id == request.MainImageId, cancellationToken);

        if (!mainImageExists)
        {
            return HandlerResult<Guid>.Failure("The specified main image does not exist.");
        }

        Guid targetSeriesId;

        if (request.ProductSeriesId.HasValue)
        {
            var seriesExists = await _dbContext.ProductSeries
                .AnyAsync(s => s.Id == request.ProductSeriesId, cancellationToken);

            if (!seriesExists)
            {
                return HandlerResult<Guid>.Failure("The specified Product Series does not exist.");
            }

            targetSeriesId = request.ProductSeriesId.Value;
        }
        else
        {
            var newSeries = new ProductSeries { Name = request.NewSeriesName! };
            _dbContext.ProductSeries.Add(newSeries);
            targetSeriesId = newSeries.Id;
        }

        var product = new Product
        {
            ProductSeriesId = targetSeriesId,
            Name = request.Name,
            ShortDescription = request.ShortDescription,
            FullDescription = request.FullDescription,
            Price = request.Price,
            Status = request.Status,
            AvailableSizes = request.AvailableSizes,
            MainImageId = request.MainImageId
        };

        if (request.GalleryImageIds != null && request.GalleryImageIds.Any())
        {
            foreach (var imageId in request.GalleryImageIds.Distinct())
            {
                product.GalleryImages.Add(new ProductGalleryImage
                {
                    ImageAssetId = imageId
                });
            }
        }

        _dbContext.Products.Add(product);

        await _dbContext.SaveChangesAsync(cancellationToken);

        return HandlerResult<Guid>.Success(product.Id);
    }
}
