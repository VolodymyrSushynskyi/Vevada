using Vevada.Data.Constants;

namespace Vevada.Business.Products.DTOs;

public record AdminProductListItemDto(
    Guid Id,
    Guid MainImageId,
    string Name,
    ProductStatus Status,
    DateTimeOffset LastModified
);
