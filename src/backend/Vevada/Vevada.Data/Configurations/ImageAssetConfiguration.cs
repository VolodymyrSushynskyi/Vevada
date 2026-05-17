using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Vevada.Data.Entities;

namespace Vevada.Data.Configurations;

public class ImageAssetConfiguration : IEntityTypeConfiguration<ImageAsset>
{
    public void Configure(EntityTypeBuilder<ImageAsset> builder)
    {
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Hash)
            .IsRequired()
            .HasMaxLength(64);

        builder.HasIndex(x => x.Hash)
            .IsUnique();

        builder.Property(x => x.OriginalWidth)
            .IsRequired();

        builder.Property(x => x.OriginalHeight)
            .IsRequired();
    }
}
