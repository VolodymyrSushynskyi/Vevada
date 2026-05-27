namespace Vevada.Business.Products.DTOs;

public record CatalogProductDto(
    Guid Id,
    Guid SeriesId,
    string Name,
    decimal Price,
    Guid MainImageId
);
