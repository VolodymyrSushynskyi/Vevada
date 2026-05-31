using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Reflection;
using Vevada.Data.Entities;
using Vevada.Data.Entities.Base;

namespace Vevada.Data;

public class VevadaDbContext : IdentityDbContext<User, Role, int>
{
    public DbSet<ClientDetails> ClientDetails { get; set; }
    public DbSet<ImageAsset> ImageAssets { get; set; }
    public DbSet<Product> Products { get; set; }
    public DbSet<ProductSeries> ProductSeries { get; set; }
    public DbSet<ProductGalleryImage> ProductGalleryImages { get; set; }
    public DbSet<AdminDetails> AdminDetails { get; set; }
    public DbSet<Cart> Carts { get; set; }
    public DbSet<CartItem> CartItems { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }
    public DbSet<FavoriteItem> FavoriteItems { get; set; }

    public VevadaDbContext(DbContextOptions<VevadaDbContext> options) : base(options)
    {
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        var entries = ChangeTracker.Entries<IAuditableEntity>()
            .Where(e => e.State == EntityState.Added || e.State == EntityState.Modified);

        var now = DateTimeOffset.UtcNow;

        foreach (var entry in entries)
        {
            if (entry.State == EntityState.Added)
            {
                entry.Entity.CreatedAt = now;
            }
            else if (entry.State == EntityState.Modified)
            {
                entry.Entity.UpdatedAt = now;
            }
        }

        return base.SaveChangesAsync(cancellationToken);
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
    }
}
