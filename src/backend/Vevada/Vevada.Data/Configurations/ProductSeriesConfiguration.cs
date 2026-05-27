using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Vevada.Data.Entities;

namespace Vevada.Data.Configurations;

public class ProductSeriesConfiguration : IEntityTypeConfiguration<ProductSeries>
{
    public void Configure(EntityTypeBuilder<ProductSeries> builder)
    {
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Name)
            .IsRequired()
            .HasMaxLength(150);

        builder.HasMany(x => x.Products)
            .WithOne(x => x.ProductSeries)
            .HasForeignKey(x => x.ProductSeriesId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
