using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Vevada.Data.Entities;

namespace Vevada.Data.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    private const int RefreshTokenHashMaxLength = 256;

    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.Property(u => u.Email)
            .IsRequired()
            .HasMaxLength(255);

        builder.HasIndex(u => u.Email)
           .IsUnique();

        builder.Property(u => u.RefreshTokenHash)
            .HasMaxLength(RefreshTokenHashMaxLength);

        builder.Property(u => u.IsAdminUser)
            .HasDefaultValue(false)
            .IsRequired();
    }
}
