namespace Vevada.Data.Entities;

public class ProductGalleryImage
{
    public Guid ProductId { get; set; }
    public Product Product { get; set; } = null!;

    public Guid ImageAssetId { get; set; }
    public ImageAsset ImageAsset { get; set; } = null!;
}
