using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Vevada.Data.Entities;

namespace Vevada.Data.Configurations;

public class ProductReviewConfiguration : IEntityTypeConfiguration<ProductReview>
{
    public void Configure(EntityTypeBuilder<ProductReview> builder)
    {
        builder.HasKey(x => x.Id);

        builder
            .HasIndex(x => new { x.ProductId, x.UserId })
            .IsUnique();

        builder.ToTable(t => t.HasCheckConstraint("CK_ProductReview_Rating", "\"Rating\" >= 1 AND \"Rating\" <= 5"));

        builder
            .Property(x => x.Comment)
            .HasMaxLength(1000);

        builder
            .HasOne(x => x.Product)
            .WithMany(p => p.Reviews)
            .HasForeignKey(x => x.ProductId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasOne(x => x.User)
            .WithMany()
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
