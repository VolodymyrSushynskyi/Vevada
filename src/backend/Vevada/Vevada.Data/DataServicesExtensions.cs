using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Vevada.Data.Constants;
using Vevada.Data.Entities;
using Vevada.Data.Seeders;

namespace Vevada.Data;

public static class DataServicesExtensions
{
    public static IServiceCollection AddDataInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<VevadaDbContext>(options =>
        {
            options.UseNpgsql(configuration.GetConnectionString("DefaultConnection"));
        });

        // Moved from Program.cs!
        services.AddIdentityCore<User>()
            .AddRoles<Role>()
            .AddEntityFrameworkStores<VevadaDbContext>();

        // Seeders
        services.AddScoped<ISeeder, RoleSeeder>();
        services.AddScoped<ISeeder, UserSeeder>();

        return services;
    }

    public static async Task InitializeDatabaseAsync(this IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();

        var logger = scope.ServiceProvider.GetRequiredService<ILogger<VevadaDbContext>>();

        try
        {
            logger.LogApplyingMigrations();

            var dbContext = scope.ServiceProvider.GetRequiredService<VevadaDbContext>();
            await dbContext.Database.MigrateAsync();

            logger.LogMigrationsSuccess();

            var seeders = scope.ServiceProvider.GetServices<ISeeder>().OrderBy(s => s.Order);
            foreach (var seeder in seeders)
            {
                await seeder.SeedAsync();
            }
        }
        catch (Exception ex)
        {
            logger.LogDatabaseInitializationFailed(ex);
            throw;
        }
    }
}
