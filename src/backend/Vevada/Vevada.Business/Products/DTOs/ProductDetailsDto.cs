using Vevada.Data.Constants;

namespace Vevada.Business.Products.DTOs;

public record ProductDetailsDto(
    Guid Id,
    Guid SeriesId,
    string SeriesName,
    string Name,
    string? ShortDescription,
    string? FullDescription,
    decimal Price,
    List<ProductSize> AvailableSizes,
    Guid MainImageId,
    List<Guid> GalleryImageIds,
    List<ProductVariationDto> DesignVariations
);