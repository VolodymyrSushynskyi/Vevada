using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Vevada.Data.Constants;
using Vevada.Data.Entities;

namespace Vevada.Data.Seeders;

public class RoleSeeder : ISeeder
{
    public const int ExecutionOrder = 1;
    public int Order => ExecutionOrder;

    private readonly RoleManager<Role> _roleManager;
    private readonly ILogger<RoleSeeder> _logger;

    public RoleSeeder(RoleManager<Role> roleManager, ILogger<RoleSeeder> logger)
    {
        _roleManager = roleManager;
        _logger = logger;
    }

    public async Task<int> SeedAsync()
    {
        _logger.LogSeedingStarted(nameof(RoleSeeder));

        int seededCount = 0;

        foreach (var role in AppRoles.All)
        {
            if (!await _roleManager.RoleExistsAsync(role.Name!))
            {
                var result = await _roleManager.CreateAsync(role);

                if (result.Succeeded)
                {
                    seededCount++;
                }
                else
                {
                    var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                    throw new InvalidOperationException($"Failed to seed role {role.Name}: {errors}");
                }
            }
        }

        _logger.LogSeedingCompleted(nameof(RoleSeeder), seededCount);

        return seededCount;
    }
}