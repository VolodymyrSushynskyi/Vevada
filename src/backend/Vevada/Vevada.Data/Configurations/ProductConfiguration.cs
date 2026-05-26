using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Vevada.Data.Entities;

namespace Vevada.Data.Configurations;

public class ProductConfiguration : IEntityTypeConfiguration<Product>
{
    public void Configure(EntityTypeBuilder<Product> builder)
    {
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Name)
            .IsRequired()
            .HasMaxLength(150);

        builder.Property(x => x.ShortDescription)
            .HasMaxLength(500);

        builder.Property(x => x.FullDescription)
            .HasMaxLength(1500);

        builder.Property(x => x.Price)
            .HasColumnType("numeric(18,2)")
            .IsRequired();

        builder.Property(x => x.AvailableSizes)
            .HasColumnType("integer[]");

        builder.HasOne(x => x.MainImage)
            .WithMany()
            .HasForeignKey(x => x.MainImageId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
