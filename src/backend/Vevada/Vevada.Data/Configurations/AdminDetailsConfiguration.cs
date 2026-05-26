using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Vevada.Data.Entities;

namespace Vevada.Data.Configurations;

public class AdminDetailsConfiguration : IEntityTypeConfiguration<AdminDetails>
{
    private const int FirstNameMaxLength = 50;
    private const int LastNameMaxLength = 50;

    public void Configure(EntityTypeBuilder<AdminDetails> builder)
    {
        builder.HasKey(ad => ad.UserId);

        builder.Property(ad => ad.FirstName)
            .IsRequired()
            .HasMaxLength(FirstNameMaxLength);

        builder.Property(ad => ad.LastName)
            .IsRequired()
            .HasMaxLength(LastNameMaxLength);

        builder.HasOne(ad => ad.User)
            .WithOne()
            .HasForeignKey<AdminDetails>(ad => ad.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
