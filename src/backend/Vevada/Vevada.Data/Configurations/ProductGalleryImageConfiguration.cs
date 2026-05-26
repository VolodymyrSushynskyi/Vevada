using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Vevada.Data.Entities;

namespace Vevada.Data.Configurations;

public class ProductGalleryImageConfiguration : IEntityTypeConfiguration<ProductGalleryImage>
{
    public void Configure(EntityTypeBuilder<ProductGalleryImage> builder)
    {
        builder.HasKey(x => new { x.ProductId, x.ImageAssetId });

        builder.HasOne(x => x.Product)
            .WithMany(x => x.GalleryImages)
            .HasForeignKey(x => x.ProductId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.ImageAsset)
            .WithMany()
            .HasForeignKey(x => x.ImageAssetId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
