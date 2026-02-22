using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Vevada.Data.Constants;
using Vevada.Data.Entities;

namespace Vevada.Data.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    private const int RefreshTokenHashMaxLength = 256;

    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.Property(u => u.RefreshTokenHash)
            .HasMaxLength(RefreshTokenHashMaxLength);

        builder.Property(u => u.IsAdminUser)
            .HasDefaultValue(false)
            .IsRequired();

        builder.HasOne(u => u.ClientDetails)
            .WithOne(cd => cd.User)
            .HasForeignKey<ClientDetails>(cd => cd.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
