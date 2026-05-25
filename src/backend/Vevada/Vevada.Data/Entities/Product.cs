using Vevada.Data.Constants;
using Vevada.Data.Entities.Base;

namespace Vevada.Data.Entities;

public class Product : IAuditableEntity
{
    public Guid Id { get; set; }

    public Guid ProductSeriesId { get; set; }
    public ProductSeries ProductSeries { get; set; } = null!;

    public string Name { get; set; } = string.Empty;
    public string? ShortDescription { get; set; }
    public string? FullDescription { get; set; }
    public decimal Price { get; set; }
    public ProductStatus Status { get; set; }

    public List<ProductSize> AvailableSizes { get; set; } = new();

    public Guid MainImageId { get; set; }
    public ImageAsset MainImage { get; set; } = null!;

    public ICollection<ProductGalleryImage> GalleryImages { get; set; } = new List<ProductGalleryImage>();

    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset? UpdatedAt { get; set; }
}
