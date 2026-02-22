using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Vevada.Data.Entities;

namespace Vevada.Data.Configurations;

public class ClientDetailsConfiguration : IEntityTypeConfiguration<ClientDetails>
{
    private const int FirstNameMaxLength = 50;
    private const int LastNameMaxLength = 50;
    private const int PhoneNumberMaxLength = 20;


    public void Configure(EntityTypeBuilder<ClientDetails> builder)
    {
        builder
            .HasKey(cd => cd.UserId);

        builder
            .HasOne(cd => cd.User)
            .WithOne(u => u.ClientDetails)
            .HasForeignKey<ClientDetails>(cd => cd.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .Property(cd => cd.FirstName)
            .HasMaxLength(FirstNameMaxLength);

        builder
            .Property(cd => cd.LastName)
            .HasMaxLength(LastNameMaxLength);

        builder
            .Property(cd => cd.PhoneNumber)
            .HasMaxLength(PhoneNumberMaxLength);
    }
}
