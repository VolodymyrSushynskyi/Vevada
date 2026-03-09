using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Reflection;
using Vevada.Data.Entities;

namespace Vevada.Data;

public class VevadaDbContext : IdentityDbContext<User, Role, int>
{
    public DbSet<ClientDetails> ClientDetails { get; set; }

    public VevadaDbContext(DbContextOptions<VevadaDbContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
    }
}
