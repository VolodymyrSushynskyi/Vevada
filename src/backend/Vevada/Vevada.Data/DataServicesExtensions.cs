using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Vevada.Data.Entities;
using Vevada.Data.Seeders;

namespace Vevada.Data;

public static class DataServicesExtensions
{
    public static void AddDbContext(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<VevadaDbContext>(options =>
        {
            options.UseNpgsql(configuration.GetConnectionString("DefaultConnection"));
        });
    }

    public static void AddSeeders(this IServiceCollection services)
    {
        services.AddScoped<ISeeder, RoleSeeder>();
        services.AddScoped<ISeeder, UserSeeder>();
    }

    public static async Task MigrateDatabaseAsync(IServiceScope serviceScope)
    {
        var dbContext = serviceScope.ServiceProvider.GetRequiredService<VevadaDbContext>();
        await dbContext.Database.MigrateAsync();
    }

    public static async Task SeedDatabaseAsync(IServiceScope serviceScope)
    {
        var seeders = serviceScope.ServiceProvider.GetServices<ISeeder>().OrderBy(s => s.Order);
        foreach (var seeder in seeders)
        {
            await seeder.SeedAsync();
        }
    }
}
