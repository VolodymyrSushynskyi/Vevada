using MediatR;
using Vevada.Business.Common;
using Vevada.Data.Constants;

namespace Vevada.Business.Products.Commands;

public record CreateProductCommand(
    Guid? ProductSeriesId,
    string? NewSeriesName,
    string Name,
    string? ShortDescription,
    string? FullDescription,
    decimal Price,
    ProductStatus Status,
    List<ProductSize> AvailableSizes,
    Guid MainImageId,
    List<Guid> GalleryImageIds
) : IRequest<HandlerResult<Guid>>;
