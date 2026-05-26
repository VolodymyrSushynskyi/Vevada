using Vevada.Data.Constants;

namespace Vevada.Business.Products.DTOs;

public record AdminProductDetailsDto(
    Guid Id,
    Guid ProductSeriesId,
    string SeriesName,
    string Name,
    string? ShortDescription,
    string? FullDescription,
    decimal Price,
    ProductStatus Status,
    List<ProductSize> AvailableSizes,
    Guid MainImageId,
    List<Guid> GalleryImageIds
);
