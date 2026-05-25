using MediatR;
using Microsoft.EntityFrameworkCore;
using Vevada.Business.Common;
using Vevada.Business.Products.Commands;
using Vevada.Data;
using Vevada.Data.Entities;

namespace Vevada.Business.Products.Handlers;

public class UpdateProductCommandHandler : IRequestHandler<UpdateProductCommand, HandlerResult<bool>>
{
    private readonly VevadaDbContext _dbContext;

    public UpdateProductCommandHandler(VevadaDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<HandlerResult<bool>> Handle(UpdateProductCommand request, CancellationToken cancellationToken)
    {
        var product = await _dbContext.Products
            .Include(p => p.GalleryImages)
            .FirstOrDefaultAsync(p => p.Id == request.Id, cancellationToken);

        if (product == null)
        {
            return HandlerResult<bool>.Failure("Product not found.");
        }

        if (product.MainImageId != request.MainImageId)
        {
            var mainImageExists = await _dbContext.ImageAssets
                .AnyAsync(i => i.Id == request.MainImageId, cancellationToken);

            if (!mainImageExists) return HandlerResult<bool>.Failure("The specified main image does not exist.");

            product.MainImageId = request.MainImageId;
        }

        var oldSeriesId = product.ProductSeriesId;
        bool seriesChanged = false;

        if (request.ProductSeriesId.HasValue)
        {
            if (product.ProductSeriesId != request.ProductSeriesId.Value)
            {
                var seriesExists = await _dbContext.ProductSeries
                    .AnyAsync(s => s.Id == request.ProductSeriesId, cancellationToken);

                if (!seriesExists) return HandlerResult<bool>.Failure("The specified Product Series does not exist.");

                product.ProductSeriesId = request.ProductSeriesId.Value;
                seriesChanged = true;
            }
        }
        else if (!string.IsNullOrWhiteSpace(request.NewSeriesName))
        {
            var newSeries = new ProductSeries { Name = request.NewSeriesName };
            _dbContext.ProductSeries.Add(newSeries);

            product.ProductSeries = newSeries;
            seriesChanged = true;
        }

        product.Name = request.Name;
        product.ShortDescription = request.ShortDescription ?? string.Empty;
        product.FullDescription = request.FullDescription ?? string.Empty;
        product.Price = request.Price;
        product.Status = request.Status;
        product.AvailableSizes = request.AvailableSizes;

        var requestImageIds = request.GalleryImageIds?.Distinct().ToList() ?? new List<Guid>();

        var imagesToRemove = product.GalleryImages
            .Where(g => !requestImageIds.Contains(g.ImageAssetId))
            .ToList();

        foreach (var imageToRemove in imagesToRemove)
        {
            product.GalleryImages.Remove(imageToRemove);
        }

        var currentGalleryIds = product.GalleryImages.Select(g => g.ImageAssetId).ToList();
        var imagesToAdd = requestImageIds
            .Where(id => !currentGalleryIds.Contains(id))
            .ToList();

        foreach (var imageId in imagesToAdd)
        {
            product.GalleryImages.Add(new ProductGalleryImage
            {
                ImageAssetId = imageId
            });
        }

        if (seriesChanged)
        {
            var remainingCount = await _dbContext.Products
                .CountAsync(p => p.ProductSeriesId == oldSeriesId, cancellationToken);

            if (remainingCount == 1)
            {
                var oldSeries = await _dbContext.ProductSeries.FindAsync(new object[] { oldSeriesId }, cancellationToken);
                if (oldSeries != null)
                {
                    _dbContext.ProductSeries.Remove(oldSeries);
                }
            }
        }

        await _dbContext.SaveChangesAsync(cancellationToken);

        return HandlerResult<bool>.Success(true);
    }
}
